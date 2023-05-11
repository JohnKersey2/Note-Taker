//require express
const express = require('express');
const bodyParser = require('body-parser');
const notes = require('./db/db.json');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// set port for heroku and localhost
const PORT = process.env.PORT || 3001;

// set app const as express
const app = express();
app.use(bodyParser.json({ extended: false }));

//middleware to watch public dir
app.use(express.static('public'));

//route user to notes.html when /routes is accessed
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);
// use body parser to parse req
// POST data as JSON object
// write with fs
app.post('/api/notes', (req, res) => {
    notes.push(req.body);
    console.log(crypto.randomUUID())
    // fs (file location, data, callback)
    fs.writeFile('./db/db.json', JSON.stringify(notes), err => { if (err) console.log(err) });
})

// GET notes from json db
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf-8', (err) => { if (err) console.log(err) });
    res.json(notes);
});

// get notes by id
app.get('/api/notes/:id', function (req, res) {
    if (req.params.id) {
        const noteId = req.params.id;
        for (let i = 0; i < notes.length; i++) {
            const currentNote = notes[i];
            if (notes[i].id === noteId) {
                res.json(currentNote);
                return;
            }
        }
    }
});
// delete notes
app.delete('/api/notes/:id', function (req, res) {
    if (req.params.id) {
        const noteId = req.params.id;
        for (let i = 0; i < notes.length; i++) {
            if (notes[i].id === noteId) {
                console.log(notes[i])
                notes.splice(i, 1)
            }
        }
    }
    // write the modified db to file
    fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => { console.log(err) });
    res.json(`Deleted note ${req.params.id}`);
})
// listen() method is responsible for listening for incoming connections on the specified port 
app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);