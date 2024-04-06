const express = require('express');
const ParcelController = require('../controller/ParcelController.js');
const UserControllers = require('../controller/UserController.js');
const Helper = require('../controller/HelperController.js');
const Auth = require('../middleware/Authentication.js');

const userRoute = express.Router();

userRoute.route('/')
  .get(UserControllers.allUsers);

userRoute.route('/delete')
  .delete(UserControllers.delete);

userRoute.route('/:userId')
  .get(UserControllers.userById);

userRoute.route('/:userId/parcels')
  .get(ParcelController.parcelByUser);

userRoute.route('/:userId/update')
  .put(Auth.secureRoute, Helper.validateUserRole, UserControllers.updateUser);

module.exports = userRoute;
