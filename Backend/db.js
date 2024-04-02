// db.js
const mongoose = require('mongoose');  // Importing mongoose library

mongoose.connect('mongodb://localhost:27017/errand-cluster', {   // Connecting to MongoDB
  useNewUrlParser: true,   // Option to use new URL parser
  useUnifiedTopology: true,  // Option to use new Server Discover and Monitoring engine
})
.then(() => console.log('MongoDB connected')) // If connection is successful, log to console 
.catch(err => console.log(err));  // If connection fails, log error to console

module.exports = mongoose;  // Exporting mongoose object
