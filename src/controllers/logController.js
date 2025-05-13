const path = require('path'); // CC - local file storage system
const fs = require('fs'); // CC - local file storage system


/**
 * CC - local file path
 */

const logDirPath = path.join(__dirname, '..', '..', 'data');
const logFilePath = path.join(logDirPath, 'log.json');

if (!fs.existsSync(logDirPath)) {
    fs.mkdirSync(logDirPath, { recursive: true });
}

if (!fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, JSON.stringify([]));
}


/**
 * CC - getLog locally
 */

async function getLog(req, res) {
    try {
        const logs = JSON.parse(fs.readFileSync(logFilePath, 'utf8'));
        res.json(logs);
    } catch (err) {
        console.error('Error querying local file:', err.message);
        res.status(500).send('Error querying the local file');
    }
}



/**
 * CC - postLog locally
 */

async function postLog(req, res) {
    try {
        const newLog = req.body;
        const logs = JSON.parse(fs.readFileSync(logFilePath, 'utf8'));
        const newId = logs.length > 0 ? logs[logs.length - 1].id + 1 : 1;

        newLog.id = newId;
        logs.push(newLog);

        fs.writeFileSync(logFilePath, JSON.stringify(logs));
        res.status(201).json(newLog);

    } catch (err) {
        console.error('Error querying local file:', err.message);
        res.status(500).send('Error querying the local file');
    }
}



module.exports = { getLog, postLog };