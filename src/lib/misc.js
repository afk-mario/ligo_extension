export function parseTags(_tags) {
  const tags = _tags.split(',');
  tags.push('fromBrowser');
  return tags;
}

export function getCurrentTabUrl(callback) {
  // https://developer.chrome.com/extensions/tabs#method-query
  const queryInfo = {
    active: true,
    currentWindow: true,
  };

  chrome.tabs.query(queryInfo, tabs => {
    const tab = tabs[0];
    const { url } = tab;
    // console.assert(typeof url == 'string', 'tab.url should be a string');
    callback(url);
  });
}
