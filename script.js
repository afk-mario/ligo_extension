function reset(){
    location.reload(true);
}

function resetToken(){
    console.log('resetToken');
    localStorage.removeItem('token.afk');
    reset();
}

function init(url){
    console.log('started script');
    document.getElementById('url').value = url;
    document.getElementById('reset-token').addEventListener('click', resetToken);
    var token = localStorage.getItem('token.afk');

    if(token){
        document.getElementById('submitLinkForm').className = '';
        document.getElementById('submitTokenForm').className = 'hidden';

        var submitButton = document.getElementById('submitLink');
        submitButton.addEventListener('click', ()=>{
            submitLink(token);
        });
    }else{
        document.getElementById('submitLinkForm').className = 'hidden';
        document.getElementById('submitTokenForm').className = '';

        var submitButton = document.getElementById('submitToken');
        submitButton.addEventListener('click', ()=>{
            submitToken();
        });
    }
}

function submitToken(){
    var token = document.getElementById('token').value;
    localStorage.setItem('token.afk', token);
    document.getElementById('submitLink').value = 'submited';
    reset();
}

function submitLink(token){
    var tokenHeader = 'Token ' + token;
    console.log('submitLink token: ' + tokenHeader);
    var headers = new Headers();
    var request = new Request('https://api.arlefreak.com/ligoj/link/', {
        method: 'POST',
        redirect: 'follow',
        mode: 'cors',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token  
        }),
        body: JSON.stringify({
            link: document.getElementById('url').value,
            tags: parseTags(document.getElementById('tags').value)
        })
    });

    fetch(request).then((res)=> {
        console.log(res);
        document.getElementById('submitLink').value = 'submited';
        {/* reset(); */}
    });
}

function parseTags(_tags){
    var tags = _tags.split(',');
    tags.push('fromChrome');
    return tags;
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

document.addEventListener('DOMContentLoaded', function() {
    getCurrentTabUrl(function(url) {
        init(url);
    });
});
