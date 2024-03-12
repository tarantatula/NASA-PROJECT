const express = require('express');
const { httpGetAllPlanets, } = require('./planets.controller');

const planetsRouter = express.Router();
// the '/planets' route can be dropped to '/' since it was prefixed in the app module
// planetsRouter.get('/planets', httpGetAllPlanets);
planetsRouter.get('/planets', httpGetAllPlanets);
module.exports = planetsRouter;