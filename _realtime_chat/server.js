const path =require('path');
const http =require('http');
const express = require('express');
const socketio =require('socket.io');
const formatMessage = require('./utils/messages');
const {
    userJoin, 
    getCurrentUser,
    userLeave,
    getRoomUsers
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatCord Bot';

//Set when client connects
io.on('connection', socket => {
    socket.on('joinRoom', ({username, room}) => {
        const user = userJoin(socket.id, username, room);
        
        socket.join(user.room);
        
        //console.log('new WS Connection...');

        //Emit event to the client, Welcome current user
        //socket.emit('message', 'Welcome to ChatCord!');
        socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));

        //Broadcast when a user connects
        //socket.broadcast.emit('message', 'A user has joinedthe chat');
        socket.broadcast
            .to(user.room)
            .emit(
                'message',
                formatMessage(botName, `${user.username} has joined the chat`)
            );

    });
    
    //io.emit();

    //Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        console.log(msg);
        const user = getCurrentUser(socket.id);

        //io.emit('message', msg);
        //io.emit('message', formatMessage('USER', msg) );
        io.to(user.room).emit('message', formatMessage(user.username, msg) );
    })

    //Runs when client disconnects
    socket.on('disconnect', ()=> {
        const user = userLeave(socket.id);

        if (user) {
            //io.emit('message', 'A user has left the chat');
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));
        }

    });
})

const PORT = 3000 || process.env.PORT;

//app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//Set up a server to handle socket
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));