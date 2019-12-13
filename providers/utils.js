const { fetchJSON } = require('../utils');
const db = require('../db');
const { JSONSubquery } = require('../db/utils');

async function merge(fromDb, fromNpi) {
  // Source of truth
  if (!fromNpi) {
    return null;
  }
  
  if (!fromDb) {
    return {
      ...fromNpi,
      registered: false,
    };
  }
  
  return {
    ...fromNpi,
    ...fromDb,
    registered: true,
  }
}

async function getFromNPIRegistry(npi_number) {
  const { results } = await fetchJSON(`https://npiregistry.cms.hhs.gov/api?version=2.1&number=${npi_number}`);
  if (!results || !results.length) {
    return null;
  }
  const [ provider ] = results;
  return provider;
}

function getFromDB(query) {
  const photosSubquery = db
    .select('photos.id', 'photos.url')
    .from('photos')
    .innerJoin('provider_photos', 'photos.id', 'provider_photos.photo_id')
    .whereRaw('provider_photos.provider_npi_number = npi_number');
  
  return db
    .select(
      'npi_number',
      'bio',
      'profile_photo.url as profile_photo',
      JSONSubquery('photos', photosSubquery),
    )
    .from('providers')
    .innerJoin('photos as profile_photo', 'profile_photo_id', 'profile_photo.id')
    .modify(qb => {
      if (!query) {
        return;
      }
      qb.where(query);
    });
}

async function createInDB(data) {
  const { photo_ids, ...providerData } = data;
  const providerPhotos = photo_ids.map(id => ({
    provider_npi_number: providerData.npi_number,
    photo_id: id,
  }));
  try {
    await db('providers').insert(providerData);
  } catch {
    throw new Error('409');
  }
  await db('provider_photos').insert(providerPhotos);
}

module.exports = {
  merge,
  getFromNPIRegistry,
  getFromDB,
  createInDB,
};