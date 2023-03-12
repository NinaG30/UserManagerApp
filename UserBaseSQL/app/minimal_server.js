const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

// Ex: http://localhost:3000
app.get('/', (req,res)=>{
    res.send('Hello');
});

server.listen(3000, ()=>{
    console.log("cours cours petit lapin. Tourne sur le port 3000");

});