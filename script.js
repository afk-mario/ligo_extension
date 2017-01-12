function reset() {
  location.reload(true);
}

function resetToken() {
  localStorage.removeItem('token.afk');
  reset();
}

function submitToken() {
  const token = document.getElementById('token').value;
  localStorage.setItem('token.afk', token);
  document.getElementById('submitLink').value = 'submited';
  reset();
}

function parseTags(_tags) {
  const tags = _tags.split(',');
  tags.push('fromChrome');
  return tags;
}

function submitLink(token) {
  const tokenHeader = `Token ${token}!`;
  const headers = new Headers({
    'Content-Type': 'application/json',
    Authorization: tokenHeader,
  });
  const request = new Request('https://api.arlefreak.com/ligoj/link/', {
    method: 'POST',
    redirect: 'follow',
    mode: 'cors',
    headers,
    body: JSON.stringify({
      link: document.getElementById('url').value,
      tags: parseTags(document.getElementById('tags').value),
    }),
  });

  fetch(request).then((res) => {
    document.getElementById('submitLink').value = 'submited';
  });
}

function getCurrentTabUrl(callback) {
  // https://developer.chrome.com/extensions/tabs#method-query
  const queryInfo = {
    active: true,
    currentWindow: true,
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    const tab = tabs[0];
    const url = tab.url;
    // console.assert(typeof url == 'string', 'tab.url should be a string');
    callback(url);
  });
}

function init(url) {
  const token = localStorage.getItem('token.afk');
  const submitButtonLink = document.getElementById('submitLink');
  const submitButtonToken = document.getElementById('submitToken');
  const urlField = document.getElementById('url');
  const resetTokenButton = document.getElementById('reset-token');
  const submitLinkForm = document.getElementById('submitLinkForm');
  const submitTokenForm = document.getElementById('submitTokenForm');

  urlField.value = url;
  resetTokenButton.addEventListener('click', resetToken);

  if (token) {
    submitLinkForm.className = '';
    submitTokenForm.className = 'hidden';
    submitButtonLink.addEventListener('click', () => {
      submitLink(token);
    });
  } else {
    submitLinkForm.className = 'hidden';
    submitTokenForm.className = '';

    submitButtonToken.addEventListener('click', () => {
      submitToken();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  getCurrentTabUrl((url) => {
    init(url);
  });
});
