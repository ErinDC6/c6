const { fetchJSON } = require('./utils');
const db = require('./db');

async function getFromNPIAPI(npi_number) {
  const { results } = await fetchJSON(`https://npiregistry.cms.hhs.gov/api?version=2.1&number=${npi_number}`);
  if (!results || !results.length) {
    return null;
  }
  const [ provider ] = results;
  return provider;
}

async function getProviderFromDB(npi_number) {
  return db
    .select()
    .from('providers')
    .where({ npi_number })
    .first();
}

async function getProviderPhotosFromDB(npi_number) {
  return db
    .select()
    .from('providers')
    .innerJoin('provider_photos', 'providers.npi_number', 'provider_photos.provider_id')
    .where({ npi_number });
}

async function getFromDB(npi_number) {
  const [ provider, photos ] = await Promise.all([
    getProviderFromDB(npi_number),
    getProviderPhotosFromDB(npi_number),
  ]);
  if (!provider) {
    return null;
  }
  return {
    ...provider,
    photos,
  }
}

async function createProvider(data) {
  try {
    db('providers').insert(data);
  } catch {
    throw new Error('409');
  }
}

async function createProviderAndPhotos(data) {
  const { photos: photoData, ...providerData } = data;
  return Promise.all([
    createProvider(providerData),
    db('provider_photos').insert(photoData),
  ])
}

async function getProvider(npi_number, npiData = null, dbData = null) {
  const [ npiResponse, dbResponse ] = await Promise.all([
    npiData || getFromNPIAPI(npi_number),
    dbData || getFromDB(npi_number),
  ]);
  
  // Source of truth
  if (!npiResponse) {
    return null;
  }
  
  if (!dbResponse) {
    return {
      ...npiResponse,
      registered: false,
    };
  }
  
  return {
    ...npiResponse,
    registered: true,
    ...dbResponse,
  }
}

module.exports.getByNPINumber = getProvider;

module.exports.create = async function(data) {
  const npiProvider = await getFromNPIAPI(data.npi_number);
  if (!npiProvider) {
    throw new Error('400');
  }
  let dbProvider= createProviderAndPhotos(data);
  return getProvider(data.npi_number, npiProvider, dbProvider);
};