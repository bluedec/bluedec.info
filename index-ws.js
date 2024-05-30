const express = require("express");
const server = require("http").createServer();
const app = express();

app.get('/', (req, res) => {
	res.sendFile('src/index.html', {root: __dirname});
});

server.on('request', app);
server.listen(3001, () => { 
	console.log('server started on port 3001');
});

/* Begin Web Sockets */

const WebSocketServer = require("ws").Server;

const wss = new WebSocketServer({server: server});

wss.on("connection", (socketConn) => {

	const numClients = wss.clients.size;

	console.log(`Clients connected ${numClients}`);
	console.log(socketConn.readyState);
	wss.broadcast(`Current visitors: ${numClients}`);

	if (socketConn.readyState === socketConn.OPEN) {
		socketConn.send("Welcome to my server!");
		wss.broadcast(`Somebody joined!`)
	} 
	socketConn.on('close', () => {
		console.log("Somebody left!");
		wss.broadcast(`Somebody left!`);
	});
});

wss.broadcast = function broadcast(data) {
	wss.clients.forEach((client) => {
		client.send(data);
	});
}
