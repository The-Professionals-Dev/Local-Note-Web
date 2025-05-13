const express = require('express');
const router = express.Router();
const { getNotes, postNotes, deleteNotes, updateNotes, getID, fetchNotes, uploadImage } = require('../controllers/noteController.js');


const path = require("path");
const multer = require('multer');
const { v4: uuidv4 } = require("uuid");
const storage = multer.diskStorage({
    destination: path.resolve(__dirname, "../../data/uploads"),
    filename: (req, file, cb) => {
        cb(null, `${uuidv4()}-${file.originalname}`);
    },
});
const upload = multer({ storage });


router.get('/notes', getNotes);
router.get('/notes/:id', fetchNotes);
router.post('/notes', postNotes);
router.delete('/notes/:id', deleteNotes);
router.put('/notes/:id', updateNotes);
router.get('/getID', getID);
router.post('/upload-images', upload.single("file"), uploadImage);
router.use("/uploads", express.static(path.resolve(__dirname, "../../data/uploads")));


module.exports = router;