import { h } from '../preact.js';

export default function Bio({ next, nextEnabled, bio, updateBio }) {
  return [
    h(
      'h2',
      null,
      'Bio',
    ),
    h(
      'p',
      null,
      'Tell people about yourself - your background, your interests, and the sort of work you do.',
    ),
    h(
      'textarea',
      {
        value: bio,
        onInput: e => updateBio(e.target.value),
      },
    ),
    h(
      'button',
      {
        onClick: next,
        disabled: !nextEnabled,
      },
      'Next',
    ),
  ];
}