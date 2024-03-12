const SPACEX_LAUNCHES_API_URL = "https://api.spacexdata.com/v5";
const axios = require('axios');

// using built in fetch
async function httpGetAllLaunches_OLD(dateFilter) {
    console.log("Loading launches data from SpaceX API...");
    try {
        const response = await fetch(`${SPACEX_LAUNCHES_API_URL}/launches/query`,
            {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(getQuery(dateFilter)),
            });

        const data = await response.json();
        if (data.docs.length > 0)
            console.log(`${data.docs.length} new SpaceX launches found`);
        return data;

    } catch (err) {
        throw err;
    }
}

// using axios package
async function httpGetAllLaunches_NEW(dateFilter) {
    const response = await axios.post(`${SPACEX_LAUNCHES_API_URL}/launches/query`, getQuery(dateFilter));
    return response.data;
}

function getQuery(dateFilter) {
    const queryPayload = {
        query: {
        },
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        customers: 1
                    }
                }
            ]
        }
    };

    if (dateFilter) {
        queryPayload.query = {
            date_local: {
                $gte: dateFilter
            }
        };
    }

    return queryPayload;
}


module.exports = httpGetAllLaunches;