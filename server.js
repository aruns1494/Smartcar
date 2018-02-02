/*
 * Would have handled this more maturely if there were a lot more environments to consider by creating a config.js file in the config folder
 */
'use strict';

let express = require('express');
let bodyParser = require('body-parser');
let dotenv = require('dotenv').load();
let config = require('config');
let jwt = require('jsonwebtoken');
let helmet = require('helmet');
let app = express();
let swaggerUi = require('swagger-ui-express');
let swaggerDocument = require('./swagger.json');
let moment = require('moment');
let uuid = require('uuid/v1');
//console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test') {
    console.log(process.env.NODE_ENV);
    process.exit(1);
    //process.env.NODE_ENV = 'development';
}
console.log(process.env.NODE_ENV);
let log = require(process.env.LOGS_DEFINITION_PATH || config.get('filePath').log_definition);
let port = process.env.APP_PORT || config.get('app').port;
let dbPort = process.env.DB_PORT || config.get('db').port;
let dbName = process.env.DB_NAME || config.get('db').name;
let dbHost = process.env.DB_HOST || config.get('db').host;
let apiKey = process.env.API_SECRET_KEY;
let smartcarRouteFilePath = process.env.ROUTE_PATH || config.get('filePath').smartcarRoute;
let smartcarControllerFilePath = process.env.CONTROLLER_PATH || config.get('filePath').smartcarController;
let routes = require(smartcarRouteFilePath);

/*
 * Loading MongoDB instance using mongoose. Not in use for current design.
 */

//let dbLink = 'mongodb://' + dbHost + '/' + dbName;
// console.log(process.env.API_SECRET_KEY);
// console.log(dbPort);
// console.log(port);
// console.log(dbName);
// console.log(dbHost);

// var mongoClient = require('mongodb').MongoClient;
// mongoClient.connect(dbLink)

app.use(helmet());
app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.json({ type : 'application/json' }));

/*
 * API documentation route
 * http://localhost:3000/api-docs
 * For now anyone can access this, but in the future I would be restricting its access based on Authorization Token
 */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', routes);

/*
 * Middleware for decoding user's Authorization token
 * Below method then makes a callback to the token analyzer method in the controller section
 * This module could be implemented in a production environment for allowing secure access to API
 * The authorization token module can also be implemented using the passport.js library
 */

app.use(function (req, res, next) {
    let token = req.body.token || req.headers || req.headers['x-access-token'];

    if(token) {
        jwt.verify(token, apiKey, function(err, decoded) {
              if(err) {
                  req.user = undefined;
              } else {
                  req.user = decoded;
              }

              next();
        });
    } else {
        req.user = undefined;
        next();
    }
});

routes(app, smartcarControllerFilePath);

/*
 * Middleware for logging status messages in respective log files
 */
app.use(function(info, req, res, next) {

    let result;

    if(info.statusCode !== undefined && info.statusCode > 300 && info.statusCode <= 511) {
        result = "| " + uuid() + " | " + info.name + " | " + info.message + " | " + info.statusCode;
        log.logError.error(result);

    } else if(info.message.statusCode !== undefined && info.message.statusCode >= 200 && info.message.statusCode <= 300) {

        result = "| " + uuid() + " | " + info.message.name + " | " + info.message.msg + " | " + info.message.statusCode + " | " + JSON.stringify(info.body);
        log.logInfo.info(result);
    }

    if (req.app.get('env') !== 'development' && req.app.get('env') !== 'test') {
        delete info.stack;
    }

    if(info.statusCode !== undefined && info.statusCode > 300 && info.statusCode <= 511) {
        res.setHeader('Content-Type', 'application/json');
        res.status(info.statusCode || 500).json(info);
    }
});

app.listen(port);
console.log("Smartcar API server started on port " + port);

/*
 * Exporting app for executing test scripts
 */
module.exports = app;
