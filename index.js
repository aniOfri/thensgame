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
		server: { middlewareMode: 'ssr' }
	});

	app.use(vite.middlewares);
	
	app.use(forceSsl);

	app.use(express.static(path.join(__dirname, 'dist')));

	app.get('/', async (req, res) =>
	{
		res.sendFile(path.join(__dirname, 'dist', 'index.html'));
	});

	const server = http.createServer(app);

	const io = new Server(server);

	io.on("connection", (socket) =>{
		socket.on("send_answer", (data) =>{
			console.log(socket.id +" answered "+data);
			socket.to(data.room).emit("recieve_answer", data);
		})

		socket.on("send_question", (data) =>{
			console.log("Emitting \""+data.settlements+"\" to room "+data.room);
			socket.broadcast.to(data.room).emit("recieve_question", data.settlements);
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
	
	app.set('port', (process.env.PORT || 3000));

	//app.listen(app.get('port'));

	server.listen(app.get('port'), () => {
		console.log("SERVER RUNNING");
	})
};

createServer();