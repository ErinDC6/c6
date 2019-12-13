import { h } from '../preact.js';

import ProfilePhoto from '../ProfilePhoto.js';
import { getProviderDisplayName } from '../utils.js';

export default function ProviderListItem(props) {
  return h(
    'a',
    {
      className: 'provider-list-item',
      href: `/#/provider/${props.npi_number}`,
    },
    h(
      'div',
      { className: 'provider-list-item-photo' },
      h(
        ProfilePhoto,
        { src: props.profile_photo }
      ),
    ),
    h(
      'p',
      null,
      getProviderDisplayName(props),
    ),
  );
}