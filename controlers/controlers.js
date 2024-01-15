const { fetchTopics } = require('../modules/module');

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      next(err);
    });
};
