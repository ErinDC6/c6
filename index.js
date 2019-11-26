require('dotenv').config();

const express = require('express');
const fetch = require('node-fetch');
const open = require('open');
const Busboy = require('busboy');
const { uploadPhoto } = require('./s3');

const app = express();

/**
 * Proxy a request to the NPI Registry API for a provider with the given NPI number
 */
app.get('/api/provider/:id', async (req, res) => {
  const response = await fetch(`https://npiregistry.cms.hhs.gov/api?version=2.1&number=${req.params.id}`);
  const { results } = await response.json();
  if (!results || !results.length) {
    return res.status(404).send(new Error('Not found'));
  }
  const [ provider ] = results;
  return res.json(provider);
});

/**
 * Upload a profile photo for the provider with the given ID
 * This is streamed straight to S3
 */
app.put('/api/provider/:id/photo', (req, res) => {
  const busboy = new Busboy({ headers: req.headers });
  busboy.on('file', async (filename, file) => {
    const result = await uploadPhoto(req.params.id, file);
    return res.json(result);
  });
  req.pipe(busboy);
});

app.use(express.static('static'));

app.listen(3000, () => {
  console.log('Listening on port 3000');
  open('http://localhost:3000/provider/');
});