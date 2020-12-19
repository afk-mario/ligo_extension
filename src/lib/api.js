import {
  TOKEN_STATUS_VALID,
  TOKEN_STATUS_REFRESH,
  TOKEN_STATUS_INVALID,
  API_URL,
} from 'lib/constants';

export const DEFAULT_CONFIG = {
  redirect: 'follow',
  mode: 'cors',
  credentials: 'omit',
};

export function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

export async function verifyToken(token) {
  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  const body = JSON.stringify({ token });
  const request = new Request(`${API_URL}/token/verify/`, {
    ...DEFAULT_CONFIG,
    method: 'POST',
    headers,
    body,
  });

  const res = await fetch(request).then(handleErrors);
  const verify = await res.json();
  if (Object.keys(verify).length === 0) return TOKEN_STATUS_VALID;
  if (
    {}.hasOwnProperty.call(verify, 'code') &&
    verify.code === 'token_not_valid'
  )
    return TOKEN_STATUS_REFRESH;
  return TOKEN_STATUS_INVALID;
}

export async function refreshToken(refresh) {
  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  const body = JSON.stringify({ refresh });
  const request = new Request(`${API_URL}/token/refresh/`, {
    ...DEFAULT_CONFIG,
    method: 'POST',
    headers,
    body,
  });

  return fetch(request).then(handleErrors);
}

export async function login(props) {
  const body = JSON.stringify(props);
  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  const request = new Request(`${API_URL}/token/`, {
    ...DEFAULT_CONFIG,
    method: 'POST',
    headers,
    body,
  });

  return fetch(request).then(handleErrors);
}

export async function saveLink(values, token) {
  const body = JSON.stringify(values);
  const headers = new Headers({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  });

  const request = new Request(`${API_URL}/ligoj/link/`, {
    ...DEFAULT_CONFIG,
    method: 'POST',
    headers,
    body,
  });

  return fetch(request).then(handleErrors);
}

export async function getLigo(link) {
  const url = `${API_URL}/ligoj/link/?link=${encodeURIComponent(link)}`;

  const request = new Request(url, {
    ...DEFAULT_CONFIG,
    method: 'GET',
  });

  return fetch(request).then(handleErrors);
}

export async function deleteLink(id, token) {
  const url = `${API_URL}/ligoj/link/${id}`;
  const headers = new Headers({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  });

  const request = new Request(url, {
    ...DEFAULT_CONFIG,
    method: 'DELETE',
    headers,
  });
  return fetch(request);
}
