const express = require("express");
const mysql = require("mysql2");
const bodyParser = require('body-parser');

const PORT = 8080;
const HOST = '0.0.0.0';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

// Connecte à la base de données
let conHandler = mysql.createConnection(
    {
        host: "172.17.0.2",
        user: "nina",
        password: "ThePassWord",
        database: "TestBase",
        multipleStatements: true
    }
);

// simple test for basic connection
conHandler.connect(function (err) {
    if (err) throw err;
    console.log("DB TestBase connected !");
});

// Route de base
app.get('/', (req, res) => {
    res.send("hello");
}); // end app.get

//definition des routes

// /tabOne -> afficher l'entité (Read)
// routes affectées au traitement des données (fetch + requetes mySQL)
// /tabOne/create -> Créé un nouvel enregistrement
// /tabOne/update/:id -> modifie un enregistrement
// /tabOne/delete/:id -> supprime un enregistrement
// même chose pour tabTwo et tabThree

app.get('/tabOne', function (req, res) {
    //requete mySQL correspondante à la ressource demandée
    let myquery = "SELECT * FROM tabOne";
    let myinfos = ["one", "two", "three"];
    conHandler.connect(function (err) {
        if (err) throw err;
        conHandler.query(myquery, function (err, results, fields) {
            if (err) throw err;
            res.render("testSQL", { 'title': "tabOneRead", "display_results": results, "more_infos": myinfos });

        })
    })

});

app.get('/tabOne/create', function (req, res) {
    console.log("route create OK ");
    res.send('welcome to tabOne create !');
});

app.get('/tabOne/getRecords', function (req, res) {
    let myquery = 'SELECT * FROM tabOne';
    conHandler.connect(function (err) {
        if (err) throw err;
        conHandler.query(myquery, function (err, results) {
            if (err) throw err;
            res.send(results); //pour requete fetch
        })
    })
})

app.get('/tabOne/update/:id/:value', function (req, res) {
    console.log(req.params.id + req.params.value);
    let myquery= `UPDATE tabOne SET field1='${req.params.value}' WHERE id_t1='${req.params.id}'`;
    conHandler.connect(function (err) {
        if (err) throw err;
        conHandler.query(myquery, function (err, results) {
            if (err) throw err;
            res.redirect('/tabOne');
        })
    })
});


app.get('/tabOne/delete/:id', function (req, res) {    
    let myquery = `DELETE FROM tabOne WHERE id_t1=${req.params.id}`;
    //prends l'id dans la route
    conHandler.connect(function (err) {
        if (err) throw err;
        conHandler.query(myquery, function (err, results) {
            if (err) throw err;
            res.redirect('/tabOne');
        })
    })
});

app.post('/tabOne/create', function (req, res) {
    //on fait la requete
    let myquery = `INSERT INTO tabOne (field1) VALUES ('${req.body.field1}')`;
    conHandler.connect(function (err) {
        if (err) throw err;
        conHandler.query(myquery, function (err, results, fields) {
            if (err) throw err;
            console.log(results);
            res.redirect('/tabOne');

        });
    })
})

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);