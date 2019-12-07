import { useState, h } from '../preact.js';

import Search from './Search.js';
import Greeting from './Greeting.js';
import Headshot from './Headshot.js';
import AdditionalPhotos from './AdditionalPhotos.js';
import Bio from './Bio.js';
import Done from './Done.js';
import { get, post } from '../utils.js';

export default function Onboarding() {
  const [ step, updateStep ] = useState(0);
  const [ provider, updateProvider ] = useState({});
  const [ payload, updatePayload ] = useState({
    npi_number: '',
    profile_photo: '',
    photos: [],
    bio: '',
  });
  
  function mergeUpdatePayload(delta) {
    updatePayload({ ...payload, ...delta });
  }
  
  function next() {
    updateStep(step + 1);
  }
  
  const STEPS = [
    
    // Search
    () => h(Search, {
      next,
      nextEnabled: true,
      npiNumber: payload.npi_number,
      getProvider: async () => {
        updateProvider(
          await get(`/api/providers/${payload.npi_number}`),
        );
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
      nextEnabled: payload.profile_photo.length,
      updateProfilePhoto: profile_photo => {
        mergeUpdatePayload({ profile_photo });
      },
    }),
    
    // Additonal Photos
    () => h(AdditionalPhotos, {
      next,
      nextEnabled: payload.photos.length,
      photos: payload.photos,
      addPhoto: id => {
        mergeUpdatePayload({ photos: [ ...payload.photos, id ] });
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
        await post('/api/providers', payload);
      }
    })
  ];
  
  return h(
    'div',
    { className: 'onboarding-provider' },
    STEPS[step](),
  );
}