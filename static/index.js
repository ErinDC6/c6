/**
 * Render an element into a container, removing any existing content
 */
function render(child, container) {
  while (container.childNodes.length) {
    container.firstChild.remove();
  }
  container.append(child);
}

const form = document.getElementById('npi-form');
const container = document.getElementById('container');
const input = document.getElementById('npi-input');

/**
 * When the form is submitted, call our server for NPI data and render the result
 */
form.onsubmit = async function npiSearch(e) {
  e.preventDefault();
  render("Searching...", container);
  const res = await fetch(`/provider?npiNumber=${input.value}`);
  
  if (res.status > 200) {
    // 404 from the server or some other bad code
    // means no results for now
    render("No results", container);
    return;
  }
  
  const provider = await res.json();
  render(Provider(provider), container);
};

/**
 * Template for the provider's basic information
 */
function Provider(data) {
  const frag = document.createDocumentFragment();
  const name = document.createElement('h1');
  name.classList.add('capitalize');
  const gender = document.createElement('p');
  const etc = document.createElement('p');
  frag.append(
    frag,
    name,
    gender,
    etc,
    Address(data.addresses),
    Taxonomies(data.taxonomies),
    Networks(data.identifiers),
  );
  
  name.innerText = `${data.basic.first_name} ${data.basic.last_name} ${data.basic.credential}`.toLowerCase();
  gender.innerText = `Gender: ${data.basic.gender}`;
  etc.innerText = `Entity Type Code: ${data.enumeration_type}`;
  
  return frag;
}

/**
 * Template for the provider's address
 */
function Address(addresses) {
  const frag = document.createDocumentFragment();
  if (!addresses.length) {
    return frag;
  }
  
  const heading = document.createElement('h2');
  heading.innerText = 'Address';
  
  const address = getDisplayAddress(addresses);
  const cityState = document.createElement('p');
  cityState.innerText = `${address.city} ${address.state}`;
  const phone = document.createElement('p');
  phone.innerText = address.telephone_number;
  
  frag.append(
    heading,
    AddressLine(address.address_1),
    AddressLine(address.address_2),
    cityState,
    phone
  );
  return frag;
}

/**
 * Template for a single line of the provider's address
 */
function AddressLine(line) {
  const frag = document.createDocumentFragment();
  // Don't display empty address lines
  if (line.length) {
    const p = document.createElement('p');
    frag.append(p);
    p.innerText = line;
  }
  return frag;
}

/**
 * Template for unique Taxonomy data
 */
function Taxonomies(taxonomies) {
  const frag = document.createDocumentFragment();
  if (!taxonomies.length) {
    return frag;
  }
  
  const heading = document.createElement('h2');
  const list = document.createElement('ul');
  frag.append(heading, list);
  
  heading.innerText = 'Taxonomies';
  
  const uniqueTaxonomies = taxonomies.reduce((acc, t) => ({ ...acc, [t.code]: t.desc }), {});
  const items = Object.values(uniqueTaxonomies).map(t => {
    const item = document.createElement('li');
    item.innerText = t;
    return item;
    
  });
  list.append(...items);
  return frag;
}

function Networks(networks) {
  const frag = document.createDocumentFragment();
  if (!networks.length) {
    return frag;
  }
  
  const heading = document.createElement('h2');
  const list = document.createElement('ul');
  frag.append(heading, list);
  
  heading.innerText = 'Networks';
  
  const items = networks.map(p => {
    const item = document.createElement('li');
    item.innerText = p.issuer;
    return item;
  });
  list.append(...items);
  return frag;
}

/**
 * Helper function to get the provider's location address, or just their first
 * if no location address exists
 */
function getDisplayAddress(addresses) {
  if (addresses.length > 1) {
    const locations = addresses.filter(a =>
      a.address_purpose.toLowerCase() === 'location'
    );
    if (locations) {
      return locations[0];
    }
  }
  return addresses[0];
}
