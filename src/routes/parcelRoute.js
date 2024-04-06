const express = require('express');
const parcelRoute = express.Router(); // Create a new router instance

// Import necessary controllers and middleware
const ParcelController = require('../controller/ParcelController.js');
const Helper = require('../controller/HelperController.js');
const Auth = require('../middleware/Authentication.js');

// Define routes
parcelRoute.route('/:parcelId/presentLocation')
  .put(Helper.validatePresentLocation, Auth.secureRoute, ParcelController.changePresentLocation.bind(ParcelController));

parcelRoute.route('/:parcelId/status')
  .put(Helper.validateStatus, Auth.secureRoute, ParcelController.changeStatus.bind(ParcelController));

module.exports = parcelRoute;
