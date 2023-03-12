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

let conHandler = mysql.createConnection(
    {
        host: "172.17.0.2",
        user: "nina",
        password: "ThePassWord",
        database: "avion",
        multipleStatements: true
        //permet de pouvoir envoyer plusieurs requetes et pouvoir stocker chaque resultat dans une variable globale sous forme de tableau
    }
);

conHandler.connect(function (err) {
    if (err) throw err;
    console.log("DB avion connected !");
});

app.get('/', (req, res) => { //Rajouter dans SELECT ce qu'on a besoin pour les ID des liens dans avion.ejs
    let myquery = "SELECT vol.id_vol, dep.ville AS villeDep, arr.ville AS villeArr,DATE_FORMAT(vol.horaire, '%d/%m/%Y %hh%m') AS horaire, vol.nbre_pass, avion.type, pilote.nom, pilote.id_pilote, avion.id_avion FROM vol ";
    myquery += "INNER JOIN aeroport AS dep ON vol.id_depart=dep.id_aeroport ";
    myquery += "INNER JOIN aeroport AS arr ON vol.id_arrive=arr.id_aeroport ";
    myquery += "INNER JOIN avion ON vol.id_avion=avion.id_avion ";
    myquery += "INNER JOIN pilote ON vol.id_pilote=pilote.id_pilote ";
    //get all records from VOLS   
    conHandler.connect(function (err) {
        if (err) throw err; //recup l'erreur
        conHandler.query(myquery, function (err, results, fields) {
            if (err) throw err;
            console.log(results);
            //permet d'afficher dans la page "joliment" le résultat de la requête
            res.render("avion", { "title": "Les vols de la compagnie", "display_results": results })
        })

    })
});

app.get('/pilote/:id', function (req, res) {
    conHandler.connect(function (err) {
        if (err) throw err; //recup l'erreur
        let myquery = `SELECT * FROM pilote WHERE id_pilote=${req.params.id}`;
        conHandler.query(myquery, function (err, results, fields) {
            if (err) throw err;
            //console.log(results);
            //permet d'afficher dans la page "joliment" le résultat de la requête
            // res.render("details", { "title": "liste complète", "display_results": results })
            res.send(results);
            console.log(results);
        })
    })

})

app.get('/type/:id', function (req, res) {
    conHandler.connect(function (err) {
        if (err) throw err; //recup l'erreur
        let myquery = `SELECT * FROM avion WHERE id_avion=${req.params.id}`;
        conHandler.query(myquery, function (err, results, fields) {
            if (err) throw err;
            //console.log(results);
            //permet d'afficher dans la page "joliment" le résultat de la requête
            // res.render("details", { "title": "liste complète", "display_results": results })
            res.send(results);
        })
    })

})

//route du navigateur
app.get('/create', function (req, res) {
    // envoie le template avec les formulaires de creation
    res.render("create", { "title": "ajouter un element" });
});

//route d'un formulaire
app.post('/create', function (req, res) {
    // faire la requete qui permet de créer l'élément 
    console.log(req.body);
    let values = req.body;
    let tabname = req.body.table;

    if (tabname == "avion") {
        conHandler.connect(function (err) {
            if (err) throw err;
            let constructeur = req.body.constructeur;
            let type = req.body.type;
            let rayon_action = req.body.rayon_action;
            let capacite = req.body.capacite;
            let date_achat = req.body.date_achat;
            let date_revision = req.body.date_revision;
            let myquery = "INSERT INTO " + tabname + " (constructeur,type,rayon_action,capacite,date_achat,date_revision) ";
            myquery += "VALUES ('" +
                constructeur + "' , '" +
                type + "' , '" +
                rayon_action + "' , '" +
                capacite + "' , " +
                "DATE_FORMAT('" + date_achat + "' , '%Y/%m/%d')" + " , " +
                "DATE_FORMAT('" + date_revision + "' , '%Y/%m/%d')" + ") ";
            console.log(myquery);
            conHandler.query(myquery, function (err, results, fields) {
                if (err) throw err;
                console.log(results);
                res.render("confirm", { 'title': "avion crée", 'element': "avion crée" });
            });
        });
    }

    if (tabname == "aeroport") {
        conHandler.connect(function (err) {
            if (err) throw err;
            let nbre_pistes = req.body.nbre_pistes;
            let URLimage = req.body.URL_image;
            let ville = req.body.ville;
            let myquery = "INSERT INTO " + tabname + " (ville,nbre_pistes,URL_image) ";
            myquery += "VALUES ('" + ville + "' , '" + nbre_pistes + "' , '" + URLimage + "')";
            conHandler.query(myquery, function (err, results, fields) {
                if (err) throw err;
                console.log(results);
                res.render("confirm", { 'title': "aeroport créé", 'element': "aeroport créé" });
            });
        })
    }

    if (tabname == "pilote") {
        conHandler.connect(function (err) {
            if (err) throw err;
            let nom = req.body.nom;
            let adresse = req.body.adresse;
            let salaire = req.body.salaire;
            let qualification = req.body.qualification;
            let myquery = "INSERT INTO " + tabname + " (nom,adresse,salaire,qualification) ";
            myquery += "VALUES ('" + nom + "' , '" + adresse + "' , '" + salaire + "' , '" + qualification + "')";
            conHandler.query(myquery, function (err, results, fields) {
                if (err) throw err;
                console.log(results);
                res.render("confirm", { 'title': "pilote créé", 'element': "pilote créé" });
            });
        })
    }
});

app.get('/volselect', function (req, res) {
    let query_avion = "SELECT * FROM avion";
    let query_aeroport = "SELECT * FROM aeroport";
    let query_pilote = "SELECT * FROM pilote";
    let allResults = {};
    conHandler.query(query_avion, function (err, results, fields) {
        if (err) throw err;
        console.log(results);
        allResults.avions = results;
        conHandler.query(query_aeroport, function (err, results, fields) {
            if (err) throw err;
            allResults.aeroports = results;
            conHandler.query(query_pilote, function (err, results, fields) {
                if (err) throw err;
                allResults.pilotes = results;
                res.send(allResults);
            })
        })
    })
})

//autre solution que celle au-dessus 
app.get('/mod', function (req, res) {

    let query_avion = "SELECT * FROM avion";
    let query_aeroport = "SELECT * FROM aeroport";
    let query_pilote = "SELECT * FROM pilote";

    conHandler.connect(function (err) {
        if (err) throw err;

        conHandler.query(` ${query_avion} ; ${query_aeroport} ; ${query_pilote} `, function (err, result) {
            if (err) {
                throw err;
            } else {
                console.log(result[0]);
                console.log(result[1]);
                console.log(result[2]);
            }
            res.send("done!");
        })
    })
})

// deux options : 
// - soit faire des routes par action : create/update/delete
// - soit faire des routes par entité : C/U/D par table

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);