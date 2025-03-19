const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const logger = require('../services/logger');

// Example usage of winston logger
router.get('/generate', (req, res) => {
    logger.info('Info log generated');
    logger.error('Error log generated');
    res.send('Sample logs generated');
});

// Endpoint to fetch logs (combined log file)
router.get('/', (req, res) => {
    const logFile = path.join(__dirname, '..', 'logs', 'combined.log');
    if (fs.existsSync(logFile)) {
        const logs = fs.readFileSync(logFile, 'utf8');
        res.setHeader('Content-Type', 'text/plain');
        res.send(logs);
    } else {
        res.status(404).send('No logs found');
    }
});

module.exports = router;
