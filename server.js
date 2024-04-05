const express = require ('express');
const parcelRoute = require('./src/routes/parcelRoute');

import dotenv from 'dotenv';
import cors from 'cors';
import YAML from 'yamljs';
import swaggerDocs from 'swagger-ui-express';
import parcelRouter from './src/routes/parcelRoute.js';
import authRouter from './src/routes/authRoute.js';
import userRouter from './src/routes/userRoute.js';
import Auth from './src/middleware/Authentication.js';


dotenv.config();
const app = express();
const port = process.env.PORT || 5432;

const swaggerDocument = YAML.load('api-docs.yml');

app.use(express.json());
app.use(cors());
app.get('/', (req, res) => res.status(200).send({ message: 'Welcome to home Errand-Hub API ', status: 200 }));

app.use('/docs', swaggerDocs.serve, swaggerDocs.setup(swaggerDocument));

app.use('/api/v1/parcels', Auth.verifyToken, parcelRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', Auth.verifyToken, userRouter);


// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Errand-Hub app listening on port ${port}!`));

export default app;