import html from 'choo/html';
import './variables.css';
import './style.css';

import { parseTags } from '../../lib/misc';
import Header from '../../components/header';
import Footer from '../../components/footer';
import Message from '../../components/message';
import Ligo from '../add';

export default function app(state, emit) {
  function updateUrl(e) {
    emit('url:update', e.target.value);
  }

  function updateTags(e) {
    emit('tags:update', e.target.value);
  }

  function submit() {
    const { url, tags, token } = state;
    const tokenHeader = `Token ${token}`;
    const headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: tokenHeader,
    });

    const request = new Request('https://api.ellugar.co/ligoj/link/', {
      method: 'POST',
      redirect: 'follow',
      mode: 'cors',
      headers,
      body: JSON.stringify({
        link: url,
        tags: parseTags(tags),
      }),
    });

    emit('message:update', 'sending...');

    fetch(request).then(res => {
      emit('message:update', `${res.status} - ${res.statusText}`);
    });
  }

  const { url, tags, message } = state;

  const messageBlank = typeof message === 'undefined' || !message;
  const content = messageBlank
    ? Ligo({ url, tags, updateUrl, updateTags, submit })
    : Message(message);

  return html`
    <body>
      ${Header()} ${content} ${Footer()}
    </body>
  `;
}
