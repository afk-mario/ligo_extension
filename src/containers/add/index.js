import html from 'choo/html';

import { saveLink } from 'lib/api';
import { parseTags, formDataToObject } from 'lib/misc';

import './style.css';

async function handleAdd(e, emit, state) {
  const { user } = state;

  e.preventDefault();
  const form = e.currentTarget;
  const formData = new FormData(form);
  const parsed = formDataToObject(formData);
  const tags = parseTags(parsed.tags);
  const values = { ...parsed, tags };

  try {
    emit('message:update', 'sending...');
    const res = await saveLink(values, user.access);
    emit('message:update', `[${res.status}] ${res.statusText}`);
    emit('ligo:refresh');
    setTimeout(() => {
      emit('message:clear');
    }, 2000);
  } catch (err) {
    emit('message:update', err.message);
    setTimeout(() => {
      emit('message:clear');
    }, 2000);
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
