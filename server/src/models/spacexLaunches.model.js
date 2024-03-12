const httpGetAllLaunches = require('./s_spacex.api');

function convertSpacexLaunches(spacexLaunches) {
    const launches = [];
    spacexLaunches.docs.forEach(spacexLaunch => {
        // long way:
        // const customers = [];
        // spacexLaunch.payloads.forEach(payload => {
        //     customers.push(payload.customers);
        // });
        // short way - will join arrays and flatten:
        const customers = /*another way of addressing a property within an object*/spacexLaunch['payloads'].flatMap((payload) => {
            return payload['customers'];
        })


        launches.push({
            flightNumber: spacexLaunch.flight_number,
            customers,
            launchDate: new Date(spacexLaunch.date_local),
            mission: spacexLaunch.name,
            rocket: spacexLaunch.rocket.name,
            success: spacexLaunch.success,
            target: 'SpaceX_Unknown',
            upcoming: spacexLaunch.upcoming
        });
    });
    return launches;
}

async function loadSpacexLanchData(dateFilter) {
    var spacexLaunches = await httpGetAllLaunches(dateFilter);
    return convertSpacexLaunches(spacexLaunches);
}

module.exports = loadSpacexLanchData;