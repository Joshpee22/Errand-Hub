/* eslint-disable no-undef */
const moment = require('moment');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { v4: uuidv4 } = require('uuid');
const app = require('../server.js');
const Parcel = require('../src/model/parcel.js');


chai.use(chaiHttp);
// eslint-disable-next-line no-unused-vars
const should = chai.should();
const invalidParcel = '6509a627-3e44-4285';
const correctParcelIdFormat = 'ae682c8a-16d4-4a49-9bed-f2114810efab';
let validParcelId = '';
const validUser = 'errandhub21@gmail.com';
let userid = '';
let token = '';
const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzYTQ5MGFhMS0zNzMwLTQ0YTQtODY1NC0zMGJmYjRiN2QzZmMiLCJpYXQiOjE1NDk2MDY5MDEsImV4cCI6MTU1MDM4NDUwMX0.hMDfBof0-UNcBHku-uJb_wxa1WFaFHz5esx9kCr_nrE';
const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjZWFlODEyZC00MDZhLTQyZmYtODk2Mi04ZDdlNTFjNjUyNzQiLCJpYXQiOjE1NDQwMzIzNTgsImV4cCI6MTU0NDIwNTE1OH0.5P9_JkyklSITuVSQg4Os-vCp6kt3BeVhMkMNNvIJSdE';
const newParcel = new Parcel(uuidv4(), 'Nigeria', 'Kenya', 'Rwanda', 4,
  userid, '9037845663', 'PENDING', moment(new Date()), moment(new Date()));


describe('POST /api/v1/auth/signup', () => {
  it('should return 201 - Register a user', (done) => {
    const newUser = {
      email: 'errandhub21@gmail.com',
      firstName: 'admin',
      lastName: 'admin',
      password: '123',
      username: 'admin',
    };
    chai.request(app).post('/api/v1/auth/signup')
      .send(newUser).end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Account Created Successfully');
        done();
      });
  });
});

describe('GET /api/v1/auth/login', () => {
  it('should return 400 - The credentials you provided is incorrect', (done) => {
    chai.request(app).post('/api/v1/auth/login')
      .send({ email: '', password: '' }).end((err, res) => {
        res.body.should.have.property('message').eql('Email and Password are required');
        res.should.have.status(400);
        done();
      });
  });
  it('should return 400 - User not found', (done) => {
    chai.request(app).post('/api/v1/auth/login')
      .send({ email: '12345', password: '123' }).end((err, res) => {
        res.body.should.have.property('message').eql('Please enter a valid email address');
        res.should.have.status(400);
        done();
      });
  });
  it('should return 200 - Success', (done) => {
    chai.request(app).post('/api/v1/auth/login')
      .send({ email: 'errandhub21@gmail.com', password: '123' }).end((err, res) => {
        res.should.have.status(200);
        // eslint-disable-next-line prefer-destructuring
        token = res.body.token;
        userid = res.body.data.id;
        done();
      });
  });
});

describe('GET /api/v1/users/:userId', () => {
  it('should return 200', (done) => {
    chai.request(app).get(`/api/v1/users/${userid}`).set('x-access-token', token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.data.username.length.should.be.eql(5);
        res.body.should.have.property('message').eql('Success');
        done();
      });
  });
});

describe('GET /api/v1/users/:userId', () => {
  it('should return 400 - status ', (done) => {
    chai.request(app).put(`/api/v1/parcels/${validUser}/status`)
      .set('x-access-token', token)
      .send({ status: '' })
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });
  it('should return 400 - presentLocation ', (done) => {
    chai.request(app).put(`/api/v1/parcels/${validUser}/presentLocation`)
      .set('x-access-token', token)
      .send({ presentLocation: '' })
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });
});

describe('POST /api/v1/parcels', () => {
  it('should return 201 - Create a parcel delivery order', (done) => {
    chai.request(app).post('/api/v1/parcels').set('x-access-token', token)
      .send(newParcel)
      .end((error, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Parcel Created Successfully');
        res.body.data.should.have.property('location');
        res.body.data.should.have.property('destination');
        res.body.data.should.have.property('present_location');
        res.body.data.should.have.property('weight').equal(4);
        done();
      });
  });

  it('should return 400 - Create a parcel delivery order', (done) => {
    chai.request(app).post('/api/v1/parcels/').send(newParcel).end((err, res) => {
      res.should.have.status(400);
      res.body.should.have.property('message').eql('Token is not provided');
      done();
    });
  });
  it('should return 400 - Create a parcel delivery order - invalid signature', (done) => {
    chai.request(app).post('/api/v1/parcels/').set('x-access-token', `${token}kdfe3`)
      .send(newParcel)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('name').eql('JsonWebTokenError');
        res.body.should.have.property('message').eql('invalid signature');
        done();
      });
  });

  it('should return 400 - Create a parcel delivery order - jwt expired', (done) => {
    chai.request(app).post('/api/v1/parcels/').set('x-access-token', `${expiredToken}`)
      .send(newParcel)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('message').eql('jwt expired');
        done();
      });
  });
  it('should return 400 - Create a parcel delivery order - The token you provided is invalid', (done) => {
    chai.request(app).post('/api/v1/parcels/').set('x-access-token', `${invalidToken}`)
      .send(newParcel)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('message').eql('The token you provided is invalid');
        done();
      });
  });
  it('should return 400 - Weight must be a number and greater than zero', (done) => {
    const parcels = { weight: -4 };
    chai.request(app).post('/api/v1/parcels/').set('x-access-token', token)
      .send(parcels)
      .end((err, res) => {
        res.body.should.have.property('status').equal(400);
        done();
      });
  });
  it('should return 400 - location, destination, presentation location must be greater than 3 digits and phone number greater than 9', (done) => {
    const parcels = {
      weight: 8, location: 'NG', presentLocation: 'Ikeja', destination: 'Ajah', receiverPhone: '9037845663',
    };
    chai.request(app).post('/api/v1/parcels/').set('x-access-token', token)
      .send(parcels)
      .end((err, res) => {
        res.body.should.have.property('message').eql('location, destination, presentation location must be greater than 3 digits and phone number greater than 9');
        res.should.have.status(400);
        done();
      });
  });
  it('should return 400 - location, destination, presentation location, phone must be strings', (done) => {
    const parcels = {
      weight: 8, location: 5, presentLocation: 'Ikeja', destination: 'Ajah', receiverPhone: '9037845663',
    };
    chai.request(app).post('/api/v1/parcels/').set('x-access-token', token)
      .send(parcels)
      .end((err, res) => {
        res.body.should.have.property('message').eql('location, destination, presentation location, phone must be strings');
        res.should.have.status(400);
        done();
      });
  });
});

// describe('Forbidden', () => {
//   it.skip('should return 403 - Forbidden', (done) => {
//     chai.request(app).put(`/api/v1/parcels/${invalidParcel}/presentLocation`)
//       .set('x-access-token', token)
//       .send({ presentLocation: 'Mombasa' })
//       .end((err, res) => {
//         console.log(res.body);
//         res.body.should.have.status(403);
//         done();
//       });
//   });
//   // from status
//   it.skip('should return 403 - Forbidden', (done) => {
//     chai.request(app).put(`/api/v1/parcels/${invalidParcel}/status`)
//       .set('x-access-token', token).send({ status: 'IN_TRANSIT' })
//       .end((err, res) => {
//         console.log(res.body);
//         res.body.should.have.status(403);
//         done();
//       });
//   });
// });
// admin
describe('GET /api/v1/users', () => {
  it('should return 200 - Change User Role', (done) => {
    chai.request(app).put(`/api/v1/users/${userid}/update`)
      .set('x-access-token', token)
      .send({ userRole: 'ADMIN' })
      .end((err, res) => {
        res.body.should.have.status(200);
        done();
      });
  });
  // update user require admin
  it('should return 400 - update', (done) => {
    chai.request(app).put(`/api/v1/users/${userid}/update`)
      .set('x-access-token', token)
      .send({ userRole: '' })
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });
});
describe('GET /api/v1/parcels/:parcel', () => {
  it('should return 400 - Fetch all parcel delivery orders', (done) => {
    chai.request(app).get(`/api/v1/parcels/${invalidParcel}`).set('x-access-token', token).end((err, res) => {
      res.body.should.have.property('message').eql('Invalid Id');
      done();
    });
  });
  // require admin
  it('should return 200 - Fetch all parcel delivery orders', (done) => {
    chai.request(app).get('/api/v1/parcels').set('x-access-token', token)
      .end((err, res) => {
        res.body.should.have.property('message');
        res.body.should.have.status(200);
        validParcelId = res.body.data[0].id;
        done();
      });
  });
});


describe('PUT /api/v1/parcels/:parcelId/destination', () => {
  it('should return 200 - Change the destination of a specific parcel delivery order', (done) => {
    chai.request(app).put(`/api/v1/parcels/${validParcelId}/destination`).set('x-access-token', token)
      .send({ destination: 'Onitsha' })
      .end((err, res) => {
        res.body.should.have.status(200);
        done();
      });
  });
  it('should return 400 - Change the distination of a specific parcel delivery order', (done) => {
    chai.request(app).put(`/api/v1/parcels/${correctParcelIdFormat}/destination`).set('x-access-token', token)
      .send({ destination: 'Kano' })
      .end((err, res) => {
        res.body.should.have.property('message');
        res.body.should.have.status(404);
        done();
      });
  });
});
describe('PUT /api/v1/parcels/:parcelId/cancel', () => {
  it('should return 200 - Cancel the specific parcel delivery order', (done) => {
    chai.request(app).put(`/api/v1/parcels/${validParcelId}/cancel`)
      .set('x-access-token', token).end((err, res) => {
        res.body.data.should.have.property('status').eql('CANCELLED');
        res.body.should.have.status(200);
        done();
      });
  });
  it('should return 404 - Parcel not found', (done) => {
    chai.request(app).put(`/api/v1/parcels/${correctParcelIdFormat}/cancel`)
      .set('x-access-token', token).end((err, res) => {
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.should.have.status(404);
        done();
      });
  });
  it('should return 400 - The parcel has been delived or concelled already, Cancel denied!', (done) => {
    chai.request(app).put(`/api/v1/parcels/${validParcelId}/cancel`)
      .set('x-access-token', token).end((err, res) => {
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.should.have.status(400);
        done();
      });
  });
});

describe('GET /users/<userId>/parcels', () => {
  it('should return 200 - Fetch all parcel delivery orders by a specific user', (done) => {
    chai.request(app).get(`/api/v1/users/${userid}/parcels`).set('x-access-token', token).end((err, res) => {
      res.body.should.have.status(200);
      res.body.should.have.property('message').eql('Success');
      done();
    });
  });
});
describe('PUT /api/v1/parcels/:parcelId/presentLocation', () => {
  it('should return 200 - Authorized', (done) => {
    chai.request(app).put(`/api/v1/parcels/${validParcelId}/presentLocation`)
      .set('x-access-token', token)
      .send({ presentLocation: 'Ajah' })
      .end((err, res) => {
        res.body.should.have.status(200);
        done();
      });
  });
  // from status
  it('should return 200 - Authorized from status', (done) => {
    chai.request(app).put(`/api/v1/parcels/${validParcelId}/status`)
      .set('x-access-token', token).send({ status: 'IN_TRANSIT' })
      .end((err, res) => {
        res.body.should.have.status(200);
        done();
      });
  });
  it('should return 400 - Change the present location of a specific parcel delivery order', (done) => {
    chai.request(app).put(`/api/v1/parcels/${correctParcelIdFormat}/presentLocation`)
      .set('x-access-token', token)
      .send({ presentLocation: 'Oshodi' })
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.should.have.status(404);
        done();
      });
  });
  // pass
  it('should return 200 - Status changed Successfully ', (done) => {
    chai.request(app).put(`/api/v1/parcels/${validParcelId}/status`)
      .set('x-access-token', token).send({ status: 'IN_TRANSIT' })
      .end((err, res) => {
        res.body.should.have.status(200);
        done();
      });
  });
});

describe('PUT /api/v1/parcels/:parcelId/status', () => {
  it('should return 400 - Change the status of a specific parcel delivery order', (done) => {
    chai.request(app).put(`/api/v1/parcels/${correctParcelIdFormat}/status`)
      .set('x-access-token', token).send({ status: 'ARRIVED' })
      .end((err, res) => {
        res.body.should.have.property('message');
        res.body.should.have.status(404);
        done();
      });
  });
});
describe('GET /api/v1/users', () => {
  it('should return 200 - Fetch all users', (done) => {
    chai.request(app).get('/api/v1/users')
      .set('x-access-token', token)
      .end((err, res) => {
        res.body.should.have.status(200);
        done();
      });
  });
});