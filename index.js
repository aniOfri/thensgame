const express = require('express');
const cors = require('cors');
const http = require('http');
const {createServer: createViteServer} = require('vite');
const path = require("path");
const {Server} = require("socket.io");
const forceSsl = require('force-ssl-heroku');

var sockets = [];

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

	const server = http.createServer(app);

	const io = new Server(server);

	io.on("connection", (socket) =>{
		console.log(socket.id+" connected.");
		
		socket.on("send_answer", (data) =>{
			console.log(socket.id +" answered "+data);
			socket.to(data.room).emit("recieve_answer", data);
		})

		socket.on("join_room", (data) =>{
			socket.join(data.room);
			sockets.push({
				key: socket.id,
				value: data.name
			});
			socket.broadcast.to(data.room).emit("current_users", sockets);
		});

		socket.on("request_users", (room) =>{
			socket.broadcast.to(room).emit("current_users", sockets);
		});

		socket.on("disconnecting", ()=>{
			var rooms = Object.keys(socket.rooms);
			
			let i = 0;
			while (i < sockets.length){
				if (sockets[i].key == socket.id){
					sockets.splice(i, 1);
					i = sockets.length;
				} 
				i++;
			}

			rooms.forEach(function(room){
				socket.to(room).emit("current_users", sockets);
			});

			console.log(socket.id +" disconnected.");
			console.log(sockets);
		});
	})

	server.listen(3000, ()=>{
		console.log("SERVER RUNNING.");
	})
};

createServer();