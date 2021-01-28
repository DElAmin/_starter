const path =require('path');
const http =require('http');
const express = require('express');
const socketio =require('socket.io');
const formatMessage = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatCord Bot';

//Set when client connects
io.on('connection', socket => {
    //console.log('new WS Connection...');

    //Emit event to the client, Welcome current user
    //socket.emit('message', 'Welcome to ChatCord!');
    socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));

    //Broadcast when a user connects
    socket.broadcast.emit('message', 'A user has joinedthe chat');

    //Runs when client disconnects
    socket.on('disconnect', ()=> {
        //io.emit('message', 'A user has left the chat');
        io.emit('message', formatMessage(botName, 'A user has left the chat'));
    });

    //io.emit();

    //Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        console.log(msg);
        //io.emit('message', msg);
        io.emit('message', formatMessage('USER', msg) );
    })
})

const PORT = 3000 || process.env.PORT;

//app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//Set up a server to handle socket
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));