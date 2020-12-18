import html from 'choo/html';
import './style.css';

export default (icon, onclick) => html`
  <button class="button -icon" onclick=${onclick}>
    <i class="material-icons">${icon}</i>
  </button>
`;
