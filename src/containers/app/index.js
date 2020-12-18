import html from 'choo/html';

import Body from 'containers/body';

import Header from 'components/header';
import Footer from 'components/footer';
import Message from 'components/message';

import './reset.css';
import './variables.css';
import './style.css';
import 'components/input/style.css';

const App = (state, emit) => {
  const { message } = state;

  return html`
    <body>
      ${Header({ emit, state })}
      ${message ? Message({ message }) : Body({ state, emit })} ${Footer()}
    </body>
  `;
};

export default App;
