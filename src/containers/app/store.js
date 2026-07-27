import { getLigo } from 'lib/api';
import { getCurrentTabUrl, restoreOptions } from 'lib/misc';

export default (state, emitter) => {
  state.user = {
    token: null,
    loggedIn: false,
  };

  state.message = 'loading';
  state.tabUrl = null;
  state.ligo = [];

  emitter.on('DOMContentLoaded', () => {
    restoreOptions(emitter);

    emitter.on('ligo:refresh', async () => {
      if (!state.tabUrl || !state.user.token) {
        state.ligo = [];
      } else {
        const res = await getLigo(state.tabUrl, state.user.token);
        const data = await res.json();
        state.ligo = data;
      }
      emitter.emit('render');
    });

    emitter.on('user:login', ({ token }) => {
      state.user.token = token;
      state.user.loggedIn = true;
      emitter.emit('ligo:refresh');
      emitter.emit('render');
    });

    emitter.on('user:logout', () => {
      state.user.token = null;
      state.user.loggedIn = false;
      state.message = null;
      emitter.emit('render');
    });

    emitter.on('message:clear', () => {
      state.message = null;
      emitter.emit('render');
    });

    emitter.on('message:update', (message) => {
      state.message = message;
      emitter.emit('render');
    });

    getCurrentTabUrl((tabUrl) => {
      state.tabUrl = tabUrl;
      emitter.emit('ligo:refresh');
      emitter.emit('render');
    });
  });
};
