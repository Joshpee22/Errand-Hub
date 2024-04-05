const express = require ('express'); // Importing the 'express' framework

import ParcelController from '../controller/ParcelController.js'; // Importing the parcel controller
import UserControllers from '../controller/UserController.js'; // Importing the user controller
import Helper from '../controller/HelperController.js'; // Importing the helper controller
import Auth from '../middleware/Authentication.js'; // Importing the authentication middleware

const userRoute = express.Router(); // Creating an instance of Express Router

userRoute.route('/')
  .get(UserControllers.allUsers); // Defining a GET route for retrieving all users and invoking allUsers function from UserController

userRoute.route('/delete')
  .delete(UserControllers.delete); // Defining a DELETE route for deleting a user and invoking delete function from UserController

userRoute.route('/:userId')
  .get(UserControllers.userById); // Defining a GET route for retrieving a user by ID and invoking userById function from UserController

userRoute.route('/:userId/parcels')
  .get(ParcelController.parcelByUser); // Defining a GET route for retrieving parcels associated with a user by user ID and invoking parcelByUser function from ParcelController

userRoute.route('/:userId/update')
  .put(Auth.secureRoute, Helper.validateUserRole, UserControllers.updateUser); // Defining a PUT route for updating user information by user ID, requiring authentication using secureRoute middleware from Authentication, validating user role using validateUserRole middleware from HelperController, and invoking updateUser function from UserController

export default userRoute; // Exporting the user routes