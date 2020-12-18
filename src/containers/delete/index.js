import html from 'choo/html';

import { deleteLink } from 'lib/misc';

import ButtonIcon from 'components/button-icon';

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
        ({ id, link, tags, dateCreated }) => html`
          <article class="ligo-row">
            <div className="content">
              <span class="link">${link}</span>
              <span class="date">${dateCreated}</span>
            </div>
            <footer>
              <ul class="tags">
                ${tags.map(({ tag }) => html`<li>${tag}</li>`)}
              </ul>
              ${ButtonIcon('delete', () => handleDelete({ emit, id, token }))}
            </footer>
          </article>
        `
      )}
    </div>
  `;
};
