import Ligo from './ligo';
import { getCurrentTabUrl } from './misc';
const css = require('../css/style.styl');

document.addEventListener('DOMContentLoaded', () => {
  getCurrentTabUrl((url) => {
    const ligo = new Ligo(url);
    ligo.init();
  });
});
