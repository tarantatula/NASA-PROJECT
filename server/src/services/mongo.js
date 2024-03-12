require('dotenv').config();
const mongoose = require('mongoose');
const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready!');
});
mongoose.connection.on('error', () => {
    console.error('MongoDB error!');
});

async function mongoConnect() {
    //connecting to MongoDB
    await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect(){
    await mongoose.disconnect();
}

module.exports = { mongoConnect, mongoDisconnect };