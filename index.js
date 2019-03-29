'use strict';
require('dotenv').config();
const express = require('express');
const app = express();
const sharp = require('sharp');
const mongoose = require('mongoose');
const path = require('path');
const router = express.Router();
const port = process.env.PORT || 3000;
const url = (`mongodb://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}/admin`);
var fs = require('fs');

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

console.log(process.env);

// Connect to mongodb
mongoose.connect(url, {userNewUrlParser: true}).then(() => {
    console.log(`Listening on port ${port}`);
    app.listen(process.env.APP_PORT);
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
//----------------------------------------------------------------------------------------------------------------------

//app.listen(port, () => console.log(`Listening on port ${port}`));
// http://localhost:3000/cats/...
app.use('/cats', catRouters);
app.use(express.static('public'));