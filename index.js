var express = require('express');
var app = express();
var execPHP = require('./execphp.js')();
var mysql = require('mysql');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

var url = 'mongodb://localhost:27017/';
var database = 'fbs';

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "fbs"
});

var pool = mysql.createPool({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'fbs'
});

const request = require('request');
const options = {  
    url: 'https://jsonplaceholder.typicode.com/posts',
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Accept-Charset': 'utf-8',
        'User-Agent': 'my-reddit-client'
    }
};

execPHP.phpFolder = 'phpfiles';

app.use('*.php', function(request,response,next) {
    execPHP.parseFile(request.originalUrl,function(phpResult) {
        response.write(phpResult);
        response.end();
    });
});

app.get('/', function(req, res) {
    res.send("Hello world!");
});

app.get('/json', function(req, res) {

    request(options, function(err, res, body) {  
        var json = JSON.parse(body);
        console.log(json);
    });
    res.json({'asss' : 'as'});
});

app.get('/getAllUser', function(req, res) {
    var allUser = '';
    con.connect(function(err) {
        if (err) throw err;
        con.query("SELECT * FROM users", function (err, result, fields) {
            if (err) throw err;
            //allUser =  JSON.stringify(result);//convert to json
            console.log(result);
        });
    });
    // con.connect();
    // con.query("SELECT * FROM users", function (err, result, fields) {
    //     if (err) throw err;
    //     console.log(JSON.stringify(result));
    // });
    //con.end();
    res.json(allUser);
});

app.get('/getListUser', function (req, res) {
    pool.getConnection(function (err, connection) {
        connection.query("SELECT * FROM users", function (err, result) {
            connection.release();
            if (err) throw err;
            console.log(result.length);
            res.send(JSON.stringify(result));
        });
    });
});

app.get('/getAllProduct', function (req, res) {
    pool.getConnection(function (err, connection) {
        connection.query("SELECT * FROM products", function (err, result) {
            connection.release();
            if (err) throw err;
            console.log(result.length);
            res.send(JSON.stringify(result));
        });
    });
});

app.get('/getUserMongo', function (req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(database);
        dbo.collection('uesrs').find({}).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            db.close();
            res.send((result));
        });
    });
});

app.listen(3000);
