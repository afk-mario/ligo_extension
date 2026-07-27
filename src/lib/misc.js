import { authRefresh } from 'lib/api';

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
    const options = await getOptions(['token']);
    const { token } = options;

    if (!token) {
      emitter.emit('user:logout');
      return;
    }

    try {
      const res = await authRefresh(token);
      const json = await res.json();
      const nextToken = json.token;
      await saveOptions({ token: nextToken });
      emitter.emit('message:clear');
      emitter.emit('user:login', { token: nextToken });
    } catch {
      await removeOptions(['token']);
      emitter.emit('user:logout');
    }
  } catch (err) {
    console.error(err);
  }
}
