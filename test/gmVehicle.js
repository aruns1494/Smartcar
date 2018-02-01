process.env.NODE_ENV = 'test';

let config = require('config'),
    chai = require('chai'),
    chaiHttp = require('chai-http'),
    server = require(config.get('filePath').server);
    should = chai.should(),
    expect = chai.expect;

chai.use(chaiHttp);

let errorResponse = (response) => {
    response.body.should.be.a('Object');

    let length = Object.keys(response.body).length;

    length.should.be.eql(6);
    response.body.should.have.property('name');
    response.body.should.have.property('message');
    response.body.should.have.property('statusCode');
    response.body.should.have.property('errorCode');
    response.body.should.have.property('level');
    response.body.should.have.property('timestamp');

    let name = response.body.name;
    let message = response.body.message;
    let statusCode = response.body.statusCode;
    let errorCode = response.body.errorCode;
    let level = response.body.level;
    let timestamp = response.body.timestamp;

    expect(name).to.be.a('string');
    expect(message).to.be.a('string');
    expect(statusCode).to.be.a('number');
    expect(errorCode).to.be.a('number');
    expect(level).to.be.a('string');
    expect(timestamp).to.be.a('string');
};

let energyResponse = (response) => {
    response.body.should.be.an('Object');

    let length = Object.keys(response.body).length;

    length.should.be.eql(1);
    response.body.should.have.property('percent');

    let percent = response.body.percent;

    expect(percent).to.be.a('number');
}

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
                  //console.log(response);
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

    it('It should display an error stating given vehicle ID is not a valid number', (done) => {
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
