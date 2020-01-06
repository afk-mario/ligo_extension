import html from 'choo/html';
import './style.css';

const Login = onSubmit => {
  return html`
    <form id="login" onsubmit=${onSubmit}>
      <input
        value="arlefreak"
        id="username"
        name="username"
        placeholder="afk"
        type="text"
        required
      />
      <input
        value="mytholog-ott-stinkpot-lemming-farrago"
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
