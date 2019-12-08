import { h } from './preact.js';

export default function NotFound() {
  return [
    h(
      'h1',
      null,
      '404: Not Found',
    ),
    h(
      'p',
      null,
      "Sorry, but the resource you're looking for doesn't exist.",
    ),
  ];
}