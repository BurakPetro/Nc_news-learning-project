const {
  fetchTopics,
  fetchAllEndponts,
  fetchArticlById,
  fetchArticles,
  fetchCommentsOnArticle,
  insertComentOnArticle,
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

exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      next(err);
    });
};
exports.getCommentsOnArticle = (req, res, next) => {
  const { article_id } = req.params;
  fetchCommentsOnArticle(article_id)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      next(err);
    });
};
exports.postComentOnArticle = (req, res, next) => {
  const { article_id } = req.params;
  const comment = req.body;

  insertComentOnArticle(article_id, comment)
    .then((result) => {
      res.status(201).send({ comment: result, msg: 'comment was added' });
    })
    .catch((err) => {
      next(err);
    });
};
