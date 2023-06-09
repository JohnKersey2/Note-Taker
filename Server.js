const express = require('express');
const bodyParser = require('body-parser');
const notes = require('./db/db.json');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3001;

const app = express();
app.use(bodyParser.json({ extended: false }));

//middleware
app.use(express.static('public'));

//route user to notes.html 
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// write notes
app.post('/api/notes', (req, res) => {
    notes.push(req.body);
    console.log(crypto.randomUUID())
    // fs (file location, data, callback)
    fs.writeFile('./db/db.json', JSON.stringify(notes), err => { if (err) console.log(err) });
})

// get notes
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
    fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => { console.log(err) });
    res.json(`Deleted note ${req.params.id}`);
})

app.listen(process.env.PORT || 3001);
