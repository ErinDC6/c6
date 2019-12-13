export async function wrappedFetch(...args) {
  const res = await fetch(...args);
  if (res.status >= 400) {
    throw new Error(res.statusCode);
  }
  return await res.json();
}

export async function get(url) {
  return await wrappedFetch(url);
}

export async function post(url, body) {
  return await wrappedFetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export async function upload(url, file) {
  const body = new FormData();
  body.append('photo', file);
  return await wrappedFetch(url, {
    method: 'POST',
    body,
  });
}

export async function sleep(ms) {
  return await new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

export function getProviderDisplayName(provider) {
  return `${provider.basic.first_name.toLowerCase()} ${provider.basic.last_name.toLowerCase()} ${provider.basic.credential? provider.basic.credential : ''}`;
}