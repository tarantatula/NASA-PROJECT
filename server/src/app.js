const path = require('path');
const morgan = require('morgan');
const express = require('express');
const cors = require('cors');

const app = express();
// const planetsRouter = require('./routes/planets/planets.router');
// const launchesRouter = require('./routes/launches/launches.router');
const apiV1Router = require('./routes/api.v1');
const defaultRouter = require('./routes/default.router');
const rootRouter = require('./routes/root.router');


// single origin CORS
//app.use(cors({origin:'http://localhost:3000'}));

//multiple domains CORS
var allowedDomains = ['http://localhost:3000','http://localhost:5000', 'http://localhost:8000'];
app.use(cors({
  origin: function (origin, callback) {
    // bypass the requests with no origin (like curl requests, mobile apps, etc )
    if (!origin) return callback(null, true);
    if (allowedDomains.indexOf(origin) === -1) {
      var msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));
// adds logging ability from the Morgan external middleware
app.use(morgan('combined'));

app.use(express.json()); // built in middleware to parse Json from requests
//app.use(express.static(path.join(__dirname,'..','public')));// this will serve the whole public folder and by default root will send index.html

app.use(rootRouter)
// sets the initial route for each router, so the router module will not have to be explicit for all routes
//app.use(planetsRouter);
// app.use(launchesRouter);
app.use(apiV1Router);
app.use(defaultRouter);
module.exports = app;