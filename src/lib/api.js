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

function slugify(input) {
  return String(input)
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
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

async function findTagByName(name, token) {
  const filter = encodeURIComponent(`name="${escapeFilterValue(name)}"`);
  const url = `${API_URL}/api/collections/tags/records?filter=${filter}&perPage=1`;
  const request = new Request(url, {
    ...DEFAULT_CONFIG,
    method: 'GET',
    headers: authHeaders(token, false),
  });
  const res = await fetch(request).then(handleErrors);
  const data = await res.json();
  return (data.items && data.items[0]) || null;
}

async function createTag(name, token) {
  const request = new Request(`${API_URL}/api/collections/tags/records`, {
    ...DEFAULT_CONFIG,
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ name }),
  });
  const res = await fetch(request).then(handleErrors);
  return res.json();
}

async function resolveTagIds(tagNames, token) {
  const ids = [];
  for (const raw of tagNames) {
    const name = slugify(raw);
    if (!name) continue;
    let tag = await findTagByName(name, token);
    if (!tag) {
      try {
        tag = await createTag(name, token);
      } catch (err) {
        // Race / unique constraint — re-fetch
        tag = await findTagByName(name, token);
        if (!tag) throw err;
      }
    }
    ids.push(tag.id);
  }
  return ids;
}

export async function saveLink(values, token) {
  const { link, tags: tagNames = [], ...rest } = values;
  const tagIds = await resolveTagIds(tagNames, token);
  const body = JSON.stringify({
    ...rest,
    url: link,
    tags: tagIds,
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
