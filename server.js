let express = require('express'),
    bodyParser = require('body-parser'),
    dotenv = require('dotenv').config(),
    config = require('config'),
    jwt = require('jsonwebtoken'),
    helmet = require('helmet'),
    app = express(),
    swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json'),
    logger = require(process.env.LOGS_DEFINITION_PATH || config.get('filePath').log_definition),
    port = process.env.APP_PORT || config.get('app').port,
    dbPort = process.env.DB_PORT || config.get('db').port,
    dbName = process.env.DB_NAME || config.get('db').name,
    dbHost = process.env.DB_HOST || config.get('db').host,
    apiKey = process.env.API_SECRET_KEY,
    // dbLink = 'mongodb://' + dbHost + '/' + dbName;
    smartcarRouteFilePath = process.env.ROUTE_PATH || config.get('filePath').smartcarRoute,
    smartcarControllerFilePath = process.env.CONTROLLER_PATH || config.get('filePath').smartcarController,
    routes = require(smartcarRouteFilePath);

// console.log(process.env.API_SECRET_KEY);
// console.log(dbPort);
// console.log(port);
// console.log(dbName);
// console.log(dbHost);

    /*var mongoClient = require('mongodb').MongoClient;
    mongoClient.connect(dbLink)*/

app.use(helmet());
app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.json({ type : 'application/json' }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', routes);

app.use(function (req, res, next) {
    var token = req.body.token || req.headers || req.headers['x-access-token'];

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

app.use(function(err, req, res, next) {

    logger.error(err);

    if (req.app.get('env') !== 'development' && req.app.get('env') !== 'test') {
        delete err.stack;
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(err.statusCode || 500).json(err);
});

app.listen(port);
console.log("Smartcar API server started on port " + port);

module.exports = app;
