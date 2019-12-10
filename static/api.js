import { get, post, upload } from './utils.js';

export async function getProvider(npi_number) {
  return await get(`/api/providers/${npi_number}`);
}

export async function createProvider(payload) {
  return await post('/api/providers', payload);
}

export async function createPhoto(file) {
  return await upload('/api/photos', file);
}