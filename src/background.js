import { getCurrentTabUrl } from '~lib/misc';

function clearBadge() {
  browser.browserAction.setBadgeText({ text: '' });
}

function setBadge(n) {
  browser.browserAction.setBadgeText({ text: `${n}` });
  browser.browserAction.setBadgeBackgroundColor({ color: '#0c0c0d' });
  browser.browserAction.setBadgeTextColor({ color: '#98d1cf' });
}

function getLigoCount(link) {
  const url = `https://api.ellugar.co/ligoj/link/?link=${encodeURIComponent(
    link
  )}`;

  const request = new Request(url, {
    method: 'GET',
    redirect: 'follow',
    mode: 'cors',
  });

  fetch(request)
    .then(res => {
      return res.json();
    })
    .then(res => {
      if (res.length < 1) {
        clearBadge();
      } else {
        setBadge(res.length);
      }
    });
}

function handleActivated() {
  clearBadge();
  getCurrentTabUrl(url => {
    getLigoCount(url);
  });
}

function handleUpdated(tabId, changeInfo) {
  if (changeInfo.url) {
    getLigoCount(changeInfo.url);
  }
}

handleActivated();
browser.tabs.onActivated.addListener(handleActivated);
browser.tabs.onUpdated.addListener(handleUpdated);
