import chai from 'chai'; // Importing the 'chai' assertion library
import chaiHttp from 'chai-http'; // Importing 'chai-http' for making HTTP requests for testing
import { after } from 'mocha'; // Importing 'after' from Mocha for running cleanup after tests
import app from '../server.js'; // Importing the Express application

chai.use(chaiHttp);
let token = '';

// Test cases for user authentication routes
describe('POST /api/v1/auth/signup', () => {
  // Test case for successful user login
  it('should return 200 - Success', (done) => {
    chai.request(app).post('/api/v1/auth/login').send({ email: 'errandhub21@gmail.com', password: '123' })
      .end((err, res) => {
        res.body.should.have.status(200); // Checking if the response status code is 200
        token = res.body.token; // Saving the authentication token for later use
        done();
      });
  });
  
  // Test case for incorrect credentials during login
  it('should return 400 - The credentials you provided is incorrect', (done) => {
    chai.request(app).post('/api/v1/auth/login').send({ email: 'errandhub21@gmail.com', password: '123revc' })
      .end((err, res) => {
        res.body.should.have.status(400); // Checking if the response status code is 400
        res.body.should.have.property('message').equal('The credentials you provided is incorrect'); // Checking the error message
        done();
      });
  });
  
  // Test case for missing email and password during signup
  it('should return 400 - Email and Password are required', (done) => {
    const newUser = {
      email: '',
      firstName: 'admin',
      lastName: 'admin',
      password: '123',
      username: '',
    };
    chai.request(app).post('/api/v1/auth/signup').send(newUser)
      .end((err, res) => {
        res.body.should.have.status(400); // Checking if the response status code is 400
        res.body.should.have.property('message').equal('Email and Password are required'); // Checking the error message
        done();
      });
  });
  
  // Test case for checking unique user during signup
  it('should return 409 - Check Unique', (done) => {
    const newUser = {
      email: 'errandhub21@gmail.com',
      firstName: 'admin',
      lastName: 'admin',
      password: '123',
      username: 'admin',
    };
    chai.request(app).post('/api/v1/auth/signup').set('x-access-token', token).send(newUser)
      .end((err, res) => {
        res.body.should.have.property('message'); // Checking if the response contains a message property
        res.body.should.have.status(409); // Checking if the response status code is 409
        done();
      });
  });
});

// Cleanup after tests
after('should return 204 - User found', (done) => {
  chai.request(app).delete('/api/v1/users/delete').set('x-access-token', token)
    .end((err, res) => {
      chai.expect(res.statusCode).to.be.equal(204); // Checking if the response status code is 204
      done();
    });
});