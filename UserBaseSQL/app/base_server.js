//Const en maj, c'est mieux
const MYSERVER = require('http');
const URL = require('url');
const FS = require('fs');

MYSERVER.createServer(
    function (request,response) {
        //parse sert à transformer l'url en objet et le query 
        // extrait les propriétés des objets
        // let q = URL.parse(request.url, true).query; 
        // let  text = q.year + " " + q.month;
        // response.writeHead(200, {'Content-Type' : 'text/html'});
        // response.write('<html>');
        // response.write('<body>');
        // response.write('<h1>nous sommes en '+text+'</h1>');        
        // response.write('</body>');
        // response.end('</html>');
        //fini la réponse avec "hello world"
        // response.end('Hello world');
        // //la requete comprend un header et un body (la response aussi). On veut
        // // l'user-agent de l'object "headers"
        // console.log(request.headers['user-agent']);
        FS.readFile('index.html', function(err, data){
            if(!err){
                response.writeHead(200, {'Content-Type' : 'text/html'});
                response.write(data);
                return response.end();
            }
        
        })

    }
).listen(8080);

let adr = 'http://localhost:8080/default.htm?year=2023&month=feb';
let q = URL.parse(adr, true); 
console.log(q.host); //localhost:8080
console.log(q.pathname); // default.htm
console.log(q.search); // '?year=2017&month=feb'
let qdata = q.query; // an object : { year: 2017, month: 'feb'}
console.log(qdata.month); // 'feb'

//event management
const EVENTS = require('events');
//créé un object eventemitter
let eventEmitter = new EVENTS.EventEmitter();

//creer une fonction qui gère l'évènement
let myEventHandler = function () {
    console.log("J'ai entendu qq chose ?");
}

//lie le message avec la méthode à utiliser
eventEmitter.on('scream', myEventHandler); //pas de () pour lui donner seulement
//la ref de la fonction 

//On émet l'évènement
eventEmitter.emit('scream');