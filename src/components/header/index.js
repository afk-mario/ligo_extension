import html from 'choo/html';
import MaterialIcon from '~components/material-button';

import './style.css';

const Header = ({ logOut, loggedIn }) => {
  return html`
    <header id="header">
      <div class="wrapper">
        <a
          class="ellugar"
          href="https://ellugar.co/ligo"
          target="_blank"
          rel="noopener"
        >
          <h1>ligo</h1>
        </a>
        ${loggedIn ? MaterialIcon('logout', logOut) : ''}
      </div>
    </header>
  `;
};

export default Header;
