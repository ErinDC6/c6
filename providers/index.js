/**
 * A Provider is a hybrid entity stored between the NPI Registry and our DB representing a healthcare provider.
 *
 * We do this because the NPI Registry API doesn't support webhooks for when data on their end is updated
 * To avoid sync issues, we query data from both locations and combine them.
 */

const {
  merge,
  getFromNPIRegistry,
  getFromDB,
  createInDB,
} = require('./utils');

/**
 * Get the Provider with the given npi_number
 * In this context, the provider could be in our system or not
 * Query both the DB and the NPI API and merge the results
 *
 * @param   {Number} npi_number
 * @param   {Object} [caches]
 * @param   {Object} [caches.npiCached]
 * @param   {Object} [caches.dbCached]
 * @returns {Promise<Object>}
 */
async function getOne(npi_number, { npiCached, dbCached } = {}) {
  console.log(npi_number);
  const [ fromNpi, fromDb ] = await Promise.all([
    npiCached || getFromNPIRegistry(npi_number),
    dbCached || getFromDB({ npi_number }).first(),
  ]);
  
  console.log('npi', fromNpi);
  console.log('db', fromDb)
  
  return merge(fromDb, fromNpi);
}

/**
 * Get all Providers
 * In this context, the set of all providers is defined as each provider registered in our system
 * Query the DB, map the providers we have onto NPI API calls, and merge the result.
 *
 * @returns {Promise<Object[]>}
 */
async function getAll() {
  const fromDb = await getFromDB();
  return await Promise.all(
    fromDb.map(async p => {
      const fromNpi = await getFromNPIRegistry(p.npi_number);
      return merge(p, fromNpi);
    }),
  );
}

/**
 * Create a Provider
 * This creates the portion of the Provider that is stored in our DB
 *
 * @param   {Object} data
 * @returns {Promise<Object>}
 */
async function create(data) {
  const npiCached = await getFromNPIRegistry(data.npi_number);
  if (!npiCached) {
    throw new Error('400');
  }
  const dbCached = await createInDB(data);
  return getOne(data.npi_number, { npiCached, dbCached });
}

module.exports = {
  getOne,
  getAll,
  create,
};