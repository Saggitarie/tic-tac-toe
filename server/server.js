const webSocketsServerPort = 8000;
const webSocketServer = require("websocket").server;
const http = require("http");

const server = http.createServer();
server.listen(process.env.PORT || webSocketsServerPort, () => {
  console.log(`Server is listening at ${webSocketsServerPort}`);
});

const wsServer = new webSocketServer({
  httpServer: server
});

let clients = {};
let game = {};
let winner = "";
let turn = "";
let gameId = "";
let gameStatus = "stop";
const board = 
  [
    {cellNo: 1, isSelected: false, clientId: "", symbol: ""},
    {cellNo: 2, isSelected: false, clientId: "", symbol: ""},
    {cellNo: 3, isSelected: false, clientId: "", symbol: ""},
    {cellNo: 4, isSelected: false, clientId: "", symbol: ""},
    {cellNo: 5, isSelected: false, clientId: "", symbol: ""},
    {cellNo: 6, isSelected: false, clientId: "", symbol: ""},
    {cellNo: 7, isSelected: false, clientId: "", symbol: ""},
    {cellNo: 8, isSelected: false, clientId: "", symbol: ""},
    {cellNo: 9, isSelected: false, clientId: "", symbol: ""}
];

wsServer.on("request", (request) => {
  const connection = request.accept(null, request.origin);

  console.log("connection", connection);

  connection.on("close", message => {
    console.log("Game closed");

    clients = {};
    game = {};
    winner = "";
    turn = "";
    gameId = "";
    gameStatus = "stop";

    for(cell of board){
      cell["isSelected"] = false;
      cell["clientId"] = "";
      cell["symbol"] = "";
    }
  })

  connection.on("message", message => {
    const result = JSON.parse(message.utf8Data);

    if(result.method === "start"){
      console.log("Game started");
      const clientId = result.clientId;

      if(!clientId) return;

      if(!gameId){
        gameId = getUniqueID();

        game[gameId] = {
          "id": gameId,
          "clients": []
        }
      }

      const payLoad = {
        "method": "start",
        "game": game[gameId]
      }

      console.log("ClientId >>>",clientId);

      if(!clients[clientId]) return;

      const con = clients[clientId].connection;
      con.send(JSON.stringify(payLoad));
    }

    if(result.method === "join"){
      const clientId = result.clientId;
      const activeGame = game[gameId];

      if(activeGame.clients.length >= 2){
        // Exceeded Max Number of Player
        return null;
      }

      console.log("Turn Check>>>");
      if(!turn){
        turn = clientId;
      }
      console.log("Turn Check Passed >>>", turn);

      activeGame.clients.push({
        "clientId": clientId,
        "symbol": ""
      });

      console.log(activeGame.clients);
      

      // Start Game if there are 2 players
      if(activeGame.clients.length === 2){
        console.log("Two Players! To Play Game");
        gameStatus = "running";
        updateGameState();
      }

      const payLoad = {
        "method": "join",
        "game": game
      }

      // Notify other clients that their opponent has joined
      activeGame.clients.forEach(c => {
        clients[c.clientId].connection.send(JSON.stringify(payLoad));
      });
    }

    // Initialize Board Before Game Starts
    if(result.method === "initializeBoard"){
      const clientId = result.clientId;

      const payLoad = {
        "method": "initializeBoard",
        "board": board
      }

      clients[clientId].connection.send(JSON.stringify(payLoad));
    }

    // Update Board After Player Selects Cell
    if(result.method === "playerMove"){
      const clientId = result.clientId;
      const selectedCell = result.cellNo;
      const symbol = result.symbol;
      const activeGame = game[gameId];

      console.log("PlayerMove GameStatus Check Start")
      if(gameStatus === "stop") return;
      console.log("PlayerMove GameStatus Check Finished >>> Running")

      console.log("Player >>>>", clientId);
      console.log("Your turn??>>>>>", turn);
      if(turn !== clientId) return;

      // Check if the active player chose their symbol before making their move.
      const targetPlayer  = activeGame.clients.find(c => c.clientId === clientId);

      if(!targetPlayer.symbol) return;

      if(checkAvailability(selectedCell)){
        board[selectedCell - 1].isSelected = true;
        board[selectedCell - 1].clientId = clientId;
        board[selectedCell - 1].symbol = symbol;

        let isSelectedArr = board.map(cell => cell.isSelected);
        checkWinningPattern(clientId);

        if(isSelectedArr.every(e => e === true)){
          winner = "Draw"
          gameStatus = "stop"
        }

        const activePlayerIndex = activeGame.clients.findIndex(c => c.clientId === clientId);

        if(activePlayerIndex === 0){
          turn = activeGame.clients[1].clientId;
        }else{
          turn = activeGame.clients[0].clientId;
        }

        updateGameState();
      }
    }

    // Reset Game
    if(result.method === "reset"){
      const clientId = result.clientId;
      const activeGame = game[gameId];

      const activePlayerIndex = activeGame.clients.findIndex(c => c.clientId === clientId);

      if(activePlayerIndex === 0){
        turn = activeGame.clients[1].clientId;
      }else{
        turn = activeGame.clients[0].clientId;
      }

      winner = "";
      gameStatus = "running";

      for(cell of board){
        cell["isSelected"] = false;
        cell["clientId"] = "";
        cell["symbol"] = "";
      }
      updateGameState();
    } 

    // Exit Game
    if(result.method === "exit"){
      const clientId = result.clientId;
      const activeGame = game[result.gameId];

      const exitClientIdIndex = activeGame.clients.findIndex(c => c.clientId === clientId);

      activeGame.clients.splice(exitClientIdIndex, 1);

      gameStatus = "stop";

      for(cell of board){
        cell["isSelected"] = false;
        cell["clientId"] = "";
        cell["symbol"] = "";
      }
      
      const payLoad = {
        "method": "exit",
        "board": board,
        "symbol": "reset"
      }
  
      activeGame.clients.forEach(c => {
        clients[c.clientId].connection.send(JSON.stringify(payLoad));
      })
    }

    // Choose Symbol to Play Game
    if(result.method === "chooseSymbolCircle"){
      const clientId = result.clientId;
      const activeGame = game[gameId];

      console.log("clientId>>>>>", clientId);
      console.log("activeGame", activeGame);

      const symbolClientIdIndex = activeGame.clients.findIndex(c => c.clientId === clientId);
      console.log("symbolClientIdIndex>>>>>", symbolClientIdIndex);
      const symbolArr = activeGame.clients.map(c => c.symbol);

      console.log("symbolArr>>>>>", symbolArr);

      // Check is Symbol is unused
      if(symbolArr.findIndex(symbol => symbol === "Circle") === -1){
        // if(!activeGame.clients[symbolClientIdIndex]) return;
        activeGame.clients[symbolClientIdIndex].symbol = "Circle";

        const payLoad = {
          "method": "chooseSymbolCircle",
          "symbol": "Circle"
        }

        const con = clients[clientId].connection;
        con.send(JSON.stringify(payLoad));
      }
    }

    if(result.method === "chooseSymbolCross"){
      const clientId = result.clientId;
      const activeGame = game[gameId];

      if(!clientId) return;

      const symbolClientIdIndex = activeGame.clients.findIndex(c => c.clientId === clientId);
      const symbolArr = activeGame.clients.map(c => c.symbol);

      // Check is Symbol is unused
      if(symbolArr.findIndex(symbol => symbol === "Cross") === -1){

        activeGame.clients[symbolClientIdIndex].symbol = "Cross";

        const payLoad = {
          "method": "chooseSymbolCross",
          "symbol": "Cross"
        }

        const con = clients[clientId].connection;
        con.send(JSON.stringify(payLoad));
      }
    }
  });

  // Generate New ClientID using GUID
  const clientId = getUniqueID();
  clients[clientId] = {
    "connection": connection
  }

  const payload = {
    "method": "connect",
    "clientId": clientId,
    "gameId": game
  }

  console.log("Connected");
  connection.send(JSON.stringify(payload));
});

const updateGameState = () => {
  for(const g of Object.keys(game)){
    const games = game[g];
    const payLoad = {
      "method": "update",
      "game": games,
      "board": board,
      "winner": winner,
      "turn": turn
    }

    games.clients.forEach(c => {
      clients[c.clientId].connection.send(JSON.stringify(payLoad));
    })
  }
}

const checkWinningPattern = (activePlayer) => {
  // Check All Winning Pattern
  let hasWinner = false;

  const playerCells = board.filter(cell => cell.clientId === activePlayer)
                           .map(cell => cell.cellNo);

  if([1,2,3].every(c => playerCells.includes(c))){
    winner = activePlayer;
    gameStatus = "stop"
    return !hasWinner;
  }
  if([1,4,7].every(c => playerCells.includes(c))){
    winner = activePlayer;
    gameStatus = "stop"
    return !hasWinner;
  }
  if([4,5,6].every(c => playerCells.includes(c))){
    winner = activePlayer;
    gameStatus = "stop"
    return !hasWinner;
  }
  if([7,8,9].every(c => playerCells.includes(c))){
    winner = activePlayer;
    gameStatus = "stop"
    return !hasWinner;
  }
  if([2,5,8].every(c => playerCells.includes(c))){
    winner = activePlayer;
    gameStatus = "stop"
    return !hasWinner;
  }
  if([3,6,9].every(c => playerCells.includes(c))){
    winner = activePlayer;
    gameStatus = "stop"
    return !hasWinner;
  }
  if([1,5,9].every(c => playerCells.includes(c))){
    winner = activePlayer;
    gameStatus = "stop"
    return !hasWinner;
  }
  if([3,5,7].every(c => playerCells.includes(c))){
    winner = activePlayer;
    gameStatus = "stop"
    return !hasWinner;
  }

  return hasWinner;
}

const checkAvailability = (cellNo) => {
  if(!board[cellNo - 1].isSelected){
    return true;
  } 

  return false;
}

const getUniqueID = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);

  return s4() + s4() + '-' + s4();
};