import { h } from './preact.js';

export default function Map({ address }) {
  const sanitizedAddress = address.replace('#', '');
  return h(
    'iframe',
    { src: `https://maps.google.com/maps?q=${sanitizedAddress}&t=&z=13&ie=UTF8&iwloc=&output=embed` }
  )
}

