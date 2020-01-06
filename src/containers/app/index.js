import html from 'choo/html';
import { API_URL } from '~lib/constants';
import './variables.css';
import './style.css';

import {
  login,
  removeOptions,
  saveOptions,
  formDataToObject,
  parseTags,
} from '~lib/misc';

import Header from '~components/header';
import Footer from '~components/footer';
import Message from '~components/message';
import Ligo from '../add';
import Login from '~containers/login';

const App = (state, emit) => {
  function logOut(e) {
    e.preventDefault();
    removeOptions(['access', 'refresh']);
    emit('user:logout');
  }

  async function handleLogin(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const body = formDataToObject(data);

    emit('message:update', 'login...');

    try {
      const res = await login(body);
      const { access, refresh } = res;
      await saveOptions({ access, refresh });
      emit('message:clear');
      emit('user:login', { refresh, access });
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAdd(e) {
    const { user } = state;

    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const parsed = formDataToObject(data);
    const tags = parseTags(parsed.tags);
    const body = JSON.stringify({
      ...parsed,
      tags,
    });

    const headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user.access}`,
    });

    const request = new Request(`${API_URL}/ligoj/link/`, {
      method: 'POST',
      redirect: 'follow',
      mode: 'cors',
      headers,
      body,
    });

    emit('message:update', 'sending...');

    try {
      const res = await fetch(request);
      emit('message:update', `${res.status} - ${res.statusText}`);
      setTimeout(() => {
        emit('message:clear');
      }, 3000);
    } catch (err) {
      console.error(err);
    }
  }

  const { user, message, tabUrl } = state;
  const { loggedIn } = user;

  const Msg = message != null ? Message(message) : null;
  const Body = loggedIn ? Ligo(tabUrl, handleAdd) : Login(handleLogin);
  const Content = Msg || Body;

  return html`
    <body>
      ${Header({ logOut, loggedIn })} ${Content} ${Footer()}
    </body>
  `;
};

export default App;
