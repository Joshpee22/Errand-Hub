<<<<<<< HEAD
// Import necessary libraries and modules
import moment from 'moment'; // Library for handling dates and time
import uuidv4 from 'uuid/v4'; // Function to generate unique identifiers
import db from '../db'; // Database connection module
import Parcel from '../model/parcel'; // Model for parcel data structure
import mailSender from '../middleware/MailSender'; // Middleware for sending emails

// Define parcel status constants
=======
import moment from 'moment';
import uuidv4 from 'uuid/v4';
import db from '../db';
import Parcel from '../model/parcel.js';
import mailSender from '../middleware/MailSender.js';

>>>>>>> e568c8643f8373c57f10f6a8820fd291310c9731
const parcelStatus = {
  PENDING: 'PENDING',
  IN_TRANSIT: 'IN_TRANSIT',
  ARRIVED: 'ARRIVED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
};

<<<<<<< HEAD
// Define SQL queries for parcel operations
=======
>>>>>>> e568c8643f8373c57f10f6a8820fd291310c9731
const createParcelQuery = `INSERT INTO
      parcels(id, location, destination ,present_location, weight, owner_id, receiver_phone, status, created_date, modified_date)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      returning *`;

const findOneQuery = 'SELECT * FROM parcels WHERE id = $1 AND owner_id = $2';
const findOneQueryAdmin = 'SELECT * FROM parcels WHERE id = $1';
const findOneQueryUser = 'SELECT * FROM parcels WHERE id = $1 AND owner_id = $2';
const updateStatuQuery = `UPDATE parcels
SET status=$1,modified_date=$2
WHERE id=$3 returning *`;

const cancelQuery = `UPDATE parcels
SET status=$1,modified_date=$2
WHERE id=$3 AND owner_id = $4 returning *`;

const updatePresentLocationQuery = `UPDATE parcels
SET present_location=$1,modified_date=$2
WHERE id=$3 returning *`;

const updateDestinationQuery = `UPDATE parcels
SET destination=$1,modified_date=$2
WHERE id=$3 AND owner_id = $4 returning *`;

const getUserQuery = 'SELECT * FROM users WHERE id = $1';

<<<<<<< HEAD
// Define an object called "Parcels" with functions for parcel management
=======
>>>>>>> e568c8643f8373c57f10f6a8820fd291310c9731
const Parcels = {
  async create(req, res) {
    const {
      location, destination, presentLocation, weight, receiverPhone,
    } = req.body;

<<<<<<< HEAD
    // Create a new parcel object with extracted information
=======
>>>>>>> e568c8643f8373c57f10f6a8820fd291310c9731
    const newParcel = new Parcel(uuidv4(), location, destination, presentLocation, weight,
      req.user.id, receiverPhone, parcelStatus.PENDING, moment(new Date()), moment(new Date()));

    try {
      const { rowCount, rows } = await db.query(createParcelQuery, Object.values(newParcel));
      return res.status(201).send({
        message: 'Parcel Created Successfully', status: 201, rowCount, data: rows[0],
      });
    } catch (error) {
      return res.status(400).send({ message: error, status: 400 });
    }
  },
  // Fetch all parcel delivery orders
  async getAll(req, res) {
    const findAllQuery = 'SELECT * FROM parcels';
    try {
      const { rows, rowCount } = await db.query(findAllQuery);
      return res.status(200).send({
        message: 'Success', status: 200, rowCount, data: rows,
      });
    } catch (error) {
      return res.status(400).send({
        message: error, status: 400,
      });
    }
  },
  // Fetch all parcel delivery orders by a specific user
  async parcelByUser(req, res) {
    const parcelByUserQuery = 'SELECT * FROM parcels WHERE owner_id = $1';

    try {
      const { rows, rowCount } = await db.query(parcelByUserQuery, [req.user.id]);
      return res.status(200).send({
        message: 'Success', status: 200, rowCount, data: rows,
      });
    } catch (error) {
      return res.status(400).send({
        message: error, status: 400,
      });
    }
  },
  // Fetch a specific parcel delivery order
  async getOne(req, res) {
    try {
      const { rows, rowCount } = await db.query(findOneQuery, [req.params.parcelId, req.user.id]);
      if (!rows[0]) {
        return res.status(400).send({ message: 'parcels not found', status: 400 });
      }
      return res.status(200).send({
        message: 'Success', status: 200, rowCount, data: rows[0],
      });
    } catch (error) {
      if (error.routine === 'string_to_uuid') {
        return res.status(200).send({
          message: 'Invalid Id', status: 400,
        });
      }
      return res.status(400).send({
        message: error, status: 400,
      });
    }
  },
  // Fetch a specific parcel delivery order
  async getOneAdmin(req, res) {
    try {
      const { rows, rowCount } = await db.query(findOneQueryAdmin, [req.params.parcelId]);
      if (!rows[0]) {
        return res.status(400).send({ message: 'parcels not found', status: 400 });
      }
      return res.status(200).send({
        message: 'Success', status: 200, rowCount, data: rows[0],
      });
    } catch (error) {
      if (error.routine === 'string_to_uuid') {
        return res.status(200).send({
          message: 'Invalid Id', status: 400,
        });
      }
      return res.status(400).send({
        message: error, status: 400,
      });
    }
  },
  // Cancel the specific parcel delivery order
  async cancel(req, res) {
    try {
      const { rows } = await db.query(findOneQueryUser, [req.params.parcelId, req.user.id]);
      if (rows[0]) {
        if (rows[0].status === parcelStatus.ARRIVED
          || rows[0].status === parcelStatus.DELIVERED
          || rows[0].status === parcelStatus.CANCELLED) {
          return res.status(400).send({ message: 'Ooops, The parcel has been delived or cancelled already, Cancel denied!', status: 400 });
        }
      }
      if (!rows[0]) {
        return res.status(404).send({ message: 'parcel not found', status: 404 });
      }
      const updateValues = [
        parcelStatus.CANCELLED,
        moment(new Date()),
        rows[0].id,
        req.user.id,
      ];
      const response = await db.query(cancelQuery, updateValues);
      return res.status(200).send({
        message: 'Parcel has been cancelled', status: 200, data: response.rows[0],
      });
    } catch (err) {
      if (err.routine === 'string_to_uuid') {
        return res.status(400).send({
          message: 'Invalid Id', status: 400,
        });
      }
      return res.status(400).send(err);
    }
  },
  // Change the present location of a specific parcel delivery order
  async ChangePresentLocation(req, res) {
    try {
      const { rows } = await db.query(findOneQueryAdmin, [req.params.parcelId]);
      if (!rows[0]) {
        return res.status(404).send({ message: 'Parcel not found', status: 404 });
      }
      const updateValues = [
        req.body.presentLocation,
        moment(new Date()),
        rows[0].id,
      ];
      const response = await db.query(updatePresentLocationQuery, updateValues);
      return res.status(200).send({
        message: 'Present location Updated', status: 200, data: response.rows[0],
      });
    } catch (err) {
      if (err.routine === 'string_to_uuid') {
        return res.status(400).send({
          message: 'Invalid Id', status: 400,
        });
      }
      return res.status(400).send(err);
    }
  },
  async changeDestination(req, res) {
    try {
      const { rows } = await db.query(findOneQuery, [req.params.parcelId, req.user.id]);
      if (!rows[0]) {
        return res.status(404).send({ message: 'Parcel not found', status: 404 });
      }
      if (rows[0].status === parcelStatus.ARRIVED
        || rows[0].status === parcelStatus.DELIVERED
        || rows[0].status === parcelStatus.CANCELLED) {
        return res.status(202).send({ message: 'Change destination failed, Parcel has been arrived, delivered or cancelled', status: 202 });
      }
      const updateValues = [
        req.body.destination,
        moment(new Date()),
        rows[0].id,
        req.user.id,
      ];
      const response = await db.query(updateDestinationQuery, updateValues);
      return res.status(200).send({
        message: 'Destination of Parcel has been changed', status: 200, data: response.rows[0],
      });
    } catch (err) {
      return res.status(400).send(err);
    }
  },
  async changeStatus(req, res) {
    try {
      const { rows } = await db.query(findOneQueryAdmin, [req.params.parcelId]);
      if (!rows[0]) {
        return res.status(404).send({ message: 'Parcel not found', status: 404 });
      }
      const updateValues = [
        req.body.status,
        moment(new Date()),
        rows[0].id,
      ];
      const response = await db.query(updateStatuQuery, updateValues);
      // fetch user
      const userResponse = await db.query(getUserQuery, [response.rows[0].owner_id]);

      if (response.rows[0].status === parcelStatus.ARRIVED
        || response.rows[0].status === parcelStatus.DELIVERED
        || response.rows[0].status === parcelStatus.CANCELLED) {
        return res.status(202).send({ message: 'Change status failed, Parcel has been arrived, delivered or cancelled ', status: 202 });
      }
      // send email
      mailSender.newUserEmail(
        userResponse.rows[0].email,
        userResponse.rows[0].first_name,
        userResponse.rows[0].last_name,
        response.rows[0].status,
        response.rows[0].present_location,
      );
      return res.status(200).send({
        message: 'Parcel Status Updated', status: 200, data: response.rows[0],
      });
    } catch (err) {
      return res.status(400).send(err);
    }
  },
};

export default Parcels;