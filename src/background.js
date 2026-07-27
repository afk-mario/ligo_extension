import { getLigo } from 'lib/api';
import { getCurrentTabUrl } from 'lib/misc';

function clearBadge() {
  browser.browserAction.setBadgeText({ text: '' });
}

function setBadge(n) {
  browser.browserAction.setBadgeText({ text: `${n}` });
  browser.browserAction.setBadgeBackgroundColor({ color: '#0c0c0d' });
  browser.browserAction.setBadgeTextColor({ color: '#98d1cf' });
}

async function getToken() {
  const { token } = await browser.storage.local.get(['token']);
  return token || null;
}

async function setBadgeCount(link) {
  try {
    const token = await getToken();
    if (!token || !link) {
      clearBadge();
      return;
    }
    const res = await getLigo(link, token);
    const data = await res.json();
    if (data.length < 1) {
      clearBadge();
    } else {
      setBadge(data.length);
    }
  } catch (err) {
    clearBadge();
    console.error(err);
  }
}

function handleActivated() {
  clearBadge();
  getCurrentTabUrl((url) => {
    setBadgeCount(url);
  });
}

function handleUpdated(tabId, changeInfo) {
  if (changeInfo.url) {
    setBadgeCount(changeInfo.url);
  }
}

handleActivated();
browser.tabs.onActivated.addListener(handleActivated);
browser.tabs.onUpdated.addListener(handleUpdated);

browser.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.token) {
    handleActivated();
  }
});
