const PORT = 80;

require('dotenv').config();

const express = require('express');
const Busboy = require('busboy');
const photos = require('./photos');
const providers = require('./providers');

const app = express();

/**
 * Get a Provider by NPI number
 */
app.get('/api/providers/:npi_number', async (req, res) => {
  const p = await providers.get(req.params.npi_number);
  if (!p) {
    return res.status(404).send(new Error('Not found'));
  }
  return res.json(p);
});

/**
 * Create a Provider
 */
app.post('/api/providers', async (req, res) => {
  const { npi_number, photos, bio } = req.body;
  const p = await providers.create({ npi_number, photos, bio });
  return res.json(p);
});

/**
 * Create a Photo
 */
app.post('/api/photos', (req, res) => {
  const busboy = new Busboy({ headers: req.headers });
  req.pipe(busboy);
  busboy.on('file', async (filename, stream) => {
    const p = photos.create(stream);
    return res.json(p);
  });
});

/**
 * Everything in /static is public
 */
app.use(express.static('static'));

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});