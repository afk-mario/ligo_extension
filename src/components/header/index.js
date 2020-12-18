import html from 'choo/html';

import { removeOptions } from 'lib/misc';

import ButtonIcon from 'components/button-icon';

import './style.css';

function logOut(e, emit) {
  e.preventDefault();
  removeOptions(['access', 'refresh']);
  emit('user:logout');
}

async function build(emit) {
  await fetch('https://api.netlify.com/build_hooks/5fdd1177d43be400d1c1695f', {
    body: '{}',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
  });
  emit('message:update', 'Building ...');
  setTimeout(() => {
    emit('message:clear');
  }, 3000);
}

const Header = ({ state, emit }) => {
  const { user } = state;
  const { loggedIn } = user;
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
        ${loggedIn ? ButtonIcon('publish', () => build(emit)) : null}
        ${loggedIn ? ButtonIcon('logout', (e) => logOut(e, emit)) : ''}
      </div>
    </header>
  `;
};

export default Header;
