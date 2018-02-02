/*
 * Used Winston.js to log errors and other information.
 * Every log entry contains a unique ID and a timestamp.
 * Message and status code get logged for every API access.
 */
'use strict';
let config = require('config');
let SimpleNodeLogger = require('simple-node-logger');
let opts = {
    logDirectory: process.env.ERROR_LOGS_PATH || config.get('filePath').error_logs,
    fileNamePattern: '<date>_dev_error.log',
    dateFormat: 'YYYY-MM-DD',
    level: 'error'
};
let logger = SimpleNodeLogger.createRollingFileLogger( opts );

module.exports = logger;
