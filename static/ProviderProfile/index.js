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
  
  const basic = provider.basic;
  const name = `${basic.first_name.toLowerCase()} ${basic.last_name.toLowerCase()} ${basic.credential}`;
  return h(
    'div',
    { className: 'provider-profile' },
    [
      h(
        'h1',
        null,
        name,
      ),
      h(
        Image,
        { src: provider.profile_photo.url },
      ),
      h(
        'h2',
        null,
        `About ${provider.basic.first_name.toLowerCase()}`
      ),
      h(
        'ul',
        null,
        h(
          'li',
          null,
          h(
            'strong',
            null,
            'Gender: '
          ),
          provider.basic.gender,
        ),
        h(
          'li',
          null,
          h(
            'strong',
            null,
            'Address: '
          ),
          h(
            PrimaryAddress,
            { addresses: provider.addresses }
          )
        ),
        h(
          'li',
          null,
          h(
            'strong',
            null,
            'Bio: ',
          ),
          h(
            'p',
            null,
            provider.bio,
          ),
        ),
        h(
          'li',
          null,
          h(
            'strong',
            null,
            'Taxonomies: '
          ),
          h(
            Taxonomies,
            { taxonomies: provider.taxonomies }
          )
        ),
      ),
      h(
        'h2',
        null,
        `${provider.basic.first_name.toLowerCase()}'s Photos`
      ),
      h(
        'div',
        { className: 'provider-profile-additional-images' },
        provider.photos.map(p => h(
          Image,
          { src: p.url, },
        )),
      ),
    ],
  );
}

function Image({ src }) {
  return h(
    'div',
    { className: 'provider-profile-image' },
    h(
      'img',
      { src },
    )
  )
}

function PrimaryAddress({ addresses }) {
  const [ locationAddress ] = addresses.filter(a => a.address_purpose === 'LOCATION');
  if (locationAddress) {
    return h(
      Address,
      { address: locationAddress },
    )
  }
  const [ firstAddress ] = addresses;
  return h(
    Address,
    { addresses: firstAddress }
  )
}

function Address({ address }) {
  return [
    h(
      'p',
      null,
      address.address_1.toLowerCase(),
    ),
    address.address_2 && h(
      'p',
      null,
      address.address_2.toLowerCase(),
    ),
    h(
      'p',
      null,
      `${address.city.toLowerCase()}, ${address.state} ${address.postal_code}`,
    )
  ]
}

function Taxonomies({ taxonomies }) {
  return h(
    'ul',
    null,
    taxonomies.map(t => h(
      'li',
      null,
      `${t.desc} (${t.state})`,
    ))
  )
}