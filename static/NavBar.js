import { h } from './preact.js';

export default function NavBar() {
  return h(
    'nav',
    null,
    [
      h(
        'a',
        { href: '/#/providers' },
        'Providers',
      ),
      h(
        'a',
        { href: '/#/provider/new' },
        'Register',
      )
    ]
  )
}