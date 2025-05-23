const path = require('path'); // CC - local file storage system
const fs = require('fs'); // CC - local file storage system
const fsPromise = require('fs').promises;  // Use fs.promises for async file operations

/**
 * CC - local file path
 */

const notesDirPath = path.join(__dirname, '..', '..', 'data');
const manualFilePath = path.join(notesDirPath, 'manual.json');

if (!fs.existsSync(notesDirPath)) {
    fs.mkdirSync(notesDirPath, { recursive: true });
}

if (!fs.existsSync(manualFilePath)) {
    fs.writeFileSync(manualFilePath, JSON.stringify([]));
}


/**
 * CC - getNotes locally
 */

async function getNotes(req, res) {
    try {
        const notes = JSON.parse(fs.readFileSync(manualFilePath, 'utf8'));
        res.json(notes);
    } catch (err) {
        console.error('Error querying local file:', err.message);
        res.status(500).send('Error querying the local file');
    }
}


/**
 * CC - fetch specific note locally
 */

async function fetchNotes(req, res) {
    const { id } = req.params;

    try {
        const data = await fsPromise.readFile(manualFilePath, 'utf8');
        const notes = JSON.parse(data);

        if (id) {
            const noteId = parseInt(id, 10);
            const note = notes.find(note => note.id === noteId);
            if (note) {
                return res.json(note);
            } else {
                return res.status(404).send('Note not found');
            }
        }

        res.json(notes);

    } catch (err) {
        console.error('Error querying local file:', err.message);
        res.status(500).send('Error querying the local file');
    }
}



/**
 * CC - getID locally
 */

async function getID(req, res) {
    try {
        const notesData = fs.readFileSync(manualFilePath, 'utf8');
        const notes = JSON.parse(notesData);

        res.json(notes.length);
    } catch (err) {
        console.error('Error querying local file:', err.message);
        res.status(500).send('Error querying the local file');
    }
}


/**
 * CC - postNotes locally
 */

async function postNotes(req, res) {
    try {
        const newNote = req.body;
        const notes = JSON.parse(fs.readFileSync(manualFilePath, 'utf8'));
        const newId = notes.length > 0 ? notes[notes.length - 1].id + 1 : 1;

        newNote.id = newId;
        notes.push(newNote);

        fs.writeFileSync(manualFilePath, JSON.stringify(notes));
        res.json(newNote);

    } catch (err) {
        console.error('Error querying local file:', err.message);
        res.status(500).send('Error querying the local file');
    }
}


/**
 * CC - deleteNotes locally
 */

async function deleteNotes(req, res) {
    try {
        const noteId = parseInt(req.params.id, 10);
        const notes = JSON.parse(fs.readFileSync(manualFilePath, 'utf8'));

        const noteIndex = notes.findIndex(note => note.id === noteId);

        if (noteIndex === -1) {
            return res.status(404).send('Note not found');
        }

        notes.splice(noteIndex, 1);

        fs.writeFileSync(manualFilePath, JSON.stringify(notes));
        res.status(200).send('Note deleted');

    } catch (err) {
        console.error('Error querying local file:', err.message);
        res.status(500).send('Error querying the local file');
    }
}


/**
 * CC - updateNotes locally
 */

async function updateNotes(req, res) {
    try {
        const noteId = parseInt(req.params.id, 10);
        const updatedNote = req.body;

        const data = await fsPromise.readFile(manualFilePath, 'utf8');
        const notes = JSON.parse(data);

        const noteIndex = notes.findIndex(note => note.id === noteId);

        if (noteIndex === -1) {
            return res.status(404).send('Not found');
        }

        notes[noteIndex] = { ...notes[noteIndex], ...updatedNote };
        await fs.writeFileSync(manualFilePath, JSON.stringify(notes));
        res.status(200).json(notes[noteIndex]);

    } catch (err) {
        console.error('Error updating the item:', err.message);
        res.status(500).send('Error updating the item');
    }
}

const { v4: uuidv4 } = require("uuid");
async function uploadImage(req, res) {
    console.log("Received file:", req.file);

    if (!req.file) {
        console.error("No file uploaded.");
        return res.status(400).json({ error: "No file uploaded." });
    }

    try {
        const tempPath = req.file.path;
        const fileExtension = path.extname(req.file.originalname);
        const newFileName = `${uuidv4()}${fileExtension}`;
        const uploadsDir = path.resolve(__dirname, "../../data/uploads");

            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, {recursive: true});
            }

        const targetPath = path.resolve(uploadsDir, newFileName);

        await fs.promises.rename(tempPath, targetPath);
        res.json({ message: "File uploaded and saved successfully!", fileName: newFileName });
    } catch (err) {
        console.error("Error moving file:", err);
        res.status(500).json({ error: "Error saving file." });
    }
}


module.exports = { getNotes, postNotes, deleteNotes, updateNotes, getID, fetchNotes, uploadImage };