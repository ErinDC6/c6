import { useState, h } from '../preact.js';

import Search from './Search.js';
import Greeting from './Greeting.js';
import Headshot from './Headshot.js';
import AdditionalPhotos from './AdditionalPhotos.js';

const STEPS = [Search, Greeting, Headshot, AdditionalPhotos, /* Bio*/];

export default function Onboarding() {
  const [ provider, updateProvider ] = useState({});
  const [ payload, updatePayload ] = useState({});
  const [ step, updateStep ] = useState(0);
  const Step = STEPS[step];
  
  return h(
    Step,
    {
      step,
      provider,
      payload,
      updateProvider,
      updatePayload: updates => {
        updatePayload({ ...payload, ...updates });
      },
      next: () => {
        updateStep(step + 1);
      },
    }
  );
}