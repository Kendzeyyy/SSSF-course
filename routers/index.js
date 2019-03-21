const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const sharp = require('sharp');
const mongoose = require('mongoose');
const path = require('path');
const router = express.Router();

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // callback
        cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
        // rename the image name with fieldname and date
        cb(null, file.fieldname + '-' + Date.now());
    }
});

const upload = multer ({
    storage: storage
}).single('image');

const fileFilter = (req, file, cb) => {
  // reject a file
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image.png'){
        cb(null, true);
    }else{
        cb(null, false);
    }
};

app.use(express.static('public'));

app.get('/', function(req, res){
    //res.sendStatus(200);
    res.render('index.html');
    console.log(req, res);
    console.log(req.query.myParam);
});

router.get('/view', (req, res) => {
    res.sendStatus(200);
});

app.get('/add', function(req, res){
    res.sendStatus(200);
    console.log(req, res);
    console.log(req.query.myParam);
});

// Middleware for thumbnails
app.post('/upload', function(req, res, next){
    upload(req, res, (err) => {
    if(err){
        res.sendStatus(400);
    } else{
        if (req.file === undefined){
            res.sendStatus(404);
        } else {
            console.log(req.file);
            res.send(req.file);
            res.sendStatus(200);
            next();
        }
    }
    });
});

app.use('/upload', (req, res, next) => {
    // do small 200x200 thumbnail
    sharp(req.file.path)
        .resize(200, 200)
        .toFile('public/img/bouldering.jpg', (err) => {
        });
    next();
});

app.use('/upload', (req, res, next) => {
    // do medium 400x400 thumbnail
    sharp(req.file.path)
        .resize(400, 400)
        .toFile('public/img/bouldering.jpg', (err) => {
        });
});

app.listen(port, () => console.log(`Listening on port ${port}`));