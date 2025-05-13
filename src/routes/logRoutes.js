const express = require('express');
const router = express.Router();
const { getLog, postLog } = require('../controllers/logController.js');


router.get('/notes', getLog);
router.post('/notes', postLog);



module.exports = router;