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
 * Test the /GET/vehicle/:id route
 * The route has been tested for one successful case and for two error scenarios
 */

describe('/GET Vehicle Information', () => {
    it('It should retreive the information of a vehicle given its ID', (done) => {
          let vehicleID = '1234';
          chai.request(server)
              .get('/vehicles/' + vehicleID)
              .end((error, response) => {
                  response.should.have.status(200);
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

    it('It should display an error stating given vehicle ID is not found', (done) => {
          let vehicleID = '1236';
          chai.request(server)
              .get('/vehicles/' + vehicleID)
              .end((error, response) => {
                  response.should.have.status(404);
                  errorResponse(response);
                  done();
              });
    });

    it('It should display an error stating given vehicle ID is not a valid number', (done) => {
          let vehicleID = 'ash';
          chai.request(server)
              .get('/vehicles/' + vehicleID)
              .end((error, response) => {
                  response.should.have.status(400);
                  errorResponse(response);
                  done();
              });
    });

});

/*
 * Test the /GET/vehicle/:id/doors route
 * The route has been tested for one successful case and for two error scenarios
 */

describe('/GET Vehicle Security Status', () => {
    it('It should retreive the security status of a vehicle given its ID', (done) => {
          let vehicleID = '1234';
          chai.request(server)
              .get('/vehicles/' + vehicleID + '/doors')
              .end((error, response) => {
                  response.should.have.status(200);
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

    it('It should display an error stating given vehicle ID is not found', (done) => {
          let vehicleID = '1236';
          chai.request(server)
              .get('/vehicles/' + vehicleID + '/doors')
              .end((error, response) => {
                  response.should.have.status(404);
                  errorResponse(response);
                  done();
              });
    });

    it('It should display an error stating given vehicle ID is not valid', (done) => {
          let vehicleID = 'ash';
          chai.request(server)
              .get('/vehicles/' + vehicleID + '/doors')
              .end((error, response) => {
                  response.should.have.status(400);
                  errorResponse(response);
                  done();
              });
    });

});

/*
 * Test the /GET/vehicle/:id/fuel route
 * The route has been tested for one successful case and for two error scenarios
 */

describe('/GET Vehicle Fuel Level', () => {
    it('It should retreive the fuel level of a vehicle given its ID', (done) => {
          let vehicleID = '1234';
          chai.request(server)
              .get('/vehicles/' + vehicleID + '/fuel')
              .end((error, response) => {
                  response.should.have.status(200);
                  energyResponse(response);
                  done();
              });
    });

    it('It should display an error stating given vehicle ID is not found', (done) => {
          let vehicleID = '1236';
          chai.request(server)
              .get('/vehicles/' + vehicleID + '/fuel')
              .end((error, response) => {
                  response.should.have.status(404);
                  errorResponse(response);
                  done();
              });
    });

    it('It should display an error stating given vehicle ID is not valid', (done) => {
          let vehicleID = 'ash';
          chai.request(server)
              .get('/vehicles/' + vehicleID + '/fuel')
              .end((error, response) => {
                  response.should.have.status(400);
                  errorResponse(response);
                  done();
              });
    });

});

/*
 * Test the /GET/vehicle/:id/battery route
 * The route has been tested for one successful case and for two error scenarios
 */

describe('/GET Vehicle Battery Level', () => {
    it('It should retreive the battery level of a vehicle given its ID', (done) => {
          let vehicleID = '1235';
          chai.request(server)
              .get('/vehicles/' + vehicleID + '/battery')
              .end((error, response) => {
                  response.should.have.status(200);
                  energyResponse(response);
                  done();
              });
    });

    it('It should display an error stating given vehicle ID is not found', (done) => {
          let vehicleID = '1236';
          chai.request(server)
              .get('/vehicles/' + vehicleID + '/battery')
              .end((error, response) => {
                  response.should.have.status(404);
                  errorResponse(response);
                  done();
              });
    });

    it('It should display an error stating given vehicle ID is not valid', (done) => {
          let vehicleID = 'ash';
          chai.request(server)
              .get('/vehicles/' + vehicleID + '/battery')
              .end((error, response) => {
                  response.should.have.status(400);
                  errorResponse(response);
                  done();
              });
    });

});

/*
 * Test the /POST/vehicle/:id/engine route
 * The route has been tested for one successful case and for three error scenarios
 */

describe('/POST Executing Engine Action', () => {
    it('It should execute the specified action on a vehicle (given its ID) and display the appropriate message', (done) => {
          let vehicleID = '1234';
          let data = {
              action : 'START'
          };
          chai.request(server)
              .post('/vehicles/' + vehicleID + '/engine')
              .send(data)
              .end((error, response) => {

                  response.should.have.status(200);
                  response.body.should.be.a('Object');

                  let length = Object.keys(response.body).length;

                  length.should.be.eql(1);
                  response.body.should.have.property('status');

                  let status = response.body.status;

                  expect(status).to.be.a('string');
                  done();
              });
    });

    it('It should display an error stating given vehicle ID is not found', (done) => {
          let vehicleID = '1236';
          let data = {
              action : "START"
          };
          chai.request(server)
              .post('/vehicles/' + vehicleID + '/engine')
              .send(data)
              .end((error, response) => {
                  response.should.have.status(404);
                  errorResponse(response);
                  done();
              });
    });

    it('It should display an error stating given vehicle ID is not a valid number', (done) => {
          let vehicleID = 'ash';
          let data = {
              action : "START"
          };
          chai.request(server)
              .post('/vehicles/' + vehicleID + '/engine')
              .send(data)
              .end((error, response) => {
                  response.should.have.status(400);
                  errorResponse(response);
                  done();
              });
    });

    it('It should display an error stating specified action cannot be processed as it is invalid', (done) => {
          let vehicleID = '1234';
          let data = {
              action : "DUMMY"
          };
          chai.request(server)
              .post('/vehicles/' + vehicleID + '/engine')
              .send(data)
              .end((error, response) => {
                  response.should.have.status(422);
                  errorResponse(response);
                  done();
              });
    });

});
