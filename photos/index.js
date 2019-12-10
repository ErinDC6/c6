/**
 * A Photo represents a publicly accessible image with a URL.
 * For now, these are backed by S3, where they are uploaded on creation.
 */

const s3 = require('../s3');
const db = require('../db');

/**
 * Get a Photo
 * @param   {String} id
 * @returns {Promise<Object>}
 */
async function get(id) {
  return db('photos').select().where({ id }).first();
}

/**
 * Create a Photo
 *
 * @param   {ReadableStream} stream
 * @returns {Promise<Object>}
 */
async function create(stream) {
  const { Location: url } = await s3.upload(stream);
  const [ id ] = await db('photos').insert({ url }).returning('id');
  return get(id);
}

module.exports = {
  get,
  create,
};