// We're disabling a rule that makes sure we use the same style for returning values.
// This is just a way to make our code look nicer.
/* eslint-disable consistent-return */
// We're importing two special tools we'll use later: bcrypt and jwt.

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Helper = {
  isValidEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return true;
    }
    return false;
  },
  
  hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
  },

  comparePassword(hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword);
  },
  
  validateUserRole(req, res, next) {
    if (Helper.isValidatEmpty(req.body.userRole)) {
      return res.status(400).send({ message: 'User role is required', status: 400 });
    }
    next();
  },
  
  validateStatus(req, res, next) {
    if (Helper.isValidatEmpty(req.body.status)) {
      return res.status(400).send({ message: 'Status is required', status: 400 });
    }
    next();
  },
  
  validatePresentLocation(req, res, next) {
    if (Helper.isValidatEmpty(req.body.presentLocation)) {
      return res.status(400).send({ message: 'Present Location is required', status: 400 });
    }
    next();
  },
  
  userValidator(req, res, next) {
    if (Helper.isValidatEmpty(req.body.email, req.body.password)) {
      return res.status(400).send({ message: 'Email and Password are required', status: 400 });
    }
    if (!Helper.isValidEmail(req.body.email)) {
      return res.status(400).send({ message: 'Please enter a valid email address', status: 400 });
    }
    next();
  },
  
  parcelValidor(req, res, next) {
    const {
      location, destination, presentLocation, weight, receiverPhone,
    } = req.body;

    if (typeof weight !== 'number' || weight <= 0) {
      return res.status(400).send({
        message: 'Weight must be a number and greater than zero', status: 400,
      });
    }

    if (typeof location !== 'string' || typeof destination !== 'string'
    || typeof presentLocation !== 'string' || typeof receiverPhone !== 'string') {
      return res.status(400).send({
        message: 'location, destination, presentation location, phone must be strings', status: 400,
      });
    }

    if (location.length <= 3 || destination.length <= 3
    || presentLocation.length <= 3 || receiverPhone.length < 9) {
      return res.status(400).send({
        message: 'location, destination, presentation location must be greater than 3 digits and phone number greater than 9', status: 400,
      });
    }
    next();
  },
  
  isValidatEmpty(input) {
    if (!input) {
      return true;
    }
    return false;
  },
  
  generateToken(id) {
    const token = jwt.sign({
      userId: id,
    },
    process.env.SECRET, { expiresIn: '9d' });
    return token;
  },
};

module.exports = Helper;
