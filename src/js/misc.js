function parseTags(_tags) {
  const tags = _tags.split(',');
  tags.push('fromChrome');
  return tags;
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
