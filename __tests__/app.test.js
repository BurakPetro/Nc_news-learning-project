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
describe('/api/articles', () => {
  test('', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        body.forEach((element) => {
          expect(typeof element.article_id).toBe('number');
          expect(typeof element.title).toBe('string');
          expect(typeof element.topic).toBe('string');
          expect(typeof element.author).toBe('string');
          expect(typeof element.created_at).toBe('string');
          expect(typeof element.votes).toBe('number');
          expect(typeof element.article_img_url).toBe('string');
          expect(typeof element.comment_count).toBe('string');
        });
      });
  });
});
describe('/api/articles/:article_id/comments', () => {
  test('GET all coments on aproptiate article id', () => {
    return request(app)
      .get('/api/articles/3/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(2);
        body.forEach((element) => {
          expect(typeof element.comment_id).toBe('number');
          expect(typeof element.body).toBe('string');
          expect(typeof element.article_id).toBe('number');
          expect(typeof element.author).toBe('string');
          expect(typeof element.votes).toBe('number');
          expect(typeof element.created_at).toBe('string');
        });
      });
  });
  test('GET 400 on invalid article id, msg Bad request', () => {
    return request(app)
      .get('/api/articles/nonsens/comments')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
      });
  });
  test('GET 404 on valid but non existent article id', () => {
    return request(app)
      .get('/api/articles/99999/comments')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('article does not exist');
      });
  });
  test('comments should be sortet from the most resent comment', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        body.forEach((element) => {
          let start = body[0].created_at;
          expect(element.created_at <= start).toBe(true);
        });
      });
  });
});
describe('POST /api/articles/:article_id/comments', () => {
  test('post comment with appropriete article id, user name, comment body', () => {
    return request(app)
      .post('/api/articles/2/comments')
      .send({ username: 'icellusedkars', body: 'some comment' })
      .expect(201)
      .then(({ body }) => {
        expect(body.msg).toBe('comment was added');
        expect(typeof body.comment.comment_id).toBe('number');
        expect(body.comment.body).toBe('some comment');
        expect(body.comment.article_id).toBe(2);
        expect(body.comment.author).toBe('icellusedkars');
        expect(body.comment.votes).toBe(0);
        expect(typeof body.comment.created_at).toBe('string');
      });
  });
  test('in case wrong user name shoud recive 400 and msg User not found', () => {
    return request(app)
      .post('/api/articles/2/comments')
      .send({ username: 'nonsens', body: 'some comment' })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('User not found');
      });
  });
  test('Post 404 on valid but non existent article id', () => {
    return request(app)
      .post('/api/articles/99999/comments')
      .send({ username: 'icellusedkars', body: 'some comment' })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('article does not exist');
      });
  });
  test('POST 400 on invalid article id, msg Bad request', () => {
    return request(app)
      .post('/api/articles/nonsens/comments')
      .send({ username: 'icellusedkars', body: 'some comment' })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
      });
  });
});
describe('patch /api/articles/:article_id', () => {
  test('patch, statuscode 201, answer with article which has new value of votes and all other values same as before', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({ inc_votes: 1 })
      .expect(201)
      .then(({ body }) => {
        expect(body.msg).toBe('votes been modifaed');
        expect(body.article.article_id).toBe(1);
        expect(body.article.title).toBe('Living in the shadow of a great man');
        expect(body.article.topic).toBe('mitch');
        expect(body.article.created_at).toBe('2020-07-09T20:11:00.000Z');
        expect(body.article.votes).toBe(101);
        expect(body.article.article_img_url).toBe(
          'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
        );
      });
  });
  test('patch, statuscode 201, check votes value on -55 passed', () => {
    return request(app)
      .patch('/api/articles/2')
      .send({ inc_votes: -55 })
      .expect(201)
      .then(({ body }) => {
        expect(body.article.votes).toBe(-55);
      });
  });
  test('patch 400 on invalid article id, msg Bad request', () => {
    return request(app)
      .patch('/api/articles/nonsens')
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
      });
  });
  test('patch 404 on valid but non existent article id', () => {
    return request(app)
      .patch('/api/articles/99999')
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('article does not exist');
      });
  });
  test('patch 200 on empty request object', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({})
      .expect(200)
      .then(({ body }) => {
        expect(body.article.article_id).toBe(1);
        expect(body.article.votes).toBe(100);
      });
  });
});
