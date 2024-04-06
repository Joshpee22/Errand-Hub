const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const parcelRouter = require('./src/routes/parcelRoute.js');
const authRouter = require('./src/routes/authRoute.js');
const userRouter = require('./src/routes/userRoute.js');
const Auth = require('./src/middleware/Authentication.js');
const db = require('./src/db/db.js'); // Import your database connection setup

dotenv.config();
const app = express();
const port = process.env.PORT || 5432;

const swaggerDocument = YAML.load('api-docs.yml');

app.use(express.json());
app.use(cors());
app.get('/', (req, res) => res.status(200).send({ message: 'Welcome to home Errand-Hub API ', status: 200 }));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/v1/parcels', Auth.verifyToken, parcelRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', Auth.verifyToken, userRouter);

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to PostgreSQL database:', err);
  } else {
    console.log('Connected to PostgreSQL database!');
    // Start the server after successfully connecting to the database
    app.listen(port, () => console.log(`Errand-Hub app listening on port ${port}!`));
  }
});

module.exports = app;
