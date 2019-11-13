const express = require('express');
const fetch = require('node-fetch');
const open = require('open');

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

app.use(express.static('static'));

app.listen(3000, () => {
  console.log('Listening on port 3000');
  open('http://localhost:3000');
});