const jwt = require('jsonwebtoken');
const db = require('../db');

const Auth = {
  async verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(400).send({ message: 'Token is not provided' });
    }
    try {
      const decoded = await jwt.verify(token, process.env.SECRET);
      const text = 'SELECT * FROM users WHERE id = $1';
      const { rows } = await db.query(text, [decoded.userId]);

      if (!rows[0]) {
        return res.status(400).send({ message: 'The token you provided is invalid' });
      }
      req.user = { id: decoded.userId };
      next();
    } catch (error) {
      return res.status(400).send(error);
    }
  },
  async secureRoute(req, res, next) {
    try {
      const text = 'SELECT * FROM users WHERE id = $1';
      const { rows } = await db.query(text, [req.user.id]);
      if (rows[0].user_role !== 'ADMIN') {
        return res.status(403).send({ message: 'Forbidden', status: 403 });
      }
      next();
    } catch (error) {
      return res.status(400).send({ message: error });
    }
  },
};

module.exports = Auth;
