//process.env.NODE_ENV = 'test';

let config = require('config'),
    chai = require('chai'),
    chaiHttp = require('chai-http'),
    server = require(config.get('filePath').server);
    should = chai.should();

chai.use(chaiHttp);

describe('/vehicles/:id', () => {
    it('It should retreive the information of a vehicle given its ID', (done) => {
          let vehicleID = '1234';
          chai.request(server)
              .get('/vehicles/' + vehicleID)
              .end((error, response) => {
                  console.log(response.body);
                  response.should.have.status(200);
                  response.body.should.be.a('Object');
                  let length = Object.keys(response.body).length;
                  length.should.be.eql(4);
                  done();
              });
    });
});
