'use strict';
require('dotenv').config();
const express = require('express');
const app = express();
const sharp = require('sharp');
const mongoose = require('mongoose');
const path = require('path');
const router = express.Router();
const port = process.env.PORT || 3000;
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

const Schema = mongoose.Schema;
const demoSchema = new Schema({
    category: String,
    title: String,
    description: String,
    imagePath: String,
    thumbnailPath: String,
    /*
    coordinates: {
        latitude: String,
        longitude: String
    }
    */
});

const Demo = mongoose.model('Demo', demoSchema);

console.log(process.env);

// Connect to mongodb
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}/admin`).then(() => {
    console.log(`Listening on port ${port}`);
    app.listen(process.env.APP_PORT);
}, err => {
    console.log('Connection to db failed: ' + err);
});

/*
const dataJson = './data.json';
function base64_encode(file) {
    // read binary data
    const bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}
*/

app.use(express.static('public'));

app.get('/', function(req, res){
    //res.sendStatus(200);
    //res.render('index.html');
    console.log(req, res);
    console.log(req.query.myParam);
    Demo.create({ test: 'Hello', more: 7}).then(post => {
        console.log(post.id);
        res.send('Created dummy data? ' + post)
    })
});

router.get('/view', (req, res) => {
    res.sendStatus(200);
});

app.get('/add', function(req, res){
    res.sendStatus(200);
    console.log(req, res);
    console.log(req.query.myParam);
});

app.post('/upload', function(req, res, next){
    upload(req, res, (err) => {
    if(err){
        res.sendStatus(400);
    } else{
        if (req.file === undefined){
            res.sendStatus(404);
        } else {
            console.log(req.file);
            next();
        }
    }
    });
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