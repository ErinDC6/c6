import { h, useState, useRef } from '../preact.js';
import { get } from '../utils.js';

export default function Search({ next, updateProvider, updatePayload }) {
  return [
    h(Title),
    h(Description),
    h(Description2),
    h(
      Input,
      {
        updateProvider,
        updatePayload,
        next,
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

function Input({ next, updateProvider, updatePayload }) {
  const input = useRef(null);
  const [ npiValue, updateNpiValue ] = useState('');
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
            ref: input,
            type: 'number',
            value: npiValue,
            onChange: e => updateNpiValue(e.target.value),
          }
        ),
        h(
          'button',
          {
            onClick: async () => {
              try {
                updateProvider(
                  await get(`/api/providers/${ npiValue }`),
                );
              } catch {
                updateClean(false);
                return;
              }
              updatePayload({ npi_number: npiValue });
              next();
            }
          },
          '🔍',
        ),
      ),
    ),
    !clean && h(
      'p',
      {
        className: 'npi-search-error'
      },
      "We couldn't find a provider with that NPI number.",
    )
  );
}