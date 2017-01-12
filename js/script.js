document.addEventListener('DOMContentLoaded', () => {
  getCurrentTabUrl((url) => {
    const ligoj = new Ligoj(url);
    ligoj.init();
  });
});
