const db = require('../db/connection');
const format = require('pg-format');
const fs = require('fs/promises');

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
  });
};
exports.fetchAllEndponts = () => {
  return fs.readFile(`./endpoints.json`, 'utf8').then((result) => {
    return JSON.parse(String(result));
  });
};
exports.fetchArticlById = (article_id) => {
  return db
    .query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
    .then((result) => {
      if (!result.rows[0]) {
        return Promise.reject({ msg: 'article does not exist' });
      }

      return result.rows[0];
    });
};
exports.fetchArticles = () => {
  return db
    .query(
      `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at,articles.article_img_url, COUNT(comment_id) AS comment_count,articles.votes FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC;`
    )
    .then(({ rows }) => {
      return rows;
    });
};
exports.fetchCommentsOnArticle = (article_id) => {
  return db
    .query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
    .then((result) => {
      if (!result.rows[0]) {
        return Promise.reject({ msg: 'article does not exist' });
      } else {
        return db
          .query(
            `SELECT * FROM comments WHERE article_id = $1 ORDER BY comments.created_at DESC ;`,
            [article_id]
          )
          .then((result1) => {
            return result1.rows;
          });
      }
    });
};
exports.insertComentOnArticle = (article_id, comment) => {
  return db
    .query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
    .then((result) => {
      if (!result.rows[0]) {
        return Promise.reject({ msg: 'article does not exist' });
      } else {
        const insertCommentsForQuery = format(
          'INSERT INTO comments (body, author, article_id, votes) VALUES %L RETURNING *;',
          [[comment.body, comment.username, article_id, 0]]
        );
        return db.query(insertCommentsForQuery).then((result) => {
          return result.rows[0];
        });
      }
    });
};
