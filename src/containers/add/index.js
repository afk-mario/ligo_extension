import html from 'choo/html';

import './style.css';

export default (link, onSubmit) => html`
  <form id="add" onsubmit=${onSubmit}>
    <input name="link" placeholder="url" type="url" value=${link} required />
    <input name="tags" placeholder="tags" type="text" />
    <input class="button blue" type="submit" value="Save" />
  </form>
`;
