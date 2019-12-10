import { h, useState } from './preact.js';

export default function Carousel(props) {
  const [ index, updateIndex ] = useState(0);
  
  function spin(direction) {
    const result = index + direction;
    if (result > props.photos.length - 1) {
      return updateIndex(0);
    }
    if (result < 0) {
      return updateIndex(props.photos.length - 1);
    }
    updateIndex(result);
  }
  
  return h(
    'div',
    { className: 'carousel' },
    h(
      'img',
      {
        src: props.photos[index],
        className: 'contained',
      },
    ),
    h(
      'div',
      {
        className: 'carousel-prev',
        onClick: () => spin(-1),
      },
      h(
        'div',
        null,
        h(
          'span',
          null,
          '‹',
        )
      )
    ),
    h(
      'div',
      {
        className: 'carousel-next',
        onClick: () => spin(1),
      },
      h(
        'div',
        null,
        h(
          'span',
          null,
          "›",
        )
      )
    ),
  )
}