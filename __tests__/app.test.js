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
describe('/api/articles/:article_id', () => {
  test('get object describing an article using specific id', () => {
    return request(app)
      .get('/api/articles/3')
      .expect(200)
      .then(({ body }) => {
        expect(body.author).toBe('icellusedkars');
        expect(body.title).toBe('Eight pug gifs that remind me of mitch');
        expect(body.article_id).toBe(3);
        expect(body.body).toBe('some gifs');
        expect(body.topic).toBe('mitch');
        expect(body.created_at).toBe('2020-11-03T09:12:00.000Z');
        expect(body.votes).toBe(0);
        expect(body.article_img_url).toBe(
          'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
        );
      });
  });
  test('responds with msg article does not exists if providet with valid but non existent id', () => {
    return request(app)
      .get('/api/articles/3333')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('article does not exist');
      });
  });
  test('responds with an appropriate status and error message when given an invalid id', () => {
    return request(app)
      .get('/api/articles/nonsens')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
      });
  });
});
