import { h, useEffect } from '../preact.js';
import { sleep } from '../utils.js';

export default function Done({ createProvider, navigateToProvider }) {
  useEffect(async () => {
    const [{ npi_number }] = await Promise.all([
      createProvider(),
      sleep(2),
    ]);
    navigateToProvider(npi_number);
  }, []);
  
  return h(
    'h1',
    null,
    "We're creating your profile..."
  )
}