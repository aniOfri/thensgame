const express = require('express');
const cors = require('cors');
const http = require('http');
const {createServer: createViteServer} = require('vite');
const path = require("path");
const {Server} = require("socket.io");
const forceSsl = require('force-ssl-heroku');


const createServer = async () =>
{
	var sockets = 0;

	const app = express();

	app.use(cors());

	const vite = await createViteServer({
		server: { middlewareMode: 'html' }
	});

	app.use(vite.middlewares);
	
	app.use(forceSsl);

	app.use(express.static(path.join(__dirname)));

	const server = http.createServer(app);

	const io = new Server(server);

	io.on("connection", (socket) =>{
		console.log(socket.id+" connected.");
		
		socket.on("send_answer", (data) =>{
			console.log(socket.id +" answered "+data);
			socket.to(data.room).emit("recieve_answer", data);
		})

		socket.on("send_question", (data) =>{
			socket.broadcast.to(data.room).emit("receive_question", data.settlements);
		});

		socket.on("join_room", (data) =>{
			socket.join(data.room);
			sockets += 1;
			console.log("Emitting \""+sockets+"\" to room "+data.room);
			socket.broadcast.to(data.room).emit("current_users", sockets);
		});

		socket.on("request_users", (room) =>{
			console.log("Emitting \""+sockets+"\" to room "+room);
			socket.broadcast.to(room).emit("current_users", sockets);
		});

		socket.on("disconnecting", ()=>{
			sockets -= 1;
			if (sockets < 0)
				sockets = 0;

			console.log(socket.id +" disconnected.");
		});
	})

	server.listen(3000, ()=>{
		console.log("SERVER RUNNING.");
	})
};

createServer();