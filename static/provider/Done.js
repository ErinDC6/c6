import { h, useEffect, useState } from '../preact.js';
import { sleep } from '../utils.js';

export default function Done({ createProvider }) {
  const [ npiNumber, updateNPINumber ] = useState('');
  useEffect(async () => {
    const [{ npi_number }] = await Promise.all(
      createProvider(),
      sleep(2),
    );
    updateNPINumber(npi_number);
  }, []);
  
  if (!npiNumber) {
    return h(
      'h1',
      null,
      "We're creating your profile..."
    )
  }
  
  return [
    h(
      'h1',
      null,
     'All Done!'
    ),
    h(
      'p',
      null,
      [
        'Click',
        h(
          'a',
          { href: `/provider/${npiNumber}` },
          'here',
        ),
        'to view your profile',
      ]
    ),
  ];
}