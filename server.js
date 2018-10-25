const http = require('http');

const express = require('express');
const bodyParser = require('body-parser');

// create express app
const app = express();
const server = http.createServer(app);

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// for debugging purpose, true to print query being executed, false otherwise
mongoose.set('debug', true);

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useCreateIndex: true,
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to LPUG Attendance System"});
});

require('./app/routes/course.routes.js')(app);
require('./app/routes/activity.routes.js')(app);
require('./app/routes/employee.routes.js')(app);
require('./app/routes/activity_officer.routes.js')(app);

// listen for requests
// app.listen(3000, () => {
//     console.log("Server is listening on port 3000");
// });

// listen for requests
server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
