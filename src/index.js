import choo from 'choo';

import App from 'containers/app';
import Store from 'containers/app/store';

const app = choo();

if (process.env.NODE_ENV !== 'production') {
  const devtools = require('choo-devtools'); // eslint-disable-line
  app.use(devtools());
}

app.use(Store);
app.route('*', App);
app.mount('body');
