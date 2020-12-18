import html from 'choo/html';

import { login, saveOptions, formDataToObject } from 'lib/misc';

import './style.css';

async function handleLogin(e, emit) {
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

const Login = ({ emit }) => html`
  <form id="login" onsubmit=${(e) => handleLogin(e, emit)}>
    <input
      id="username"
      name="username"
      placeholder="afk"
      type="text"
      required
      autocomplete="off"
      value="arlefreak"
    />
    <input
      id="password"
      name="password"
      type="password"
      value="mytholog-ott-stinkpot-lemming-farrago"
      placeholder="***"
      required
    />
    <input class="button blue" type="submit" value="Login" />
  </form>
`;

export default Login;
