import { h } from './preact.js';

export default function Map({ address }) {
  return h(
    'iframe',
    { src: `https://maps.google.com/maps?q=${address}&t=&z=13&ie=UTF8&iwloc=&output=embed` }
  )
}

