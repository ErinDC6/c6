import { h, useEffect, useState } from '../preact.js';

import { getProviders } from '../api.js';

import ProviderListItem from './ProviderListItem.js';

export default function ProviderList(props) {
  const [ providers, updateProviders ] = useState([]);
  
  useEffect(async () => {
    updateProviders(
      await getProviders(),
    );
  }, []);
  
  console.log(providers);
  
  return [
    h(
      'h1',
      null,
      'Providers'
    ),
    !providers.length ?
      'No providers found.' :
      h(
        'div',
        { className: 'provider-list' },
        providers.map(ProviderListItem),
      )
  ];
}