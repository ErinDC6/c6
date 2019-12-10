/**
 * A Provider is a hybrid entity stored between the NPI Registry and our DB representing a healthcare provider.
 *
 * We do this because the NPI Registry API doesn't support webhooks for when data on their end is updated
 * To avoid sync issues, we query data from both locations and combine them.
 */

const {
  getFromNPIRegistry,
  getWithPhotosFromDB,
  createWithPhotos,
} = require('./utils');

/**
 * Get a Provider
 * If no provider with the given NPI number in the NPI registry, returns null
 * If found in the NPI registry but not our DB, return object has property "registered" set to false
 * If found in both, return object has property "registered" set to true
 *
 * @param   {Number} npi_number
 * @param   {Object} [caches]
 * @param   {Object} [caches.npiData]
 * @param   {Object} [caches.dbData]
 * @returns {Promise<Object>}
 */
async function get(npi_number, { npiData, dbData } = {}) {
  const [ npiResponse, dbResponse ] = await Promise.all([
    npiData || getFromNPIRegistry(npi_number),
    dbData || getWithPhotosFromDB(npi_number),
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

/**
 * Create a Provider
 * This creates the portion of the Provider that is stored in our DB
 *
 * @param   {Object} data
 * @returns {Promise<Object>}
 */
async function create(data) {
  const npiData = await getFromNPIRegistry(data.npi_number);
  if (!npiData) {
    throw new Error('400');
  }
  const dbData = await createWithPhotos(data);
  return get(data.npi_number, { npiData, dbData });
}

module.exports = {
  get,
  create,
};