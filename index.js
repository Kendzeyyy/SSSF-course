const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const sharp = require('sharp');

app.use(express.static('public'));

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

app.listen(port, () => console.log(`Listening on port ${port}...`));