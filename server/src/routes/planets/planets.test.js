const request = require('supertest');
const app = require('../../app');
const { loadPlanetsData } = require('../../models/planets.model'); // Replace 'yourModule' with the actual module path
const { mongoConnect, mongoDisconnect } = require('../../services/mongo');




describe('Tests GET /planets', () => {
    beforeAll(async () => {
        // Ensure that planet data is loaded before running the tests
        await mongoConnect();
        await loadPlanetsData();
    });
    test('Should return list of planets with status 200', async () => {
        const response = await request(app)
            .get('/v1/planets')
            .expect('Content-Type', /json/)
            .expect(200);

        const planets = response.body;
        expect(planets.length > 0).toBeTruthy();
    });
    afterAll(async () => {
        await mongoDisconnect();
    });
});