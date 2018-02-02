/*
 * Contains test cases for all REST endpoints
 * Followed the BDD approach for developing the REST endpoints
 * The test scripts were developed using Chai framework
 * Mocha was used to execute the test scripts
 * The test scripts have been configured to run only in the test environment.
 * A docker image has also been created for executing these test scripts.
 */
'use strict';

process.env.NODE_ENV = 'test';

let config = require('config');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require(config.get('filePath').server);
let should = chai.should();
let expect = chai.expect;

chai.use(chaiHttp);

/*
 * Checks whether the error response json for all routes is according to standard
 * The structure of the error response json is the same for all kinds of errors
 * A standard error response helped in maintaining the logs in a more structured fashion
 * The error codes include 400, 404, 422, 502, 500.
 */
let errorResponse = (response) => {
    response.body.should.be.a('Object');

    let length = Object.keys(response.body).length;

    length.should.be.eql(4);
    response.body.should.have.property('name');
    response.body.should.have.property('message');
    response.body.should.have.property('statusCode');
    response.body.should.have.property('errorCode');

    let name = response.body.name;
    let message = response.body.message;
    let statusCode = response.body.statusCode;
    let errorCode = response.body.errorCode;

    expect(name).to.be.a('string');
    expect(message).to.be.a('string');
    expect(statusCode).to.be.a('number');
    expect(errorCode).to.be.a('number');
};

let energyResponse = (response) => {
    response.body.should.be.an('Object');

    let length = Object.keys(response.body).length;

    length.should.be.eql(1);
    response.body.should.have.property('percent');

    let percent = response.body.percent;

    expect(percent).to.be.a('number');
}

/*
 * Checks whether the error response json for all routes is according to standard
 * The structure of the error response json is the same for all kinds of errors
 * A standard error response helped in maintaining the logs in a more structured fashion
 * The error codes include 400, 404, 422, 502, 500.
 */

let errorTestWithoutBody = (message, id, url, status) => {
    it(message, (done) => {
          let vehicleID = id;
          chai.request(server)
              .get(url)
              .end((error, response) => {
                  response.should.have.status(status);
                  errorResponse(response);
                  done();
              });
    });
}

let errorTestWithBody = (message, id, url, status, body) => {

    it(message, (done) => {
          let vehicleID = id;
          let data = body;
          chai.request(server)
              .post(url)
              .send(data)
              .end((error, response) => {
                  response.should.have.status(status);
                  errorResponse(response);
                  done();
              });
    });
}

/*
 * Test the /GET/vehicle/:id route
 * The route has been tested for one successful case and for two error scenarios
 */
let infoData = config.get('testScriptValues').VehicleInformationTest;
describe('/GET Vehicle Information', () => {
    it(infoData.Success.message, (done) => {
          let vehicleID = infoData.Success.id;
          chai.request(server)
              .get(infoData.Success.url)
              .end((error, response) => {
                  response.should.have.status(infoData.Success.status);
                  response.body.should.be.a('Object');

                  let length = Object.keys(response.body).length;

                  length.should.be.eql(4);
                  response.body.should.have.property('vin');
                  response.body.should.have.property('color');
                  response.body.should.have.property('doorCount');
                  response.body.should.have.property('driveTrain');

                  let vin = response.body.vin;
                  let color = response.body.color;
                  let doorCount = response.body.doorCount;
                  let driveTrain = response.body.driveTrain;

                  expect(vin).to.be.a('string');
                  expect(color).to.be.a('string');
                  expect(driveTrain).to.be.a('string');
                  expect(doorCount).to.be.a('number');
                  done();
              });
    });

    errorTestWithoutBody(infoData.NotFound.message, infoData.NotFound.id, infoData.NotFound.url, infoData.NotFound.status);
    errorTestWithoutBody(infoData.BadRequest.message, infoData.BadRequest.id, infoData.BadRequest.url, infoData.BadRequest.status);

});

/*
 * Test the /GET/vehicle/:id/doors route
 * The route has been tested for one successful case and for two error scenarios
 */
let securityData = config.get("testScriptValues").VehicleSecurityStatusTest;
describe('/GET Vehicle Security Status', () => {
    it(securityData.Success.message, (done) => {
          let vehicleID = securityData.Success.id;
          chai.request(server)
              .get(securityData.Success.url)
              .end((error, response) => {
                  response.should.have.status(securityData.Success.status);
                  response.body.should.be.an('array');

                  expect(response.body).to.have.length.below(5);
                  response.body.forEach((data) => {
                      data.should.have.property('location');
                      data.should.have.property('locked');

                      let location = data.location;
                      let locked = data.locked;

                      expect(location).to.be.a('string');
                      expect(locked).to.be.a('boolean');

                  });
                  done();
              });
    });

    errorTestWithoutBody(securityData.NotFound.message, securityData.NotFound.id, securityData.NotFound.url, securityData.NotFound.status);
    errorTestWithoutBody(securityData.BadRequest.message, securityData.BadRequest.id, securityData.BadRequest.url, securityData.BadRequest.status);

});

/*
 * Test the /GET/vehicle/:id/fuel route
 * The route has been tested for one successful case and for two error scenarios
 */
let fuelData = config.get("testScriptValues").VehicleFuelLevelTest;
describe('/GET Vehicle Fuel Level', () => {
    it(fuelData.Success.message, (done) => {
          let vehicleID = fuelData.Success.id;
          chai.request(server)
              .get(fuelData.Success.url)
              .end((error, response) => {
                  response.should.have.status(fuelData.Success.status);
                  energyResponse(response);
                  done();
              });
    });

    errorTestWithoutBody(fuelData.NotFound.message, fuelData.NotFound.id, fuelData.NotFound.url, fuelData.NotFound.status);
    errorTestWithoutBody(fuelData.BadRequest.message, fuelData.BadRequest.id, fuelData.BadRequest.url, fuelData.BadRequest.status);

});

/*
 * Test the /GET/vehicle/:id/battery route
 * The route has been tested for one successful case and for two error scenarios
 */
let batteryData = config.get("testScriptValues").VehicleBatteryLevelTest;
describe('/GET Vehicle Battery Level', () => {
    it(batteryData.Success.message, (done) => {
          let vehicleID = batteryData.Success.id;
          chai.request(server)
              .get(batteryData.Success.url)
              .end((error, response) => {
                  response.should.have.status(batteryData.Success.status);
                  energyResponse(response);
                  done();
              });
    });

    errorTestWithoutBody(batteryData.NotFound.message, batteryData.NotFound.id, batteryData.NotFound.url, batteryData.NotFound.status);
    errorTestWithoutBody(batteryData.BadRequest.message, batteryData.BadRequest.id, batteryData.BadRequest.url, batteryData.BadRequest.status);

});

/*
 * Test the /POST/vehicle/:id/engine route
 * The route has been tested for one successful case and for three error scenarios
 */
let engineData = config.get("testScriptValues").VehicleEngineActionTest;
describe('/POST Executing Engine Action', () => {
    it(engineData.Success.message, (done) => {
          let vehicleID = engineData.Success.id;
          let data = {
              action : engineData.Success.body.action
          };
          chai.request(server)
              .post(engineData.Success.url)
              .send(data)
              .end((error, response) => {

                  response.should.have.status(engineData.Success.status);
                  response.body.should.be.a('Object');

                  let length = Object.keys(response.body).length;

                  length.should.be.eql(1);
                  response.body.should.have.property('status');

                  let status = response.body.status;

                  expect(status).to.be.a('string');
                  done();
              });
    });

    let body = {
        action : engineData.NotFound.body.action
    };
    let errorBody = {
        action : engineData.UnprocessableEntity.body.action
    }
    errorTestWithBody(engineData.NotFound.message, engineData.NotFound.id, engineData.NotFound.url, engineData.NotFound.status, body);
    errorTestWithBody(engineData.BadRequest.message, engineData.BadRequest.id, engineData.BadRequest.url, engineData.BadRequest.status, body);
    errorTestWithBody(engineData.UnprocessableEntity.message, engineData.UnprocessableEntity.id, engineData.UnprocessableEntity.url, engineData.UnprocessableEntity.status, errorBody);

});
