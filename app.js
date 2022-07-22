import express from 'express';
import path from 'path';
import http from 'http';

const app = express();
app.set('port', process.env.PORT || 3000)
app.use(express.static(path.join(__dirname, 'public')));


//Set up express
const server = http.createServer(app).listen(app.get('port'), ()=>{
	console.log("Express server listening on port" + app.get('port'));
});

const io= require('socket.io');


let users = [];
//connection event


	
// socket represents each client connected to our server
io.on('connection', (socket)=>{
	socket.on('connect', ()=>{
		console.log("New connection socket.id : ", socket.io);
	});

	socket.on('disconnect', ()=>{
		console.log("disconnect => nickname : ", socket.nickname);
		const updatedUsers = users.filter(user => user != socket.nickname);
		console.log("updatedUsers : ", updatedUsers);
		users = updatedUsers;
		io.emit('userlist', users);
	});

	//nick event
	socket.on('nick', (nickname)=>{
		console.log("nick => nickname : ", nickname);
		socket.nickname =nickname;
		users.push(nickname);

		console.log("server : users :", users);
		//emit userlist event to all connected sockets
		io.emit('userlist', users);
	});

	//chat event
	socket.on('chat', (data)=> {
		console.log("chat => nickname : ", socket.nickname)
		const d = new Date();
		const ts = d.toLocaleDateString();
		console.log("ts :", ts);
		const response = '${ts} : ${socket.nickname} : ${data.message}';
		console.log("ts : ", response);
		io.emit('chat', response);
	});
});