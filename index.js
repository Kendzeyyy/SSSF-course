const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const sharp = require('sharp');
const multer = require('multer');
const upload = multer({dest: 'uploads'});
const mongoose = require('mongoose');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // callback
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.filename);
    }
});

const fileFilter = (req, file, cb) => {
  // reject a file
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image.png'){
        cb(null, true);
    }else{
        cb(null, false);
    }
};

/*
const upload = multer({
    storage: storage,
    limits:{
        fileSize: 1024 * 1024 * 5
}});
*/

app.use(express.static('public'));

/*
// Connect to mongodb
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}/admin`).then(() => {
    console.log('Connected successfully.');
    app.listen(process.env.APP_PORT);
}, err => {
    console.log('Connection to db failed: ' + err);
});

 */

app.get('/', (req, res) => {
    res.sendStatus(200);
    console.log(req, res);
    console.log(req.query.myParam);
});

app.get('/View', (req, res) => {
    res.sendFile('/index.html');
});

app.get('/Add', (req, res) => {
    res.sendStatus(200);
});

// Middleware for thumbnails
app.post('/upload', function(req, res, next){
    // do upload
    res.send(req.filename.public);
    next();
});

app.use('/upload', function(req, res, next) {
    // do small thumbnail
    sharp(req.file.path)
        .resize(200, 200)
        .toFile('public/img/bouldering.jpg', function () {

        });
    // createThumbnail('small', next)
    createThumbnail('small').then(()=>{
        next();
    });
});

app.post("/", upload.single('image'), function(req, res, next){
   console.log(req.file);
});

app.listen(port, () => console.log(`Listening on port ${port}...`));