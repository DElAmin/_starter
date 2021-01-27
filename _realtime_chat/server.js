const path =require('path');
const http =require('http');
const express = require('express');
const socketio =require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Set when client connects
io.on('connection', socket => {
    console.log('new WS Connection...');
})

const PORT = 3000 || process.env.PORT;

//app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//Set up a server to handle socket
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));