require('dotenv').config();

const express = require('express');
const Busboy = require('busboy');
const photo = require('./photo');
const provider = require('./provider');

const app = express();

/**
 * Proxy a request to the NPI Registry API for a provider with the given NPI number
 */
app.get('/api/provider/:npi_number', async (req, res) => {
  const p = await provider.getByNPINumber(req.params.npi_number);
  if (!p) {
    return res.status(404).send(new Error('Not found'));
  }
  return res.json(p);
});

app.post('/api/provider', async (req, res) => {
  const { npi_number, photos, bio } = req.body;
  const p = await provider.create({ npi_number, photos, bio });
  return res.json(p);
});

/**
 * Upload a profile photo for the provider with the given ID
 * This is streamed straight to S3
 */
app.post('/api/photo', (req, res) => {
  const busboy = new Busboy({ headers: req.headers });
  req.pipe(busboy);
  busboy.on('file', async (filename, stream) => {
    const p = photo.create(stream);
    return res.json(p);
  });
});

app.use(express.static('static'));

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});