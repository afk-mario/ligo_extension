document.addEventListener('DOMContentLoaded', () => {
  getCurrentTabUrl((url) => {
    const ligo = new Ligo(url);
    ligo.init();
  });
});
