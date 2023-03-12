const express = require('express');
const app = express();
const http = require('http');
const { SocketAddress } = require('net');
const server = http.createServer(app);
//juste l'objet server du module socket.io
const { Server } = require('socket.io');
//nouvelle instance de l'objet server
const io = new Server(server);

// côté serveur
//connection est prédéfini, tout comme disconnect 
//on initialise la connexion
io.on('connection', (socket)=>{
    console.log('a user connected !');
    // on repond au socket qui vient de se connecter
    socket.broadcast.emit('hi'); 
    //on reçoit un message du client
    socket.on('chat message', (msg)=>{
        // on broadcast à tout le monde
        io.emit('chat message', msg);
        console.log('le message:' + msg);
    })


    //le client s'est déco
    socket.on('disconnect', ()=>{
        console.log('user disconnected');
    })

});




app.use(express.static('public'));

// Ex: http://localhost:300
// app.get('/', (req,res)=>{
//     res.send('Hello');
// });

server.listen(3000, ()=>{
    console.log("cours cours petit lapin. Tourne sur le port 3000");

});