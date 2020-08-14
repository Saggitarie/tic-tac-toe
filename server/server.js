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
const board = [
  [
    {cellNo: 1, isSelected: false},
    {cellNo: 2, isSelected: false},
    {cellNo: 3, isSelected: false}
  ],
  [
    {cellNo: 4, isSelected: false},
    {cellNo: 5, isSelected: false},
    {cellNo: 6, isSelected: false}
  ],
  [
    {cellNo: 7, isSelected: false},
    {cellNo: 8, isSelected: false},
    {cellNo: 9, isSelected: false}
  ]
]

const getUniqueID = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return s4() + s4() + '-' + s4();
};

wsServer.on("request", (request) => {

  console.log((new Date()) + ' Received a new connection from origin ' + request.origin + '.');
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

      const symbol = {"0": "Circle", "1": "Cross"}[activeGame.clients.length];

      activeGame.clients.push({
        "clientId": clientId,
        "symbol": symbol
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
      "game": games
    }

    games.clients.forEach(c => {
      clients[c.clientId].connection.send(JSON.stringify(payLoad));
    })
  }

  setTimeout(updateGameState, 500);
}