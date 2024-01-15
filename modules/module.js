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
