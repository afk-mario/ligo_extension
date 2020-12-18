import html from 'choo/html';

import Body from 'containers/body';

import Header from 'components/header';
import Footer from 'components/footer';
import Message from 'components/message';

import 'components/input/style.css';
import 'components/button/style.css';

import './reset.css';
import './variables.css';
import './style.css';

const App = (state, emit) => {
  const { message } = state;

  return html`
    <body>
      ${Header({ emit, state })}
      <main>${message ? Message({ message }) : Body({ state, emit })}</main>
      ${Footer()}
    </body>
  `;
};

export default App;
