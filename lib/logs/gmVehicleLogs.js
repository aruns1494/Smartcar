/*
 * Used Winston.js to log errors and other information.
 * Every log entry contains a unique ID and a timestamp.
 * Message and status code get logged for every API access.
 */
'use strict';

let winston = require('winston');
let { format, transports } = require('winston');
let { printf, combine } = format;
let fs = require('fs');
let moment = require('moment');
let uuid = require('uuid/v1');
let config = require('config');

let myFormat = printf(info => {
    let today = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    return today + ' ['+info.level+'] ' + uuid() + " " + info.message.name + " " + info.message.message + " " + info.message.statusCode;
});

let logger =  winston.createLogger({

    format: myFormat,
    transports: [
        new winston.transports.Console({ level: 'error' }),
        new winston.transports.File({
            filename: process.env.INFO_LOGS_PATH || config.get('filePath').info_logs,
            level: 'info',
            //colors: 'green'
        }),
        new winston.transports.File({
            filename: process.env.ERROR_LOGS_PATH || config.get('filePath').error_logs,
            level: 'error',
            //colors: 'red'
        })
    ],
});

module.exports = logger;
