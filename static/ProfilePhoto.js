import { h } from './preact.js';

export default function ProfilePhoto({ src }) {
  return h(
    'div',
    { className: 'provider-profile-image' },
    h(
      'img',
      { src },
    )
  )
}