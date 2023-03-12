const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

io.on('connection', (socket)=>{
    console.log('a user connected !');  
    
    socket.on('down', (msg)=>{        
        socket.broadcast.emit('down', msg);
        console.log('le message:' + msg);
    })

    socket.on('left', (msg)=>{        
        socket.broadcast.emit('left', msg);
        console.log('le message:' + msg);
    })

    socket.on('right', (msg)=>{        
        socket.broadcast.emit('right', msg);
        console.log('le message:' + msg);
    })

    socket.on('up', (msg)=>{        
        socket.broadcast.emit('up', msg);
        console.log('le message:' + msg);
    })

    socket.on('disconnect', ()=>{
        console.log('user disconnected');
    })

});

app.use(express.static('public'));

// Ex : localhost:3000/robot.html
server.listen(3000, ()=>{
    console.log("Initialisation du robot. Tourne sur le port 3000");

});