const s3 = require('./s3');
const db = require('./db');

module.exports.create = async function createPhoto(stream) {
  const { Location: url } = await s3.upload(stream);
  return db('photo').insert({ url });
};