import html from 'choo/html';

import { API_URL } from 'lib/constants';
import { parseTags, formDataToObject } from 'lib/misc';

import './style.css';

async function handleAdd(e, emit, state) {
  const { user } = state;

  e.preventDefault();
  const form = e.currentTarget;
  const data = new FormData(form);
  const parsed = formDataToObject(data);
  const tags = parseTags(parsed.tags);
  const body = JSON.stringify({
    ...parsed,
    tags,
  });

  const headers = new Headers({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${user.access}`,
  });

  const request = new Request(`${API_URL}/ligoj/link/`, {
    method: 'POST',
    redirect: 'follow',
    mode: 'cors',
    headers,
    body,
  });

  emit('message:update', 'sending...');

  try {
    const res = await fetch(request);
    emit('message:update', `[${res.status}] ${res.statusText}`);
    setTimeout(() => {
      emit('message:clear');
    }, 2000);
  } catch (err) {
    console.error(err);
  }
}

export default ({ emit, state }) => {
  const { tabUrl } = state;

  return html`
    <form id="add" onsubmit=${(e) => handleAdd(e, emit, state)}>
      <input
        name="link"
        placeholder="url"
        type="url"
        value=${tabUrl}
        required
      />
      <input name="tags" placeholder="tags" type="text" />
      <button class="button" type="submit">Save</button>
    </form>
  `;
};
