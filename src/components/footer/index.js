import html from 'choo/html';

import ellugar from '~components/ellugar';
import './style.css';

export default () => html`
  <footer id="footer">
    <div class="wrapper">
      <h1>busca</h1>
      <a
        class="ellugar"
        href="https://ellugar.co/ligo"
        target="_blank"
        rel="noopener"
      >
        ${ellugar()}
      </a>
    </div>
  </footer>
`;
