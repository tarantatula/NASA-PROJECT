// old approach with CSV
// const { planets } = require('../../models/planets.model');

// function httpGetAllPlanets(req, res) {
//     return res.status(200).json(planets);
// }

//  --  new approach with MongoDB

const { getAllPlanets } = require('../../models/planets.model');

async function httpGetAllPlanets(req, res) {
    return res.status(200).json(await getAllPlanets());
}


module.exports = {
    httpGetAllPlanets,
}
