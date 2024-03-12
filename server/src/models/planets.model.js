// distructuring the parse function of the csv-parse
const { parse } = require('csv-parse');
const fs = require('fs');

const planets = require('./planets.mongo')

const habitablePlanets = [];

function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED' &&
        planet['koi_insol'] <= 1.11 &&
        planet['koi_insol'] >= 0.36 &&
        planet['koi_prad'] <= 1.6;
}

// The stream will execute once the planets.model is required.
// Since the stream takes time to parse the csv. there is a need to wait for the code to end,
// otherwise the app will get partial data.
// This is done with a Promise. 

async function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream('./data/kepler_data.csv')
            .pipe(parse({
                comment: '#',
                columns: true,
            }))
            .on('data', async (data) => {
                if (isHabitablePlanet(data)) {
                    //habitablePlanets.push(data); - // old array Push - replaced by MongoDB
                    await savePlanet(data);
                }
            })
            .on('error', (err) => {
                console.log(err);
                reject(err);
            })
            .on('end', async () => {
                const countPlanetsFound = (await getAllPlanets()).length;
                console.log(`Done reading ${countPlanetsFound} habitable planets from the file!`);
                resolve();
            });
    });
}

async function savePlanet(planet) {
    // upsert = updates + insert
    try {
        await planets.updateOne({
            kepler_name: planet.kepler_name,
        }, {
            kepler_name: planet.kepler_name,
        }, {
            upsert: true,
        });
    } catch (err) {
        console.error(`Could not save planet: ${err}`);
    }
}


async function getAllPlanets() {
    // exclusion of data can be done in one of the following methods - both yields the same result
    // return await planets.find({},'kepler_name -_id');
    return await planets.find({}, {
        '_id': 0,
        '__v': 0,
    });
}


module.exports = {
    loadPlanetsData,
    getAllPlanets,
    planets: habitablePlanets,
}
