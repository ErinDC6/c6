import { h, useState } from '../preact.js';

export default function Search({ next, npiNumber, getProvider, updateNPINumber }) {
  return [
    h(Title),
    h(Description),
    h(Description2),
    h(
      Input,
      {
        next,
        npiNumber,
        getProvider,
        updateNPINumber,
      },
    ),
  ]
}

function Title() {
  return h(
    'h1',
    null,
    'Become a C6 Provider'
  )
}

function Description() {
  return h(
    'p',
    null,
    'Our network connects people in need of care directly to providers like you ' +
    'and our software ensures compatibility in need, cost, location, availability, and more.',
  )
}


function Description2() {
  return h(
    'p',
    null,
    'Find out why providers are saying C6 Collective makes practicing medicine more rewarding.',
  )
}

function Input({ next, npiNumber, getProvider, updateNPINumber }) {
  const [ clean, updateClean ] = useState(true);
  return h(
    'form',
    {
      className: 'npi-search',
      onSubmit: e => e.preventDefault(),
    },
    h(
      'label',
      null,
      'Sign up with your NPI Number:',
      h(
        'div',
        null,
        h(
          'input',
          {
            key: 'input2',
            type: 'number',
            value: npiNumber,
            onInput: e => {
              updateNPINumber(e.target.value)
            },
          }
        ),
        h(
          'button',
          {
            onClick: async () => {
              try {
                await getProvider();
              } catch {
                updateClean(false);
              }
            }
          },
          '🔍',
        ),
      ),
    ),
    !clean && h(
      'p',
      { className: 'npi-search-error' },
      "We couldn't find a provider with that NPI number.",
    )
  );
}