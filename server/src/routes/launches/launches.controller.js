const { getAllLaunches, addNewLaunch, existsLaunchWithId, abortLaunch, getLatestExternalLaunch, addNewLaunchWithParam, } = require('../../models/launches.model')
const loadSpacexLanchData = require('../../models/spacexLaunches.model')
async function httpGetAllLaunches(req, res) {
    var query = await req.query;
    var latestExternal = await getLatestExternalLaunch();
    var dateFilter = null;
    var spacexLaunches = null;
    if (latestExternal) {
        console.log(latestExternal.launchDate);
        dateFilter = latestExternal;
    }
    spacexLaunches = await loadSpacexLanchData(dateFilter);
    if (spacexLaunches.length > 0) {
        console.log(`Saving ${spacexLaunches.length} SpaceX launches to DB.`)
        spacexLaunches.forEach(async (spacexLaunch) => {
            await addNewLaunchWithParam(spacexLaunch, true);
        });
    }
    var nasaLaunches = await getAllLaunches(query);
    return res.status(200).json(nasaLaunches);
}

async function httpAddNewLaunch(req, res) {
    const launch = req.body;
    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
        res.status(400).json({
            error: 'Missing required launch property'
        });
    }

    if (launch.customers) {
        launch.customers = ['NASA', 'SpaceX'];
    }

    launch.launchDate = new Date(launch.launchDate);
    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: 'Invalid launch date'
        });
    } try {
        await addNewLaunch(launch);
    }
    catch (err) {
        console.log(err);
        errorResponse = { error: err.toString() };
        return res.status(500).json(errorResponse);
    }
    return res.status(201).json(launch);
}

//  function httpAbortLaunch(req, res) {
//     const launchId = Number(req.params.id);
//     console.log (`Launch ID is ${launchId}`);
//     if (!existsModelWithId(launchId))
//         return res.status(404).json({
//             error: 'Launch not found',
//         });
//     const aborted = abortLaunch(launchId);
//     return res.status(200).json(aborted);
// }


async function httpAbortLaunch(req, res) {
    const launchId = Number(req.params.id);
    const existsLaunch = await existsLaunchWithId(launchId);

    if (!existsLaunch) {
        res.status(404).json(`{ error: 'launchId ${launchId} does not exist!' }`);
    }

    const abortedLaunch = await abortLaunch(launchId);
    if (!abortLaunch) {
        res.status(400).json(`{ error: 'Launch not aborted!' }`);
    } else {
        res.status(200).json(abortedLaunch);
    }
}



module.exports = { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch, };