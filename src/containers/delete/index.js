import html from 'choo/html';

import { deleteLink } from 'lib/api';

import './style.css';

async function handleDelete({ emit, id, token }) {
  emit('message:update', '...');
  await deleteLink(id, token);
  emit('message:clear');
  emit('ligo:refresh');
}

export default ({ emit, state }) => {
  const { ligo, user } = state;
  const { access: token } = user;
  if (ligo.length < 1) return null;
  return html`
    <div id="delete" class="delete">
      ${ligo.map(
        ({ id, name, link, tags, dateCreated }) => html`
          <article class="ligo-row">
            <div className="content">
              <a
                href="${link}"
                class="link"
                target="_blank"
                rel="noopener noreferrer"
                >${name}</a
              >
              <span class="date">${dateCreated}</span>
            </div>
            <footer>
              <ul class="tags">
                ${tags.map(({ tag }) => html`<li>${tag}</li>`)}
              </ul>
              <button
                class="button -s"
                onclick=${() => handleDelete({ emit, id, token })}
              >
                Delete
              </button>
            </footer>
          </article>
        `
      )}
    </div>
  `;
};
