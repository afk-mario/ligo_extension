import html from 'choo/html';
import github from '~components/github';

import './style.css';

const Footer = () => html`
  <footer id="footer">
    <div class="wrapper">
      <a
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
