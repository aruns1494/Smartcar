/*
 * Used Winston.js to log errors and other information.
 * Every log entry contains a unique ID and a timestamp.
 * Message and status code get logged for every API access.
 */
'use strict';
let config = require('config');
let SimpleNodeLogger = require('simple-node-logger');
let optionsError = {
    logDirectory: process.env.ERROR_LOGS_PATH || config.get('filePath').error_logs,
    fileNamePattern: '<date>_' + process.env.NODE_ENV + '_error.log',
    dateFormat: 'YYYY-MM-DD',
    level: 'error'
};

let optionsInfo = {
    logDirectory: process.env.INFO_LOGS_PATH || config.get('filePath').info_logs,
    fileNamePattern: '<date>_' + process.env.NODE_ENV +'_info.log',
    dateFormat: 'YYYY-MM-DD',
    level: 'info'
};
let logger = {
    logInfo: SimpleNodeLogger.createRollingFileLogger( optionsInfo ),
    logError: SimpleNodeLogger.createRollingFileLogger( optionsError )
};

module.exports = logger;
