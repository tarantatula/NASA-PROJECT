const express = require('express');
const path = require('path');
const rootRouter = express.Router();
rootRouter.use(express.static(path.join(__dirname,'..','..','public'))) // this will serve the whole public folder and by default root will send index.html
module.exports= rootRouter;