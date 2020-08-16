const webSocketsServerPort = 8000;
const webSocketServer = require("websocket").server;
const http = require("http");

const server = http.createServer();
server.listen(webSocketsServerPort, () => {
  console.log(`Server is listening at ${webSocketsServerPort}`);
});

const wsServer = new webSocketServer({
  httpServer: server
});

const clients = {};
const game = {};
let winner = "";
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

  console.log(`In {${Object.getOwnPropertyNames(clients)}} `);

  connection.on("message", message => {
    console.log(`Received Message`, message.utf8Data);

    const result = JSON.parse(message.utf8Data);

    if(result.method === "start"){
      console.log("Game started");
      const clientId = result.clientId;
      const gameId = getUniqueID();
      game[gameId] = {
        "id": gameId,
        "clients": []
      }

      const payLoad = {
        "method": "start",
        "game": game[gameId]
      }

      const con = clients[clientId].connection;
      con.send(JSON.stringify(payLoad));
    }

    if(result.method === "join"){
      console.log("Join Button Clicked >>>", result.clientId);

      const clientId = result.clientId;
      const gameId = result.gameId;
      const activeGame = game[gameId];

      if(activeGame.clients.length >= 2){
        // Exceeded Max Number of Player
        return null;
      }

      // const symbol = {"0": "Circle", "1": "Cross"}[activeGame.clients.length];

      activeGame.clients.push({
        "clientId": clientId,
        "symbol": ""
      });

      // Start Game if there are 2 players
      if(activeGame.clients.length === 2){
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

      if(checkAvailability(selectedCell)){
        board[selectedCell - 1].isSelected = true;
        board[selectedCell - 1].clientId = clientId;
        board[selectedCell - 1].symbol = symbol;

        console.log("Has Winner!!!", checkWinningPattern(clientId));
        console.log("Winner Name!!!", winner);

        updateGameState();

      }
    }

    // Reset Game
    if(result.method === "reset"){

      winner = "";

      for(cell of board){
        cell["isSelected"] = false;
        cell["clientId"] = "";
        cell["symbol"] = "";
      }

      console.log("New Game ", board)

      // const payload = {
      //   "method": "reset",
      //   "board": board,
      // }

      // connection.send(JSON.stringify(payload));
      updateGameState();
    }

    // Exit Game
    if(result.method === "exit"){
      const clientId = result.clientId;
      const activeGame = game[result.gameId];

      const exitClientIdIndex = activeGame.clients.findIndex(c => c.clientId === clientId);

      activeGame.clients.splice(exitClientIdIndex, 1);
      
      console.log("game", activeGame.clients);
      // console.log("game index", activeGame.clients.findIndex(c => c.clientId === clientId));
    }

    if(result.method === "chooseSymbolCircle"){
      const clientId = result.clientId;
      const gameId = result.gameId;
      const activeGame = game[gameId];

      const symbolClientIdIndex = activeGame.clients.findIndex(c => c.clientId === clientId);
      const symbolArr = activeGame.clients.map(c => c.symbol);

      // Check is Symbol is unused
      if(symbolArr.findIndex(symbol => symbol === "Circle") === -1){
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
      const gameId = result.gameId;
      const activeGame = game[gameId];

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

    // Generate new Client ID
    const clientId = getUniqueID();
    console.log("New ClientId " + clientId);
    clients[clientId] = {
      "connection": connection
    }

    const payload = {
      "method": "connect",
      "clientId": clientId,
      "gameId": game
    }

    // Send Back the client
    connection.send(JSON.stringify(payload));
});

const updateGameState = () => {
  for(const g of Object.keys(game)){
    const games = game[g];
    const payLoad = {
      "method": "update",
      "game": games,
      "board": board,
      "winner": winner
    }

    games.clients.forEach(c => {
      clients[c.clientId].connection.send(JSON.stringify(payLoad));
    })
  }
}

const checkWinningPattern = (activePlayer) => {
  // Check All Winning Pattern
  let hasWinner = false;

  // Filter with clientID
  const playerCells = board.filter(cell => cell.clientId === activePlayer)
                           .map(cell => cell.cellNo);

  console.log("ActivePlayer has these cells", playerCells)
  // Check if it has any of these 8 patterns
    // 1,2,3 
    if([1,2,3].every(c => playerCells.includes(c))){
      winner = activePlayer;
      return !hasWinner;
    }
    if([1,4,7].every(c => playerCells.includes(c))){
      winner = activePlayer;
      return !hasWinner;
    }
    if([4,5,6].every(c => playerCells.includes(c))){
      winner = activePlayer;
      return !hasWinner;
    }
    if([7,8,9].every(c => playerCells.includes(c))){
      winner = activePlayer;
      return !hasWinner;
    }
    if([2,5,8].every(c => playerCells.includes(c))){
      winner = activePlayer;
      return !hasWinner;
    }
    if([3,6,9].every(c => playerCells.includes(c))){
      winner = activePlayer;
      return !hasWinner;
    }
    if([1,5,9].every(c => playerCells.includes(c))){
      winner = activePlayer;
      return !hasWinner;
    }
    if([3,5,7].every(c => playerCells.includes(c))){
      winner = activePlayer;
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