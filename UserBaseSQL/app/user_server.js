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

let pool = mysql.createConnection(
    {
        host: "172.17.0.2",
        user: "nina",
        password: "ThePassWord",
        database: "users",
        multipleStatements: true
        //permet de pouvoir envoyer plusieurs requetes et pouvoir stocker chaque resultat dans une variable globale sous forme de tableau
    }
);

pool.connect(function (err) {
    if (err) throw err;
    console.log("DB users connected !");
});

app.get('/', function (req, res) {
    res.redirect('/login');
})

app.get('/login', function (req, res) {
    res.render('login', { 'title': 'boo' });
})

app.post('/confirm', function (req, res) {
    console.log(req.body.mdp);
    let username = req.body.username;
    let mdp = req.body.mdp;
    let myquery = `SELECT username,password FROM user WHERE username = ? AND password = ?`;
    pool.connect(function (err) {
        if (err) throw err;

        pool.query(myquery, [username, mdp], function (err, results) {
            if (err) throw err;
            if (results.length == 1) {
                res.render('accueil', { 'title': 'accueil', 'message': `bienvenue ${username}` })

            } else if (results.length > 1) {
                res.render('accueil', { 'title': 'accueil', 'message': `probleme, plusieurs utilisateur dans la database` })

            } else {
                res.render('login', { 'title': 'accueil', 'message': `identifiant et/ou mdp n'est pas bon.` })
            }
        })
    })
})




app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);