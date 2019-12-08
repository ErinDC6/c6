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
    .select('photos.*')
    .from('photos')
    .innerJoin('provider_photos', 'photos.id', 'provider_photos.photo_id')
    .innerJoin('providers', 'providers.npi_number', 'provider_photos.provider_npi_number')
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
    await db('providers').insert(data);
  } catch {
    throw new Error('409');
  }
}


async function createWithPhotos(data) {
  const { photo_ids, ...providerData } = data;
  const providerPhotos = photo_ids.map(id => ({
    provider_npi_number: providerData.npi_number,
    photo_id: id,
  }));
  await create(providerData);
  await db('provider_photos').insert(providerPhotos);
}

module.exports = {
  getFromNPIRegistry,
  getWithPhotosFromDB,
  createWithPhotos,
};