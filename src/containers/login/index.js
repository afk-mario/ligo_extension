import html from 'choo/html';

import { login } from 'lib/api';
import { saveOptions, formDataToObject } from 'lib/misc';

import './style.css';

async function handleLogin(e, emit) {
  e.preventDefault();
  const form = e.currentTarget;
  const data = new FormData(form);
  const body = formDataToObject(data);

  emit('message:update', 'loading');

  try {
    const res = await login(body);
    const json = await res.json();
    const { token } = json;
    await saveOptions({ token });
    emit('message:clear');
    emit('user:login', { token });
  } catch (err) {
    emit('message:update', err.message);
    setTimeout(() => {
      emit('message:clear');
    }, 3000);
    console.error(err);
  }
}

const Login = ({ emit }) => html`
  <form id="login" onsubmit=${(e) => handleLogin(e, emit)}>
    <input
      id="username"
      name="username"
      placeholder="email"
      type="text"
      required
      autocomplete="username"
    />
    <input
      id="password"
      name="password"
      type="password"
      placeholder="***"
      required
      autocomplete="current-password"
    />
    <button class="button blue" type="submit">enter</button>
  </form>
`;

export default Login;
