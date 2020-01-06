import html from 'choo/html';
import './style.css';

const Login = onSubmit => {
  return html`
    <form id="login" onsubmit=${onSubmit}>
      <input
        id="username"
        name="username"
        placeholder="afk"
        type="text"
        required
        autocomplete="off"
      />
      <input
        id="password"
        name="password"
        type="password"
        placeholder="***"
        required
      />
      <input class="button blue" type="submit" value="Login" />
    </form>
  `;
};

export default Login;
