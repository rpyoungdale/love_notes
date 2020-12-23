const express = require('express');
const app = express();
const port = 3000;
require('dotenv').config();

const mysql = require('mysql');

const con = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD
});

app.get('/dailyMessage', (req, res) => {
    con.connect(function (err) {
        con.query(`SELECT * FROM main.love_notes WHERE type = 'dailyMessage'`, function (err, result, fields) {
            if (err) res.send(err);
            if (result) res.send(result[0]);
        });
    });
});

app.get('/encouragement', (req, res) => {
    con.connect(function (err) {
        con.query(`SELECT * FROM main.love_notes WHERE type = 'encouragement'`, function (err, result, fields) {
            if (err) res.send(err);
            if (result) res.send(result[Math.floor(Math.random() * result.length)]);
        });
    });
});

app.post('/dailyMessage', (req, res) => {
    if (req.query.message) {
        console.log('Daily message received');
        con.connect(function (err) {
            con.query(`UPDATE main.love_notes SET message = '${req.query.message}' WHERE type = 'dailyMessage'`, function (err, result, fields) {
                if (err) res.send(err);
                if (result) res.send({ message: req.query.message });
                if (fields) console.log(fields);
            });
        });
    } else {
        console.log('Missing a parameter');
    }
});

app.post('/encouragement', (req, res) => {
    if (req.query.type && req.query.message) {
        console.log('Encouragement received');
        con.connect(function (err) {
            con.query(`INSERT INTO main.love_notes (type, message) VALUES ('encouragement', '${req.query.message}')`, function (err, result, fields) {
                if (err) res.send(err);
                if (result) res.send({ message: req.query.message })
                if (fields) console.log(fields);
            });
        });
    } else {
        console.log('Missing a parameter');
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
}) 