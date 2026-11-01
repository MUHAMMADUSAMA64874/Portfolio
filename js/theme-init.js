// Applies the saved / preferred theme before first paint (external so strict CSPs allow it).
(function () {
  try {
    var t = localStorage.getItem('portfolio-theme') || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.documentElement.dataset.theme = t;
  } catch (e) {}
})();
