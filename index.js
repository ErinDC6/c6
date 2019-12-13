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
 * Query providers
 */
app.get('/api/providers', async (req, res) => {
  const { npi_number, ...queryWithoutNPI } = req.query;
  
  // Request filtered on npi_number is a get operation
  if (npi_number) {
    if (!parseInt(npi_number)) {
      return res.status(400).send(new Error('Bad Request: NPI number is not numeric.'));
    }
    const provider = await providers.getOne(npi_number);
    console.log('prov', provider);
    if (!provider) {
      return res.status(404).send(new Error('Not Found'));
    }
    return res.json(provider);
  }
  
  // No other queries allowed besides NPI number
  if (Object.keys(queryWithoutNPI).length) {
    return res.status(400).send(new Error('Bad Request: Unsupported query parameter(s).'));
  }
  
  // Request without query parameters is a list operation
  const allProviders = await providers.getAll();
  
  return res.json(allProviders);
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