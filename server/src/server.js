// a more scalable way of implementing server using the built in HTTP and Express
// this will allow the use of other protocols other than http (e.g. Web Sockets).
// Note: we've added app.js.
const http = require('http');
const app = require('./app');
require('dotenv').config();
const { mongoConnect } = require('./services/mongo');
const { loadPlanetsData } = require('./models/planets.model');
const server = http.createServer(app);
// port can be set in the .env file after installing Dotenv package 
// unless stated otherwise - set the prot to 8000;
const PORT = process.env.PORT || 8000;

console.log(`Environment port for server is set to: ${process.env.PORT}`);
async function startServer() {
    //connecting to MongoDB
    await mongoConnect();
    await loadPlanetsData();
    
    server.listen(PORT, () => {
        console.log(`Listenning on port ${PORT}...`);
    })
    console.log(PORT);
}

startServer();