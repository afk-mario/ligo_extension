import html from 'choo/html';
import MaterialIcon from '../material-button';

import './style.css';

export default () => html`
  <header id="header">
    <div class="wrapper">
      <h1>ligo</h1>
      ${MaterialIcon('settings', e => {
        e.preventDefault();
        console.log('settings');
        browser.runtime.openOptionsPage();
      })}
    </div>
  </header>
`;
