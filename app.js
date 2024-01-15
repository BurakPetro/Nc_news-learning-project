const express = require('express');
const app = express();
const {
  getTopics,
  getAllEndpoints,
  getArticleById,
} = require('./controlers/controlers');

app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api', getAllEndpoints);
app.get('/api/articles/:article_id', getArticleById);
app.use((err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ msg: 'Bad request' });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  console.log(err);
  if (err.msg === 'article does not exist') {
    res.status(404).send({ msg: err.msg });
  } else {
    next(err);
  }
});

module.exports = app;
