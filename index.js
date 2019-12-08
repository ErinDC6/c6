const PORT = 80;

require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const Busboy = require('busboy');
const photos = require('./photos');
const providers = require('./providers');
const app = express();
app.use(morgan('dev'));

/**
 * Get a Provider by NPI number
 */
app.get('/api/providers/:npi_number', async (req, res) => {
  // NPI number must be an integer
  const npiNumberAsInt = parseInt(req.params.npi_number);
  if (!npiNumberAsInt) {
    return res.status(400).send(new Error('Bad Request'));
  }
  
  // Provider must exist
  const p = await providers.get(npiNumberAsInt);
  if (!p) {
    return res.status(404).send(new Error('Not Found'));
  }
  
  return res.json(p);
});

/**
 * Create a Provider
 */
app.post('/api/providers', express.json(), async (req, res) => {
  const { npi_number, profile_photo_id, photo_ids, bio } = req.body;
  const p = await providers.create({ npi_number, profile_photo_id, photo_ids, bio });
  return res.json(p);
});

/**
 * Create a Photo
 */
app.post('/api/photos', (req, res) => {
  const busboy = new Busboy({ headers: req.headers });
  req.pipe(busboy);
  busboy.on('file', async (filename, stream) => {
    const p = await photos.create(stream);
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