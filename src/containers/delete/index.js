import html from 'choo/html';

import { deleteLink } from 'lib/misc';

import './style.css';

async function handleDelete({ emit, id, token }) {
  await deleteLink(id, token);
  emit('ligo:refresh');
}

export default ({ emit, state }) => {
  const { ligo, user } = state;
  const { access: token } = user;
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
                onClick="${() => handleDelete({ emit, id, token })}"
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
