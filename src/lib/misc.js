// /* eslint-disable */
// const browser = browser || null;
// const chrome = chrome || null;
// /* eslint-enable */

export function parseTags(_tags) {
  if (_tags == null) return [];
  const tags = _tags.split(',').filter(Boolean);
  tags.push('fromBrowser');
  return tags;
}

export function getCurrentTabUrl(callback) {
  // https://developer.chrome.com/extensions/tabs#method-query
  const queryInfo = {
    active: true,
    currentWindow: true,
  };

  if (chrome == null) {
    callback('');
  } else {
    chrome.tabs.query(queryInfo, tabs => {
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
  if (browser == null) {
    return new Promise(resolve => {
      const result = [];
      arr.forEach(e => {
        result.push(localStorage.getItem(e));
      });
      resolve(result);
    });
  }

  return browser.storage.local.get(arr);
}

export function saveOptions(data) {
  if (browser == null) {
    return new Promise(resolve => {
      Object.entries(data).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });
      resolve();
    });
  }

  return browser.storage.local.set(data);
}

export function removeOptions(arr) {
  if (browser == null) {
    arr.forEach(e => {
      localStorage.removeItem(e);
    });
  } else {
    arr.forEach(e => {
      browser.storage.local.remove(e);
    });
  }
}

export async function verifyToken(token) {
  console.log('verifyToken', token);
  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  const body = JSON.stringify({ token });
  const request = new Request('https://api.ellugar.co/token/verify/', {
    method: 'POST',
    redirect: 'follow',
    mode: 'cors',
    headers,
    body,
  });

  const res = await fetch(request);
  return res.json();
}

export async function refreshToken(refresh) {
  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  const body = JSON.stringify({ refresh });
  const request = new Request('https://api.ellugar.co/token/refresh/', {
    method: 'POST',
    redirect: 'follow',
    mode: 'cors',
    headers,
    body,
  });

  const res = await fetch(request);
  return res.json();
}

export async function restoreOptions(emitter) {
  console.log('restoring options...');
  try {
    const data = await getOptions(['access', 'refresh']);
    const { access, refresh } = data;

    if (access != null && refresh != null) {
      const verify = await verifyToken(access.access);
      console.log('verify', verify);

      if (Object.keys(verify).length === 0) {
        emitter.emit('user:login', data);
      } else {
        const nAccess = await refreshToken(refresh);
        saveOptions({ access: nAccess.access });
        emitter.emit('user:login', {
          access: nAccess.access,
          refresh: data.refresh,
        });
        console.log('nAccess', nAccess);
      }
    } else {
      emitter.emit('user:logout');
    }
  } catch (err) {
    console.error(err);
  }
}
