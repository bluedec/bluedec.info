const express = require('express');
const server = require('http').createServer();
const app = express();
const PORT = 3000;

app.get('/', function(req, res) {
  res.sendFile('index.html', {root: __dirname});
});

server.on('request', app);

server.listen(PORT, function () { console.log('Listening on ' + PORT); });

process.on("SIGINT", () => {
  console.log("Exiting...")
  wss.clients.forEach((client) => {
    client.close();
  });
  server.close(() => {
    shutdownDatabase();
  });
});

/** Websocket **/
const WebSocketServer = require('ws').Server;

const wss = new WebSocketServer({ server: server });

wss.on('connection', function connection(ws) {
  const numClients = wss.clients.size;

  console.log('clients connected: ', numClients);

  wss.broadcast(`Current visitors: ${numClients}`);

  insertVisitor("jesus saez!", 15)
  getCount();
  getTableColumns("visitors");


  if (ws.readyState === ws.OPEN) {
    ws.send('welcome!');
  }

  ws.on('close', function close() {
    wss.broadcast(`Current visitors: ${wss.clients.size}`);
    console.log('A client has disconnected');
  });

  ws.on('error', function error() {
    //
  });
});

/**
 * Broadcast data to all connected clients
 * @param  {Object} data
 * @void
 */
wss.broadcast = function broadcast(data) {
  console.log('Broadcasting: ', data);
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};

/** End Websocket **/

const sqlite = require("sqlite3")

const db = new sqlite.Database(":memory:");

db.serialize(() => {
  console.log("Serializing");
  db.run(`
    CREATE TABLE visitors (
      name TEXT,
      age NUMBER
    )
  `);
});

const insertVisitor = (name, age) => {
  db.run(`
    INSERT INTO visitors (name, age) 
    VALUES ("${name}", ${age})
  `);
}

const getTableColumns = (table) => {
  db.run(`SELECT * FROM ${table} LIMIT 0`, (err, row) => {
    console.log(row)
  });
}

const getCount = () => {
  console.log("Counting");
  db.each(`SELECT * FROM visitors`, (err, row) => {
    console.log(row)
  });
}

const shutdownDatabase = () => {
  getCount();
  console.log("Shutting down!");

}




