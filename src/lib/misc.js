import { TOKEN_STATUS_VALID, TOKEN_STATUS_REFRESH } from 'lib/constants';

import { refreshToken, verifyToken } from 'lib/api';

export function parseTags(tags = '') {
  return ['fromBrowser', ...tags.split(',').filter(Boolean)];
}

export function getCurrentTabUrl(callback) {
  // https://developer.chrome.com/extensions/tabs#method-query
  const queryInfo = {
    active: true,
    currentWindow: true,
  };

  if (typeof chrome === 'undefined') {
    callback('');
  } else {
    chrome.tabs.query(queryInfo, (tabs) => {
      const tab = tabs[0];
      const { url } = tab;
      // console.assert(typeof url == 'string', 'tab.url should be a string');
      callback(url);
    });
  }
}

export function formDataToObject(data) {
  const body = {};
  data.forEach((value, key) => {
    body[key] = value;
  });
  return body;
}

export function getOptions(arr) {
  if (typeof browser === 'undefined') {
    return new Promise((resolve) => {
      const result = arr.reduce(
        (acc, e) => ({ ...acc, [e]: localStorage.getItem(e) }),
        {}
      );
      resolve(result);
    });
  }

  return browser.storage.local.get(arr);
}

export function saveOptions(data) {
  if (typeof browser === 'undefined') {
    return new Promise((resolve) => {
      Object.entries(data).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });
      resolve();
    });
  }

  return browser.storage.local.set(data);
}

export function removeOptions(arr) {
  if (typeof browser === 'undefined') {
    arr.forEach((e) => {
      localStorage.removeItem(e);
    });
  } else {
    arr.forEach((e) => {
      browser.storage.local.remove(e);
    });
  }
}

export async function restoreOptions(emitter) {
  try {
    const options = await getOptions(['access', 'refresh']);
    const { access, refresh } = options;

    try {
      const verify = await verifyToken(access);
      emitter.emit('message:clear');

      switch (verify) {
        case TOKEN_STATUS_VALID:
          emitter.emit('user:login', options);
          break;
        case TOKEN_STATUS_REFRESH: {
          const { access: nAccess } = await refreshToken(refresh);
          saveOptions({ access: nAccess });
          emitter.emit('user:login', {
            access: nAccess,
            refresh,
          });
          break;
        }
        default:
          throw new Error('Token invalid');
      }
    } catch (e) {
      emitter.emit('user:logout');
    }
  } catch (err) {
    console.error(err);
  }
}
