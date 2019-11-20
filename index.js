require('dotenv').config();

const express = require('express');
const fetch = require('node-fetch');
const open = require('open');
const Busboy = require('busboy');
const { upload } = require('./s3');

const app = express();

/**
 * Proxy a request to the NPI Registry API for a provider with the given NPI number
 */
app.get('/provider', async (req, res) => {
  const npiNumber = req.query.npiNumber;
  const response = await fetch(`https://npiregistry.cms.hhs.gov/api?version=2.1&number=${npiNumber}`);
  const { results } = await response.json();
  if (!results) {
    return res.status(404).send(new Error('Not found'));
  }
  const [ provider ] = results;
  return res.json(provider);
});

app.put('/provider/photo', (req, res) => {
  const busboy = new Busboy({ headers: req.headers });
  busboy.on('file', async (filename, file) => {
    const result = await upload(filename, file);
    console.log(result);
    return res.json(result);
  });
  req.pipe(busboy);
});

app.use(express.static('static'));

app.listen(3000, () => {
  console.log('Listening on port 3000');
  open('http://localhost:3000');
});