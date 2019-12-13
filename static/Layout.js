import { h } from './preact.js';

import Router from './Router.js';
import NavBar from './NavBar.js';

export default function Layout() {
  return [
    Header(),
    h(
      'main',
      null,
      h(
        'div',
        { className: 'content' },
        h(Router),
      )
    ),
    Footer(),
  ]
}

function Header() {
  return h(
    'header',
    null,
    h(Logo),
    h(NavBar),
  )
}

function Footer() {
  return h(
    'footer',
    null,
    '© 2019 C6 Collective',
  );
}

function Logo() {
  return h(
    'img',
    {
      className: 'logo',
      src: '/horizontal_inverted.png'
    }
  )
}