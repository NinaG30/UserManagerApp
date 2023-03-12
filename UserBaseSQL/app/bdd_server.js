const mysql = require('mysql2');
const express = require('express');

const PORT = 8080;
const HOST = '0.0.0.0';

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

//Gere la co avec la bonne database
let conHandler = mysql.createConnection(
    {
        host: "172.17.0.2",
        user: "nina",
        password: "ThePassWord",
        database: "BDD1"
    }
);

conHandler.connect(function (err) {
    if (err) throw err;
    console.log("DB BDD1 connected !");
});

// //First query/requete to console
// conHandler.connect(function (err){
//     if (err) throw err;
//     conHandler.query("SELECT * FROM TechTable", function(err,results,fields){
//         if(err) throw err;
//         console.log(results);
//     })
// })

app.get('/', (req, res) => {
    //gère surtout le html simple
    res.send('<h2>Hello world from a docker nodejs!</h2>');
});

app.get('/all', (req, res) => {
    conHandler.connect(function (err) {
        if (err) throw err; //recup l'erreur
        conHandler.query("SELECT * FROM TechTable LIMIT 3", function (err, results, fields) {
            if (err) throw err;
            //console.log(results);
            //permet d'afficher dans la page "joliment" le résultat de la requête
            res.render("results", {"title": "liste complète", "display_results": results})
        })
    })
})

app.get('/detail/:id', (req,res) => {
    conHandler.connect(function (err) {
        if (err) throw err; //recup l'erreur
        let myquery=`SELECT * FROM TechTable WHERE id_tech=${req.params.id}`;
        conHandler.query(myquery, function (err, results, fields) {
            if (err) throw err;
            //console.log(results);
            //permet d'afficher dans la page "joliment" le résultat de la requête
            res.render("details", {"title": "liste complète", "display_results": results})
        })
    })



})

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
