import choo from 'choo';

import App from 'containers/app';
import Store from 'containers/app/store';

const app = choo();

app.use(Store);
app.route('*', App);
app.mount('body');
