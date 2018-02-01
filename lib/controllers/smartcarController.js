let jwt =   require('jsonwebtoken'),
    fetch = require('node-fetch'),
    dotenv = require('dotenv').config(),
    config = require('config'),
    errors = require('throw.js');
    //db
exports.getVehicleInfoService = (req, res, next) => {
    //console.log(process.env.APP_PORT || config.get('app').port);

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
                throw new errors.BadGateway("No response from third-party API");
                //throw new Error('Network response was not ok.');
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
                    }
                    res.setHeader('Content-Type', 'application/json');
                    return res.status(200).json(vehicleInfo);;
                }
                throw new errors.NotFound('Entity with id: ' +req.params.id+ ' could not be found');
                //throw new Error('Network response was not ok.');
            })
            .catch((error) => {
                if(error.statusCode === undefined) {
                  next(new errors.InternalServerError(error));
                }
                next(error);
            });
		} catch(error) {
        if(error.statusCode === undefined) {
          next(new errors.InternalServerError(error));
        }
        next(error);
		}
};

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
                throw new errors.BadGateway("No response from third-party API");
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
                    res.setHeader('Content-Type', 'application/json');
                    return res.status(200).json(securityStatus);
                }
                throw new errors.NotFound('Entity with id: ' +req.params.id+ ' couldn\'t be found');
            })
            .catch((error) => {
                if(error.statusCode === undefined) {
                  next(new errors.InternalServerError(error));
                }
                next(error);
            });
    } catch(error) {

        if(error.statusCode === undefined) {
          next(new errors.InternalServerError(error));
        }

        next(error);
    }
};

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
                throw new errors.BadGateway("No response from third-party API");
            })
            .then((response) => {
                if(parseInt(response.status) === 200) {
                    let fuelLevel = parseInt(response.data.tankLevel.value);
                    res.setHeader('Content-Type', 'application/json');
                    return res.status(200).json({ "percent" : fuelLevel });
                }
                throw new errors.NotFound('Entity with id: ' +req.params.id+ ' couldn\'t be found');
            })
            .catch((error) => {
                if(error.statusCode === undefined) {
                  next(new errors.InternalServerError(error));
                }
                next(error);
            });
    } catch(error) {
        if(error.statusCode === undefined) {
          next(new errors.InternalServerError(error));
        }
        next(error);
    }
};

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
                throw new errors.BadGateway("No response from third-party API");
            })
            .then((response) => {
                if(parseInt(response.status) === 200) {
                    let batteryLevel = parseInt(response.data.batteryLevel.value);
                    res.setHeader('Content-Type', 'application/json');
                    return res.status(200).json({ "percent" : batteryLevel });
                }
                throw new errors.NotFound('Entity with id: ' +req.params.id+ ' couldn\'t be found');
            })
            .catch((error) => {
                if(error.statusCode === undefined) {
                  next(new errors.InternalServerError(error));
                }
                next(error);
            });
    } catch(error) {
        if(error.statusCode === undefined) {
          next(new errors.InternalServerError(error));
        }
        next(error);
    }
};

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

            fetch(url, options).then((response) => {
                if(response.ok) {
                    return response.json()
                }
                throw new errors.BadGateway("No response from third-party API");
            })
            .then((response) => {
                if(parseInt(response.status) === 200) {
                    let actionResult;
                    if(response.actionResult.status === 'EXECUTED') {
                        actionResult = 'success';
                    } else if(response.actionResult.status === 'FAILED') {
                        actionResult = 'error';
                    }
                    res.setHeader('Content-Type', 'application/json');
                    return res.status(200).json({ 'status' : actionResult });
                }
                throw new errors.NotFound('Entity with id: ' +req.params.id+ ' couldn\'t be found');
            })
            .catch((error) => {
                if(error.statusCode === undefined) {
                  next(new errors.InternalServerError(error));
                }
                next(error);
            });
    } catch(error) {
        if(error.statusCode === undefined) {
          next(new errors.InternalServerError(error));
        }
        next(error);
    }
};
