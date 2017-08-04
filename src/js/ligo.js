import { parseTags } from './misc';

const LigoState = {
  TOKEN: 0,
  LINK: 1,
  RESPONSE: 2,
};

export default class Ligo {
  constructor(url) {
    this.url = url;
    this.token = localStorage.getItem('token.afk');
    this.bttSubmitLink = document.getElementById('submitLink');
    this.bttSubmitToken = document.getElementById('submitToken');
    this.bttResetToken = document.getElementById('reset-token');
    this.fldUrl = document.getElementById('url');
    this.fldTags = document.getElementById('tags');
    this.fldToken = document.getElementById('token');
    this.frmSubmitLink = document.getElementById('submitLinkForm');
    this.frmSubmitToken = document.getElementById('submitTokenForm');
    this.sectResponse = document.getElementById('response');
    this.pResTitle = document.getElementById('response-title');
    this.pResBody = document.getElementById('response-body');
  }

  init() {
    this.setValues();
    this.setEvents();

    if (this.token) {
      this.updateState(LigoState.LINK);
      this.bttSubmitLink.addEventListener('click', () => {
        this.submitLink();
      });
    } else {
      this.updateState(LigoState.TOKEN);
      this.bttSubmitToken.addEventListener('click', () => {
        this.submitToken();
      });
    }
  }

  changeView() {
    this.frmSubmitToken.className = 'hidden';
    this.frmSubmitLink.className = 'hidden';
    this.sectResponse.className = 'hidden';

    switch (this.state) {
      case LigoState.TOKEN:
        this.frmSubmitToken.className = '';
        break;
      case LigoState.LINK:
        this.frmSubmitLink.className = '';
        break;
      case LigoState.RESPONSE:
        this.sectResponse.className = '';
        break;
      default:
        break;
    }
  }

  updateResponse(res) {
    if (res.ok) {
      this.pResTitle.innerHTML = 'Success';
    } else {
      this.pResTitle.innerHTML = 'Failed';
    }
    console.log(res);
    this.pResBody.innerHTML = res.statusText;
  }

  updateState(state) {
    console.log('state: ' + state);
    this.state = state;
    this.changeView();
  }

  setValues() {
    this.fldUrl.value = this.url;
    this.state = LigoState.TOKEN;
  }

  setEvents() {
    this.bttResetToken.addEventListener('click', this.resetToken);
  }

  resetToken() {
    localStorage.removeItem('token.afk');
    this.reset();
  }

  reset() {
    location.reload(true);
  }

  submitToken() {
    this.token = this.fldToken.value;
    localStorage.setItem('token.afk', this.token);
    this.reset();
  }

  submitLink() {
    const tokenHeader = `Token ${this.token}`;
    const headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: tokenHeader,
    });

    const request = new Request('https://api.ellugar.co/ligoj/link/', {
      method: 'POST',
      redirect: 'follow',
      mode: 'cors',
      headers,
      body: JSON.stringify({
        link: this.fldUrl.value,
        tags: parseTags(this.fldTags.value),
      }),
    });

    this.updateState(LigoState.RESPONSE);

    fetch(request).then((res) => {
      this.updateResponse(res);
    });
  }
}
