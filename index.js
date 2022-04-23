const express = require('express');
const cors = require('cors');
const http = require('http');
const {createServer: createViteServer} = require('vite');
const path = require("path");
const {Server} = require("socket.io");
const forceSsl = require('force-ssl-heroku');

const createServer = async () =>
{
	const app = express();

	app.use(cors());

	const vite = await createViteServer({
		server: { middlewareMode: 'html' }
	});

	app.use(vite.middlewares);
	
	app.use(forceSsl);

	app.use(express.static(path.join(__dirname)));

	//app.listen(app.get('port'));

	const server = http.createServer(app);

	const io = new Server(server);

	io.on("connection", (socket) =>{
		console.log(socket.id+" connected.");
		
		socket.on("join_room", (data) =>{
			socket.join(data);
			console.log(socket.id+ " joined room number #"+data);
		});

		socket.on("disconnect", ()=>{
			console.log(socket.id +" disconnected.");
		});
	})

	server.listen(3000, ()=>{
		console.log("SERVER RUNNING.");
	})
};

createServer();