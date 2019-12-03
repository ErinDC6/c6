import { h, useRef, useState } from '../preact.js';
import { post } from '../utils.js';

export default function PhotoUpload({ onSuccess }) {
  const [ url, updateUrl ] = useState(null);
  const input = useRef(null);
  return [
    h(
      'div',
      {
        className: 'photo-upload',
        onClick: () => input.current.click(),
      },
      url?
        h(
          'img',
          { src: url, }
        ) :
        'Click to Upload'
    ),
    h(
      'input',
      {
        ref: input,
        type: 'file',
        accept: 'image/*',
        onInput: async e => {
          const [ file ] = e.target.files;
          const body = new FormData();
          body.append('photo', file);
          const photo = await post('/api/photos', body);
          updateUrl(photo.url);
          onSuccess(photo);
        }
      }
    ),
  ];
}