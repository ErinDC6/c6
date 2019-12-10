import { useState, h } from '../preact.js';

import { getProvider, createProvider } from '../api.js';

import Search from './Search.js';
import Greeting from './Greeting.js';
import Headshot from './Headshot.js';
import AdditionalPhotos from './AdditionalPhotos.js';
import Bio from './Bio.js';
import Done from './Done.js';

export default function Onboarding({ navigate }) {
  const [ step, updateStep ] = useState(0);
  const [ provider, updateProvider ] = useState({});
  const [ payload, updatePayload ] = useState({
    npi_number: '',
    profile_photo_id: '',
    photo_ids: [],
    bio: '',
  });
  
  function mergeUpdatePayload(delta) {
    updatePayload({ ...payload, ...delta });
  }
  
  function next() {
    updateStep(step + 1);
  }
  
  function navigateToProvider(npi_number) {
    return navigate(`/provider/${npi_number}`);
  }
  
  const STEPS = [
    
    // Search
    () => h(Search, {
      npiNumber: payload.npi_number,
      getProvider: async () => {
        const provider = await getProvider(payload.npi_number);
        if (provider.registered) {
          navigateToProvider(payload.npi_number);
        }
        next();
        updateProvider(provider);
      },
      updateNPINumber: npi_number => {
        mergeUpdatePayload({ npi_number });
      }
    }),
    
    // Greeting
    () => h(Greeting, {
      next,
      nextEnabled: true,
      name: provider.basic.first_name.toLowerCase(),
    }),
    
    // Headshot
    () => h(Headshot, {
      next,
      nextEnabled: payload.profile_photo_id.length,
      updateProfilePhoto: profile_photo_id => {
        mergeUpdatePayload({ profile_photo_id });
      },
    }),
    
    // Additonal Photos
    () => h(AdditionalPhotos, {
      next,
      nextEnabled: payload.photo_ids.length,
      photo_ids: payload.photo_ids,
      addPhoto: id => {
        mergeUpdatePayload({ photo_ids: [ ...payload.photo_ids, id ] });
      },
    }),
    
    // Bio
    () => h(Bio, {
      next,
      nextEnabled: payload.bio.length,
      updateBio: bio => {
        mergeUpdatePayload({ bio });
      },
    }),
    
    // Done
    () => h(Done, {
      createProvider: async () => {
        return await createProvider(payload);
      },
      navigateToProvider
    })
  ];
  
  return h(
    'div',
    { className: 'onboarding-provider' },
    STEPS[step](),
  );
}