const express = require('express');
const app = express();
const { getTopics, getAllEndpoints } = require('./controlers/controlers');

app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api', getAllEndpoints);

app.use((err, req, res, next) => {
  console.log(err);
  next(err);
});

module.exports = app;
