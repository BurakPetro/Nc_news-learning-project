const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index');
const db = require('../db/connection');
const request = require('supertest');
const app = require('../app');

beforeEach(() => seed(testData));
afterAll(() => db.end());
describe('/api/topics', () => {
  test('GET:200', () => {
    return request(app).get('/api/topics').expect(200);
  });
  test('get an array of all objects in test topics, they should contain slug and description', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBe(3);
        body.forEach((element) => {
          expect(typeof element.slug).toBe('string');
          expect(typeof element.description).toBe('string');
        });
      });
  });
  test('GET:404', () => {
    return request(app).get('/api/nonsense').expect(404);
  });
});
describe('/api', () => {
  test('get object describing all existing endponts', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then(({ body }) => {
        expect(typeof body).toBe('object');
        for (const key in body) {
          expect(typeof body[key].description).toBe('string');
          expect(body[key].queries.length >= 0).toBe(true);
          expect(typeof body[key].exampleResponse).toBe('object');
        }
      });
  });
});
