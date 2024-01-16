const db = require('../db/connection');

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
      `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at,articles.article_img_url, COUNT(comment_id) AS comment_count,COALESCE(SUM(comments.votes),'0') AS votes FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC;`
    )
    .then(({ rows }) => {
      console.log(rows);
      return rows;
    });
};
