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
    body,
  });
}