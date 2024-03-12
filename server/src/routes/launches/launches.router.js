const express = require('express');
const { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch } = require('./launches.controller');

const launchesRouter = express.Router();
// the '/launches' route can be dropped to '/' since it was prefixed in the app module
// launchesRouter.get('/', httpGetAllLaunches);
// launchesRouter.post('/', httpAddNewLauch);
launchesRouter.get('/launches', httpGetAllLaunches);
launchesRouter.post('/launches', httpAddNewLaunch);
launchesRouter.delete('/launches/:id', httpAbortLaunch);
module.exports = launchesRouter;