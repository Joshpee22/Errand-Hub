const chai = require('chai');
const chaiHttp = require('chai-http');
const { afterEach } = require('mocha');
const app = require('../server.js');

chai.use(chaiHttp);
let token = '';

// Test cases for user authentication routes
describe('User Authentication', () => {
  describe('POST /api/v1/auth/signup', () => {
    it('should return 200 - Success', (done) => {
      // Test cases for successful user login
    });

    it('should return 400 - The credentials you provided is incorrect', (done) => {
      // Test case for incorrect credentials during login
    });

    it('should return 400 - Email and Password are required', (done) => {
      // Test case for missing email and password during signup
    });

    it('should return 409 - Check Unique', (done) => {
      // Test case for checking unique user during signup
    });
  });

  // Cleanup after tests
  afterEach('Cleanup', (done) => {
    chai.request(app).delete('/api/v1/users/delete').set('x-access-token', token)
      .end((err, res) => {
        chai.expect(res.statusCode).to.be.equal(204); // Checking if the response status code is 204
        done();
      });
  });
});
