const chai = require('chai'); // Importing the 'chai' assertion library
const chaiHttp = require('chai-http'); // Importing 'chai-http' for making HTTP requests for testing
const app = require('../server.js'); // Importing the Express application

chai.use(chaiHttp);

// Test case for checking the root endpoint
describe('GET /', () => {
  it('should return 200(success) status', (done) => {
    chai.request(app).get('/') // Making a GET request to the root endpoint '/'
      .end((err, res) => {
        chai.expect(res.statusCode).to.be.equal(200); // Checking if the status code of the response is 200 (success)
        done();
      });
  });
});