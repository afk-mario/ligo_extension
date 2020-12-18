import html from 'choo/html';

import './style.css';

export default ({ message }) => {
  if (!message) return null;
  return html`
    <section class="message">
      <div class="wrapper">
        <h1>${message}</h1>
      </div>
    </section>
  `;
};
