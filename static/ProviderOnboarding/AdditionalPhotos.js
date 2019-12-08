import { h } from '../preact.js';
import PhotoUpload from '../PhotoUpload.js';

export default function AdditionalPhotos({ next, photo_ids, nextEnabled, addPhoto }) {
  return [
    h(
      'h2',
      null,
      'Additional Photos',
    ),
    h(
      'p',
      null,
      'Upload some additional photos. These should give people a feel for who you are: ' +
      'photos of your staff, your practice, and your passions are good choices.',
    ),
    h(
      'div',
      { className: 'additional-photos' },
      [
        h(
          PhotoUpload,
          { onSuccess: ({ id }) => addPhoto(id) },
        ),
        photo_ids.map(() => h(
          PhotoUpload,
          { onSuccess: ({ id }) => addPhoto(id) },
        )),
      ]
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