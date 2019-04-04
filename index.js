'use strict';
require('dotenv').config();
const express = require('express');
const app = express();
const sharp = require('sharp');
const mongoose = require('mongoose');
const path = require('path');
const catRouter = require('./routers/catRouter');
const https = require('https');
const fs = require('fs');
const sslkey = fs.readFileSync('ssl-key.pem');
const sslcert = fs.readFileSync('ssl-cert.pem');
const lang = require('./languages/lang');

app.set('view engine', 'pug');
app.use(express.static('public'));
const url = (`mongodb://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}/admin`);

const options = {
    key: sslkey,
    cert: sslcert
};

console.log(process.env);

// Upload---------------------------------------------------------------------------------------------------------------
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // callback
        cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
        // rename the image name with fieldname and date
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer ({
    storage: storage,
}).single('image');

// ---------------------------------------------------------------------------------------------------------------------

// Connect to mongodb
mongoose.connect(url, {userNewUrlParser: true}).then(() => {
    console.log('Connected successfully.');
    https.createServer(options, app).listen(3000);
}, err => {
    console.log('Connection to db failed: ' + err);
});

// ---------------------------------------------------------------------------------------------------------------------

app.use(express.static('public'));

app.get('/', function(req, res){
    console.log(req, res);
    console.log(req.query.myParam);
    Demo.create({ test: 'Hello', more: 7}).then(post => {
        console.log(post.id);
        res.send('Created dummy data? ' + post)
    })
});

// Middleware for thumbnails--------------------------------------------------------------------------------------------
app.use('/upload', function(req, res, next) {
    // do small 200x200 thumbnail
    sharp(req.file.path)
        .resize(200, 200)
        .toFile('public/img/small/photo200x200.jpg', (err) => {
        });
    next();
});

app.use('/upload', function(req, res, next) {
    // do medium 400x400 thumbnail
    sharp(req.file.path)
        .resize(400, 400)
        .toFile('public/img/medium/photo400x400.jpg', (err) => {
        });
    res.send(req.file);
    next();
});

app.use('/upload', function(req, res){
    // set req.file path to data.json
    //req.file = file;
    sharp(req.file.path)
        .toFile('public/data.json', (err) => {
        });
});
//Pug-------------------------------------------------------------------------------------------------------------------
app.use((req, res, next) => {
    if([req.query.lang === undefined]) {
        req.query.lang = 'en';
    }
    next();
});

app.get('/', function (req, res) {
    if([req.query.lang === undefined]){
        req.query.lang = 'en';
    }
    res.render('index', lang[req.query.lang]);
});

app.get('/home', (req, res) => {
    if([req.query.lang === undefined]){
        req.query.lang = 'en';
    }
    res.render('index', lang[req.query.lang]);
});

app.get('/add', function (req, res) {
    res.render('add', { title: 'Hey', message: 'Hello there!' });
});

app.get('/update', (req, res) => {
    res.render('update', { title: 'Hey', message: '/update' });
});

app.get('/delete', (req, res) => {
    res.render('delete', { title: 'Hey', message: '/delete' });
});

//app.listen(port, () => console.log(`Listening on port ${port}`));
// http://localhost:3000/cats/...
app.use('/cats', catRouter);
app.use(express.static('public'));