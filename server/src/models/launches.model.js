const launchesDatabase = require('./launches.mongo');
const planetsDatabase = require('./planets.mongo');
const DEFAULT_FLIGHT_NUMBER = 9000;

// var launches = new Map();
let latestFlightNumber = 100;

async function saveLaunch(launch) {
    // const planet = await planetsDatabase.updateOne({ // - includes the $setOnInsert property
    await launchesDatabase.findOneAndUpdate({ // - will do the same without including $setOnInsert
        flightNumber: launch.flightNumber,
    }, launch, {
        upsert: true,
    })
}
async function existsLaunchWithId(launchId) {
    //return launches.has(launchId);
    return await launchesDatabase.findOne({
        flightNumber: launchId,
    });
}

async function addNewLaunch(scheduledLaunch) {

    console.log('Verifying planet...');
    const planet = await planetsDatabase.findOne({
        kepler_name: scheduledLaunch.target,
    });
    console.log(planet);
    if (!planet) {
        throw new Error('Planet not found!');
    } else {
        await addNewLaunchWithParam(scheduledLaunch, false);
    }
}

async function addNewLaunchWithParam(scheduledLaunch, isExternalLaunch) {
    try {
        var newFlightNumber = scheduledLaunch.flightNumber;
        if (!isExternalLaunch) {
            newFlightNumber = await getLatestFlightNumber() + 1;
            console.log(`New flight number is ${newFlightNumber}.`)
        }
        console.log(scheduledLaunch);

        const newLaunch = await Object.assign(scheduledLaunch, {
            flightNumber: newFlightNumber,
            customers: scheduledLaunch.customers,
            upcoming: scheduledLaunch.upcoming,
            success: scheduledLaunch.success,
            isExternalLaunch, // short for 'isExternalLaunch: isExternalLaunch'
        });
        console.log(scheduledLaunch);
        await saveLaunch(newLaunch);
    } catch (err) {
        console.error(err);
    }
}
// function addNewLaunch(launch) {

//     latestFlightNumber++;
//     launches.set(latestFlightNumber, Object.assign(launch, {
//         flightNumber: latestFlightNumber,
//         customers: ['NASA', 'SpaceX'],
//         upcoming: true,
//         success: true,
//     }));
// }
async function getLatestFlightNumber() {
    const latestLaunch = await launchesDatabase
        .findOne({ isExternalLaunch: false })
        //sorts descending
        .sort('-flightNumber');
    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }

    return latestLaunch.flightNumber;
}
async function getAllLaunches(query) {
    //return Array.from(launches.values());

    if (query.pageSize) {
        console.log(`Fetching ${query.pageSize} launches-`);
        if (query.pageNumber)
            console.log(`from page ${query.pageNumber}...`);
    } else {
        console.log('Fetching all launches...');
    }

    return await launchesDatabase.find({},
        {
            '_id': 0,
            '__v': 0,
        })
        .sort({ flightNumber: 1 })
        .limit(Math.abs(query['pageSize'])) // is limit is zero, all data returns
        .skip(Math.abs((query['pageNumber'] - 1) * query['pageSize']));

}
async function abortLaunch(abortedFlightNumber) {
    const abortedLaunch = await launchesDatabase.updateOne({
        flightNumber: abortedFlightNumber
    }, {
        upcoming: false,
        success: false,
    })
    return abortedLaunch.modifiedCount === 1;
    // const aborted = launches.get(launchId);
    // aborted.upcoming = false;
    // aborted.success = false;
    // return aborted;
}
async function getLatestExternalLaunch() {
    const latestLaunch = await launchesDatabase
        .findOne({ isExternalLaunch: true })
        //sorts descending
        .sort('-launchDate');
    return latestLaunch;
}

module.exports = {
    existsLaunchWithId,
    getAllLaunches,
    addNewLaunch,
    abortLaunch,
    getLatestExternalLaunch,
    addNewLaunchWithParam,
}