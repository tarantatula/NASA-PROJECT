// npm 'install jest --save-dev' - for jest framework that runs tests
// reference for Jest library in https://jestjs.io/docs/api
// npm 'install supertest --save-dev' to makes requests for API
// update  jest in the package.json under "scripts" => "test": "jest",
// file can also be name launches.specs.js

const request = require('supertest');
const app = require('../../app');
const { mongoConnect, mongoDisconnect } = require('../../services/mongo');


// groupd of tests for GET /launches API
describe('Test GET /launches', () => {
    beforeAll(async () => {
        await mongoConnect();
    });
    //test description and code (callback functionn)
    test('Should respond with 200 success', async () => {
        // form of testing #1
        // const response = await request(app).get('/launches');
        // expect(response.statusCode).toBe(200);
        // regualar expression contains the string 'json'
        const response = await request(app)
            .get('/v1/launches')
            .expect('Content-Type', /json/)
            .expect(200);
    });
});


describe('Test POST / launches', () => {
    test('should respond with 201 created', async () => {

        const validLaunchObject = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-186 f',
            launchDate: 'January 6, 2049',
        };

        const validLaunchObjectWithoutTheDate = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-186 f',
        };

        const response = await request(app)
            .post('/v1/launches')
            .send(validLaunchObject)
            .expect('Content-Type', /json/)
            .expect(201);

        const requestDate = new Date(validLaunchObject.launchDate).valueOf();
        const responseDate = new Date(response.body.launchDate).valueOf();

        expect(responseDate).toBe(requestDate);
        expect(response.body).toMatchObject(validLaunchObjectWithoutTheDate)
    });

    test('should catch missing required fields with status 400', async () => {
        const invalidLaunchObject = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            launchDate: 'January 6, 2049',
        };

        const response = await request(app)
            .post('/v1/launches')
            .send(invalidLaunchObject)
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toStrictEqual({
            error: 'Missing required launch property',
        })
    });

    test('should catch bad date format with status 400', async () => {
        const launchObjectWithInvalidDate = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-186 f',
            launchDate: 'asdfasd',
        };

        const response = await request(app)
            .post('/v1/launches')
            .send(launchObjectWithInvalidDate)
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toStrictEqual({
            error: 'Invalid launch date',
        })
    });
    afterAll(async ()=> {
        await mongoDisconnect();
    });
});