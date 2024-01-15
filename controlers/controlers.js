const {
  fetchTopics,
  fetchAllEndponts,
  fetchArticlById,
} = require('../modules/module');

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      next(err);
    });
};
exports.getAllEndpoints = (req, res, next) => {
  fetchAllEndponts()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      next(err);
    });
};
exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticlById(article_id)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      next(err);
    });
};
