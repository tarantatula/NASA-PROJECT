const express = require('express');

const planetsRouter = require('./planets/planets.router');
const launchesRouter = require('./launches/launches.router');

const api = express.Router();
const apiRoot = '/v1';
api.use(apiRoot, planetsRouter);
api.use(apiRoot, launchesRouter);

module.exports = api;