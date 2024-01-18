const express = require('express');
const app = express();
const {
  getTopics,
  getAllEndpoints,
  getArticleById,
  getArticles,
  getCommentsOnArticle,
  postComentOnArticle,
  patchVoteOnArticle,
  deleteComentById,
  getUsers,
} = require('./controlers/controlers');

app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api', getAllEndpoints);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id/comments', getCommentsOnArticle);
app.post('/api/articles/:article_id/comments', postComentOnArticle);
app.patch('/api/articles/:article_id', patchVoteOnArticle);
app.delete('/api/comments/:comment_id', deleteComentById);
app.get('/api/users', getUsers);

app.use((err, req, res, next) => {
  //console.log(err);
  if (err.code === '22P02') {
    res.status(400).send({ msg: 'Bad request' });
  } else if (err.code === '23503') {
    res.status(400).send({ msg: 'User not found' });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  //console.log(err);
  if (err.msg === 'content not found') {
    res.status(204);
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  //console.log(err);
  if (err.msg === 'article does not exist') {
    res.status(404).send({ msg: err.msg });
  } else {
    next(err);
  }
});

module.exports = app;
