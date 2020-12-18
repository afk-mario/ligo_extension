import html from 'choo/html';
import github from 'components/github';
import ellugar from 'components/ellugar';

import './style.css';

const Footer = () => html`
  <footer id="footer">
    <div class="wrapper">
      <a
        class="button -icon"
        href="https://ellugar.co"
        target="_blank"
        rel="noopener"
      >
        ${ellugar()}
      </a>
      <a
        class="button -icon"
        href="https://github.com/afk-mario/ligo_extension"
        target="_blank"
        rel="noopener"
      >
        ${github()}
      </a>
    </div>
  </footer>
`;

export default Footer;
