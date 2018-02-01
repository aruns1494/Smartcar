// let winston = require('winston');
// let config = require('config');
// let { createLogger, format, transports } = require('winston');
// let { combine, timestamp, label, prettyPrint } = format;
//
// let logger = new winston.createLogger({
//     format: combine(
//         timestamp(),
//         prettyPrint(),
//         format.json()
//     ),
//     transports: [
//         new transports.Console(),
//         new transports.File({ filename : process.env.LOGS_PATH || config.get('filePath').error_logs })
//      ]
// });

let winston = require('winston');
let { format, createLogger, transports } = require('winston');
let fs = require('fs');
let moment = require('moment');
let today = moment().format('YYYY-MM-DD HH:mm:ss');
let uuid = require('uuid/v1');
let config = require('config');
/*if (!fs.existsSync(today)) {
    fs.mkdirSync(today);
}*/

let customFileFormatter = format((options, info) => {
    console.log(options);
    //console.log(today + ' [' + options.level.toUpperCase() + '] ' + uuid() + ' ' + (undefined !== options.message ? options.message : ''));
    return today + ' [' + options.level.toUpperCase() + '] ' + uuid() + ' ' + (undefined !== options.message ? options.message : '');
    // return today + ' [' + options.level.toUpperCase() + '] ' + uuid() + ' ' + (undefined !== options.message ? options.message : '') +
    //         (options.meta && Object.keys(options.meta).length ? JSON.stringify(options.meta) : '');
});

let logger  = new winston.createLogger({

    format: customFileFormatter(),
    json: false,
    transports: [
        new transports.Console(),
        new transports.File({ filename : process.env.LOGS_PATH || config.get('filePath').error_logs })
    ]
});

// winston.remove(winston.transports.Console);
// winston.add(winston.transports.File,
//         {
//             timestamp: function () {
//                 return moment().format();
//             },
//             json: false,
//             filename: today + process.env.LOGS_PATH || config.get('filePath').error_logs,
//             formatter: customFileFormatter
//         }
// );
//
// module.exports = function (req, res, next) {
//     next()
// };

module.exports = logger;
