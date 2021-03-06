/*
 * Contains the business logic of all the rest endpoints
 * The business logic for rach route has been coded into separate methods and exported for the route file to consume
 * Used the throw.js library to capture errors in the request/response body
 * Used the node-fetch library to request data from third-party APIs
 */

'use strict';

let jwt =   require('jsonwebtoken');
let fetch = require('node-fetch');
let dotenv = require('dotenv').config();
let config = require('config');
let errors = require('throw.js');
let logger = require('../logs/gmVehicleLogs');

let infoCollection = (responseData, status, success, code, next) => {
    let info = {
        message: {
            name: status,
            msg: success,
            statusCode: code
        }
    }
    info.body = responseData;
    next(info);
};

/*
 * GET vehicles/:id
 * Retrieves the information of a vehicle with the given ID
 * Handles bad request (Invalid ID)
 * Handles data not found error (Given ID not found in database/ thid-party API response)
 */
exports.getVehicleInfoService = (req, res, next) => {

    try {
            let vehicleInfoService = config.get('genericMotorApi').links.getVehicleInfoService;
            let url = vehicleInfoService.url;
            let data = vehicleInfoService.data;
            let options = vehicleInfoService.options;
            data.id = req.params.id;
            options.body = JSON.stringify(data);

            if(isNaN(parseFloat(data.id))) {
                throw new errors.BadRequest('Invalid Request as the vehicle ID was not a valid number');
            }

            fetch(url, options).then((response) => {
                if(response.ok) {
                    return response.json()
                }
                Promise.reject(new errors.BadGateway("No response from third-party API"));
            })
            .then((response) => {
                if(parseInt(response.status) === 200) {
                    let count;
                    let vehicleInfo;
                    if(response.data.fourDoorSedan.value === "True") {
                        count = 4;
                    } else if(response.data.twoDoorCoupe.value === "True") {
                        count = 2;
                    } else {
                        throw new Error("Door count data not available");
                    }
                    vehicleInfo = {
                            vin: response.data.vin.value,
                            color: response.data.color.value,
                            doorCount: count,
                            driveTrain: response.data.driveTrain.value
                    };
                    let msg = "Retrieved information of vehicle with given ID : "+data.id;
                    infoCollection(vehicleInfo, "OK", msg, response.status, next);
                    res.setHeader('Content-Type', 'application/json');
                    return res.status(200).json(vehicleInfo);
                }
                throw new errors.NotFound('Entity with id: ' +req.params.id+ ' could not be found');
                //throw new Error('Network response was not ok.');
            })
            .catch((error) => {
                if(error.statusCode === undefined) {
                  next(new errors.InternalServerError(error));
                } else {
                    next(error);
                }
            });
		} catch(error) {
        if(error.statusCode === undefined) {
          next(new errors.InternalServerError(error));
        } else {
            next(error);
        }
		}
};

/*
 * GET vehicles/:id/doors
 * Retrieves the security status of a vehicle with the given ID
 * Handles bad request (Invalid ID)
 * Handles data not found error (Given ID not found in database/ thid-party API response)
 */
exports.getSecurityStatusService = (req, res, next) => {
    try {
            let securityStatusService = config.get('genericMotorApi').links.getSecurityStatusService;
            let url = securityStatusService.url;
            let data = securityStatusService.data;
            let options = securityStatusService.options;
            data.id = req.params.id;
            options.body = JSON.stringify(data);

            if(isNaN(parseFloat(data.id))) {
                throw new errors.BadRequest('Invalid Request as the vehicle ID was not a valid number');
            }

            fetch(url, options).then((response) => {
                if(response.ok) {
                    return response.json()
                }
                Promise.reject(new errors.BadGateway("No response from third-party API"));
            })
            .then((response) => {
                if(parseInt(response.status) === 200) {
                    let numberOfDoors = response.data.doors.values.length;
                    let securityData = response.data.doors.values;
                    let securityStatus = [];
                    for(let i = 0; i < numberOfDoors; i++) {
                        let doorStatus = {
                            location: securityData[i].location.value,
                            locked: (securityData[i].locked.value === 'True')
                        };

                        securityStatus.push(doorStatus);
                    }
                    let msg = "Retrieved security status of vehicle with given ID : "+data.id;
                    infoCollection(securityStatus, "OK", msg, response.status, next);
                    res.setHeader('Content-Type', 'application/json');
                    return res.status(200).json(securityStatus);
                }
                throw new errors.NotFound('Entity with id: ' +req.params.id+ ' couldn\'t be found');
            })
            .catch((error) => {
                if(error.statusCode === undefined) {
                  next(new errors.InternalServerError(error));
                } else {
                    next(error);
                }
            });
    } catch(error) {

        if(error.statusCode === undefined) {
          next(new errors.InternalServerError(error));
        } else {
            next(error);
        }
    }
};

/*
 * GET vehicles/:id/fuel
 * Retrieves the fuel level of a vehicle with the given ID
 * Handles bad request (Invalid ID)
 * Handles data not found error (Given ID not found in database/ thid-party API response)
 */
exports.getFuelLevel = (req, res, next) => {
    try {
            let fuelLevelService = config.get('genericMotorApi').links.getEnergyService;
            let url = fuelLevelService.url;
            let data = fuelLevelService.data;
            let options = fuelLevelService.options;
            data.id = req.params.id;
            options.body = JSON.stringify(data);

            if(isNaN(parseFloat(data.id))) {
                throw new errors.BadRequest('Invalid Request as the vehicle ID was not a valid number');
            }

            fetch(url, options).then((response) => {
                if(response.ok) {
                    return response.json()
                }
                Promise.reject(new errors.BadGateway("No response from third-party API"));
            })
            .then((response) => {
                if(parseInt(response.status) === 200) {
                    //let fuelLevel = parseInt(response.data.tankLevel.value);
                    let responseData = {
                          percent: parseInt(response.data.tankLevel.value)
                    }
                    let msg = "Retrieved fuel level of vehicle with given ID : "+data.id;
                    infoCollection(responseData, "OK", msg, response.status, next);
                    res.setHeader('Content-Type', 'application/json');
                    return res.status(200).json(responseData);
                }
                throw new errors.NotFound('Entity with id: ' +req.params.id+ ' couldn\'t be found');
            })
            .catch((error) => {
                if(error.statusCode === undefined) {
                  next(new errors.InternalServerError(error));
                } else {
                    next(error);
                }
            });
    } catch(error) {
        if(error.statusCode === undefined) {
          next(new errors.InternalServerError(error));
        }
        next(error);
    }
};

/*
 * GET vehicles/:id/battery
 * Retrieves the fuel level of a vehicle with the given ID
 * Handles bad request (Invalid ID)
 * Handles data not found error (Given ID not found in database/ thid-party API response)
 */
exports.getBatteryLevel = (req, res, next) => {
    try {
            let batteryLevelService = config.get('genericMotorApi').links.getEnergyService;
            let url = batteryLevelService.url;
            let data = batteryLevelService.data;
            let options = batteryLevelService.options;
            data.id = req.params.id;
            options.body = JSON.stringify(data);

            if(isNaN(parseFloat(data.id))) {
                throw new errors.BadRequest('Invalid Request as the vehicle ID was not a valid number');
            }

            fetch(url, options).then((response) => {
                if(response.ok) {
                    return response.json()
                }
                Promise.reject(new errors.BadGateway("No response from third-party API"));
            })
            .then((response) => {
                if(parseInt(response.status) === 200) {
                    //let batteryLevel = parseInt(response.data.batteryLevel.value);
                    let responseData = {
                          percent: parseInt(response.data.batteryLevel.value)
                    }
                    let msg = "Retrieved battery level of vehicle with given ID : "+data.id;
                    infoCollection(responseData,"OK" ,msg ,response.status , next);
                    res.setHeader('Content-Type', 'application/json');
                    return res.status(200).json(responseData);
                }
                throw new errors.NotFound('Entity with id: ' +req.params.id+ ' couldn\'t be found');
            })
            .catch((error) => {
                if(error.statusCode === undefined) {
                  next(new errors.InternalServerError(error));
                } else {
                    next(error);
                }
            });
    } catch(error) {
        if(error.statusCode === undefined) {
          next(new errors.InternalServerError(error));
        } else {
            next(error);
        }
    }
};

/*
 * POST vehicles/:id/engine
 * Executes the specified action on a vehicle with the given ID
 * Handles bad request (Invalid ID)
 * Handles data not found error (Given ID not found in database/ thid-party API response)
 * Handles UnprocessableEntity error (Invalid action)
 */
exports.executingEngineActionService = (req, res, next) => {
    try {
            let actionEngineService = config.get('genericMotorApi').links.actionEngineService;
            let url = actionEngineService.url;
            let data = actionEngineService.data;
            let options = actionEngineService.options;
            data.id = req.params.id;

            if(req.body.action === 'START') {
                data.command = 'START_VEHICLE';
            } else if(req.body.action === 'STOP') {
                data.command = 'STOP_VEHICLE';
            } else {
                throw new errors.UnprocessableEntity('Invalid Request as the action taken is not valid');
            }
            options.body = JSON.stringify(data);

            if(isNaN(parseFloat(data.id))) {
                throw new errors.BadRequest('Invalid Request as the vehicle ID was not a valid number');
            }

            fetch(url, options).then((response, reject) => {
                if(response.ok) {
                    return response.json()
                }
                Promise.reject(new errors.BadGateway("No response from third-party API"));
            })
            .then((response) => {
                if(parseInt(response.status) === 200) {
                    let actionResult;
                    if(response.actionResult.status === 'EXECUTED') {
                        actionResult = 'success';
                    } else if(response.actionResult.status === 'FAILED') {
                        actionResult = 'error';
                    }
                    let responseData = {
                        status: actionResult
                    }
                    let msg = "Executed specified action on the vehicle with given ID : "+data.id;
                    infoCollection(responseData, "OK", msg, response.status, next);
                    res.setHeader('Content-Type', 'application/json');
                    return res.status(200).json(responseData);
                }
                throw new errors.NotFound('Entity with id: ' +req.params.id+ ' couldn\'t be found');
            })
            .catch((error) => {
                if(error.statusCode === undefined) {
                  next(new errors.InternalServerError(error));
                } else {
                    next(error);
                }
            });
    } catch(error) {
        if(error.statusCode === undefined) {
          next(new errors.InternalServerError(error));
        } else {
            next(error);
        }
    }
};

/*
 * The Authorization token analyzer checks for the decoded value stored in the request parameter
 * If valid, then it provides the user access to the corresponding REST API endpoint
 * If not, then it displays a Forbidden Error
 * In production environment this method is attached along with all the routes
 */
 exports.login_required = function (req, res, next) {
      try {
        		if(req.user) {
        			   next();
        		}

            throw new errors.Forbidden('Authorization token is not valid');
      } catch(error) {
          if(error.statusCode === undefined) {
            next(new errors.InternalServerError(error));
          } else {
              next(error);
          }
      }
	};
