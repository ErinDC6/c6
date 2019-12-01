const { fetchJSON } = require('../utils');
const db = require('../db');

async function getFromNPIRegistry(npi_number) {
  const { results } = await fetchJSON(`https://npiregistry.cms.hhs.gov/api?version=2.1&number=${npi_number}`);
  if (!results || !results.length) {
    return null;
  }
  const [ provider ] = results;
  return provider;
}

async function getFromDB(npi_number) {
  return db
    .select()
    .from('providers')
    .where({ npi_number })
    .first();
}

async function getPhotosFromDB(npi_number) {
  return db
    .select()
    .from('providers')
    .innerJoin('provider_photos', 'providers.npi_number', 'provider_photos.provider_id')
    .where({ npi_number });
}


async function getWithPhotosFromDB(npi_number) {
  const [ provider, photos ] = await Promise.all([
    getFromDB(npi_number),
    getPhotosFromDB(npi_number),
  ]);
  if (!provider) {
    return null;
  }
  return {
    ...provider,
    photos,
  }
}

async function create(data) {
  try {
    db('providers').insert(data);
  } catch {
    throw new Error('409');
  }
}


async function createWithPhotos(data) {
  const { photos: photoData, ...providerData } = data;
  return Promise.all([
    create(providerData),
    db('provider_photos').insert(photoData),
  ])
}

module.exports = {
  getFromNPIRegistry,
  getWithPhotosFromDB,
  createWithPhotos,
};