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
