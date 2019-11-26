const BUCKET = 'c6collective';
const s3 = require('aws-sdk/clients/s3');

const s3Client = new s3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_ACCESS_SECRET
});

/**
 * Upload the file at the given path to S3.
 * Returns the result metadata object including file location and key.
 * @param    {String} id
 * @param    {ReadableStream} stream
 * @returns  {Promise<{Location: String, Key: String}>}
 */
module.exports.uploadPhoto = async function uploadPhoto(id, stream) {
  try {
    return await s3Client.upload({
      Bucket: BUCKET,
      Key: `provider_photos/${id}`,
      Body: stream,
    }).promise();
  } catch (e) {
    throw new Error(e.message);
  }
};