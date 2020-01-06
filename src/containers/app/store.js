import { getCurrentTabUrl, restoreOptions } from '~lib/misc';

export default (state, emitter) => {
  state.user = {
    refresh: null,
    access: null,
    loggedIn: false,
  };

  state.message = null;
  state.tabUrl = null;

  emitter.on('DOMContentLoaded', () => {
    restoreOptions(emitter);
    getCurrentTabUrl(tabUrl => {
      state.tabUrl = tabUrl;
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

    emitter.on('message:update', message => {
      state.message = message;
      emitter.emit('render');
    });
  });
};
