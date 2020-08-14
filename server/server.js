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

const getUniqueID = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return s4() + s4() + '-' + s4();
};

wsServer.on("request", (request) => {
  // let userId = getUniqueID();

  console.log((new Date()) + ' Received a new connection from origin ' + request.origin + '.');
  const connection = request.accept(null, request.origin);
  // connection.on("open", () => console.log("opened"));
  // connection.on("closed", () => console.log("closed"));
  // clients[userId] = connection;
  console.log(`In {${Object.getOwnPropertyNames(clients)}} `);

  connection.on("message", message => {
    console.log(`Received Message`, message.utf8Data);

    });

        // Generate new Client ID
        const clientId = getUniqueID();
        console.log("New ClientId " + clientId);
        clients[clientId] = {
          "connection": connection
        }
    
        const payload = {
          "method": "connect",
          "clientId": clientId
        }
    
        // Send Back the client
        connection.send(JSON.stringify(payload));
})