import { getCurrentTabUrl, restoreOptions, getLigo } from 'lib/misc';

export default (state, emitter) => {
  state.user = {
    refresh: null,
    access: null,
    loggedIn: false,
  };

  state.message = null;
  state.tabUrl = null;
  state.ligo = [];

  emitter.on('DOMContentLoaded', () => {
    restoreOptions(emitter);

    emitter.on('ligo:refresh', async () => {
      if (!state.tabUrl) {
        state.ligo = [];
      } else {
        const res = await getLigo(state.tabUrl);
        state.ligo = res;
      }
      emitter.emit('render');
    });

    emitter.on('user:login', ({ access, refresh }) => {
      state.user.access = access;
      state.user.refresh = refresh;
      state.user.loggedIn = true;
      emitter.emit('render');
    });

    emitter.on('user:logout', () => {
      state.user.access = null;
      state.user.refresh = null;
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
