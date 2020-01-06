import html from 'choo/html';
import './variables.css';
import './style.css';

import {
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

  function handleLogin(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const body = JSON.stringify(formDataToObject(data));

    const headers = new Headers({
      'Content-Type': 'application/json',
    });

    const request = new Request('https://api.ellugar.co/token/', {
      method: 'POST',
      redirect: 'follow',
      mode: 'cors',
      headers,
      body,
    });

    emit('message:update', 'login...');
    fetch(request)
      .then(res => {
        return res.json();
      })
      .then(({ access, refresh }) => {
        saveOptions({ access, refresh }).then(() => {
          emit('message:clear');
          emit('user:login', { refresh, access });
        });
      });
  }

  function handleAdd(e) {
    const { user } = state;

    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const parsed = formDataToObject(data);
    console.log('parsed', parsed);
    const tags = parseTags(parsed.tags);
    const body = JSON.stringify({
      ...parsed,
      tags,
    });

    console.log('Add Link', user.access);

    const headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user.access}`,
    });

    const request = new Request('https://api.ellugar.co/ligoj/link/', {
      method: 'POST',
      redirect: 'follow',
      mode: 'cors',
      headers,
      body,
    });

    emit('message:update', 'sending...');

    fetch(request).then(res => {
      emit('message:update', `${res.status} - ${res.statusText}`);
    });
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
