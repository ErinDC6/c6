const fetch = require('node-fetch');

module.exports.fetchJSON = async function fetchJSON(url) {
  const res = await fetch(url);
  return res.json();
};