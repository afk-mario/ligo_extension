import { API_URL } from 'lib/constants';

export const DEFAULT_CONFIG = {
  redirect: 'follow',
  mode: 'cors',
  credentials: 'omit',
};

function authHeaders(token, json = true) {
  const headers = new Headers();
  if (json) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', token);
  return headers;
}

export function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

function escapeFilterValue(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

/** Map PocketBase link records to the shape the UI already expects. */
export function mapLinkRecord(record) {
  const expanded = (record.expand && record.expand.tags) || [];
  return {
    id: record.id,
    name: record.name,
    link: record.url,
    dateCreated: record.created,
    tags: expanded.map((t) => ({ tag: t.name })),
  };
}

export async function login({ username, password }) {
  const body = JSON.stringify({
    identity: username,
    password,
  });
  const request = new Request(
    `${API_URL}/api/collections/users/auth-with-password`,
    {
      ...DEFAULT_CONFIG,
      method: 'POST',
      headers: authHeaders(),
      body,
    }
  );

  return fetch(request).then(handleErrors);
}

export async function authRefresh(token) {
  const request = new Request(`${API_URL}/api/collections/users/auth-refresh`, {
    ...DEFAULT_CONFIG,
    method: 'POST',
    headers: authHeaders(token),
  });

  return fetch(request).then(handleErrors);
}

/** Create a link; tags are CSV/names — PocketBase resolve_link_tags hook expands them. */
export async function saveLink(values, token) {
  const { link, tags = '', ...rest } = values;
  const body = JSON.stringify({
    ...rest,
    url: link,
    tags,
    archive: false,
  });

  const request = new Request(`${API_URL}/api/collections/links/records`, {
    ...DEFAULT_CONFIG,
    method: 'POST',
    headers: authHeaders(token),
    body,
  });

  return fetch(request).then(handleErrors);
}

export async function getLigo(link, token) {
  if (!token) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const filter = encodeURIComponent(`url="${escapeFilterValue(link)}"`);
  const url = `${API_URL}/api/collections/links/records?filter=${filter}&expand=tags&perPage=50`;

  const request = new Request(url, {
    ...DEFAULT_CONFIG,
    method: 'GET',
    headers: authHeaders(token, false),
  });

  const res = await fetch(request).then(handleErrors);
  const data = await res.json();
  const items = (data.items || []).map(mapLinkRecord);
  return new Response(JSON.stringify(items), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function deleteLink(id, token) {
  const url = `${API_URL}/api/collections/links/records/${id}`;
  const request = new Request(url, {
    ...DEFAULT_CONFIG,
    method: 'DELETE',
    headers: authHeaders(token),
  });
  return fetch(request);
}
