import { h, useState, useEffect } from './preact.js';

async function matchHash() {
  const location = window.location.hash.replace(/^#\/?|\/$/g, '');
  
  if (location.match('provider/new')) {
    const Component = await import('./ProviderOnboarding/index.js');
    return {
      component: Component.default,
      props: {},
    };
  }
  
  if (location.match('providers')) {
    const Component = await import('./ProviderList/index.js');
    return {
      component: Component.default,
      props: {},
    }
  }
  
  let match = location.match('provider/(?<npiNumber>.*)');
  if (match) {
    const Component = await import('./ProviderProfile/index.js');
    return {
      component: Component.default,
      props: { ...match.groups },
    };
  }
}

export default function Router() {
  const [ route, updateRoute ] = useState(null);
  useEffect(async () => {
    window.onhashchange = e => {
      navigate(window.location.hash);
    };
    let newRoute = await matchHash();
    if (newRoute) {
      updateRoute(newRoute);
    } else {
      await navigate('/provider/new');
    }
  }, []);
  
  async function navigate(path) {
    window.location.hash = path;
    const newRoute = await matchHash();
    updateRoute(newRoute);
  }
  
  if (!route) {
    return null;
  }
  
  return h(
    route.component,
    {
      ...route.props,
      navigate,
    }
  );
}