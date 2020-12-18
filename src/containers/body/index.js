import Login from 'containers/login';
import Ligo from 'containers/add';
import Delete from 'containers/delete';

import './style.css';

export default ({ state, emit }) => {
  const { user, ligo } = state;
  const { loggedIn } = user;

  if (!loggedIn) return Login({ emit });
  if (ligo.length > 0) return Delete({ emit, state });
  return Ligo({ emit, state });
};
