/**
 * A Photo represents a publicly accessible image with a URL.
 * For now, these are backed by S3, where they are uploaded on creation.
 */

const s3 = require('../s3');
const db = require('../db');

/**
 * Create a Photo
 *
 * @param   {ReadableStream} stream
 * @returns {Promise<Object>}
 */
async function create(stream) {
  const { Location: url } = await s3.upload(stream);
  return db('photo').insert({ url });
}

module.exports = {
  create,
};