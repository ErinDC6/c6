import { h } from '../preact.js';
import PhotoUpload from './PhotoUpload.js';

export default function Headshot({ next, payload, updatePayload }) {
  return [
    h(
      'h2',
      null,
      'Profile Photo',
    ),
    h(
      'p',
      null,
      'First, upload a headshot. This one ought to look professional.',
    ),
    h(
      PhotoUpload,
      {
        onSuccess: ({ id }) => updatePayload({ profile_photo: id }),
      }
    ),
    h(
      'button',
      {
        onClick: next,
        disabled: !payload.profile_photo,
      },
      'Next',
    )
  ]
}