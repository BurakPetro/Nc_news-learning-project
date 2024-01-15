const express = require('express');
const app = express();
const { getTopics } = require('./controlers/controlers');

app.use(express.json());

app.get('/api/topics', getTopics);

app.use((err, req, res, next) => {
  console.log(err);
  next(err);
});

module.exports = app;
