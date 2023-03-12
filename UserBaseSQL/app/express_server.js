//Constantes
const express = require('express');
const PORT = 8080;
const HOST = '0.0.0.0';
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    //l'objet req.body peut contenir des valeurs de n'importe quel type et pas seulement des strings
    extended:true
}));

//donne l'accès au dossier public à tout le monde
// ex : http://localhost:8080/images/img1.jpg
app.use(express.static('public'));
app.set("view engine", "ejs");
app.set("views", "./views"); // ./nomdudossier

app.get('/', (req,res)=>{
    res.send('<h2>Hello World from a DOCKER NODEJS !</h2>');
});

app.get('/test', (req,res)=>{
    //fais-moi le rendu de la view testPage et je te passe le dico de données
    res.render("testPage", { title : "homePage" , subject : "Super de ouf", content : ["un", "deux", "trois", "quatre"]});
});

// Ex: http://localhost:8080/form Si y'a pas le get il  faut taper : http://localhost:8080/form.html
app.get("/form", function(req, res) {
    res.sendFile(__dirname + "/public/form.html");
  });

  // quand submit, afficher le résultat dans le fichier receive
  app.post("/receive", function(req, res) {    
    let num1 = Number(req.body.num1);
    let num2 = Number(req.body.num2);
      
   let result = num1 + num2 ;
      
   res.render("receive", { number1 : num1 , number2 : num2, result : result});
  });

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);