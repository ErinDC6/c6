import { h } from '../preact.js';

export default function Greeting({ provider, next }) {
  return [
    h(
      'h1',
      null,
      `Hi ${provider.basic.first_name.toLowerCase()}`
    ),
    h(
      'p',
      null,
      "Let's start building your C6 profile. It'll be quick, there are just a couple of steps."
    ),
    h(
      'button',
      { onClick: () => next({}) },
      'Okay',
    )
  ];
}