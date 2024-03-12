const express = require('express');
const path = require('path');
const defaultRouter = express.Router();
defaultRouter.get('/*', (req,res)=>{ 
    res.sendFile(path.join(__dirname,"..", "..", 'public', 'index.html'));
});
module.exports= defaultRouter;