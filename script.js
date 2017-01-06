function init(url){
    console.log('started script');
    document.getElementById('url').value = url;
    var submitButton = document.getElementById('submitLink');
    submitButton.addEventListener('click', submitLink);
}

function getCurrentTabUrl(callback) {
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
    console.assert(typeof url == 'string', 'tab.url should be a string');
    callback(url);
  });
}

function submitLink(){
    console.log('submit');
    var headers = new Headers();

    var request = new Request('https://api.arlefreak.com/ligoj/link/', {
        method: 'POST',
        redirect: 'follow',
        mode: 'cors',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Token TOKEN'
        }),
        body: JSON.stringify({
            link: document.getElementById('url').value,
            tags: parseTags(document.getElementById('tags').value)
        })
    });

    fetch(request).then((res)=> {
        console.log(res);
    });
}

function parseTags(_tags){
    var tags = _tags.split(',');
    tags.push('fromChrome');
    return tags;
}

document.addEventListener('DOMContentLoaded', function() {
    getCurrentTabUrl(function(url) {
        init(url);
    });
});
