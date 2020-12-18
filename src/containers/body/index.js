import html from 'choo/html';

import Login from 'containers/login';
import Ligo from 'containers/add';
import Delete from 'containers/delete';

import './style.css';

export default ({ state, emit }) => {
  const { user } = state;
  const { loggedIn } = user;

  if (!loggedIn) return Login({ emit });
  return html` ${Ligo({ emit, state })} ${Delete({ emit, state })} `;
};
