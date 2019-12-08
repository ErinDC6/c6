import { h, useEffect, useState } from '../preact.js';
import { getProvider } from '../api.js';

import NotFound from '../NotFound.js';

export default function ProviderProfile({ npiNumber }) {
  const [ provider, updateProvider ] = useState({});
  useEffect(async () => {
    const provider = await getProvider(npiNumber);
    updateProvider(provider);
  }, []);
  
  if (!Object.keys(provider).length) {
    return h(
      'h1',
      null,
      'Loading...',
    );
  }
  
  if (!provider.registered) {
    return h(NotFound);
  }
  
  return h(
    'h1',
    null,
    npiNumber,
  )
}