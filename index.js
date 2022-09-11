const express = require("express");
const app = express();
const http = require('http').createServer(app);
const port = process.env.PORT || 3000;
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

http.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.use(express.static(__dirname + '/client'))

app.get('/', (req,res) => {
  res.sendFile(__dirname + '/index.html');
});

const users = {};

io.on('connection', socket => {
    socket.on('new-user-joined', name => {
        console.log('new user ' + name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined',name);
    });

    socket.on('send', message => {
        socket.broadcast.emit('receive', {message: message, name:users[socket.id]});
    });

    socket.on('disconnect', name => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
})