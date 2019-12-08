import { h } from '../preact.js';
import PhotoUpload from '../PhotoUpload.js';

export default function Headshot({ next, nextEnabled, updateProfilePhoto }) {
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
      { onSuccess: ({ id }) => updateProfilePhoto(id) },
    ),
    h(
      'button',
      {
        onClick: next,
        disabled: !nextEnabled,
      },
      'Next',
    ),
  ]
}