const http = require("http");

http.createServer((req, res) => {
	res.write("hemlllooo!!");
	res.end();
}).listen(3000);

console.log("Listening on port 3000");
