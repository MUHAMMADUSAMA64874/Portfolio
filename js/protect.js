// Content protection and basic hardening, loaded on every page.
// - Screenshots, certificates and photos can't be right-clicked, dragged or selected.
// - Copying a large block of text appends a credit line with the source URL.
// - Contact details and CV text stay selectable so recruiters can copy them.
// - The site refuses to run inside another site's frame (clickjacking).
(function () {
  'use strict';

  // Clickjacking: break out of foreign frames (the museum frames its own pages, same origin).
  try {
    if (window.top !== window.self && window.top.location.origin !== window.location.origin) {
      window.top.location = window.location.href;
    }
  } catch (e) {
    window.top.location = window.location.href;
  }

  var PROTECTED = 'img, picture, video, canvas, svg image, .card, .feat, .deck, .cert-media, .about-photo, .portrait-card, .m-media, .cert-modal img, .lottie-card';
  var isProtected = function (el) { return el && el.closest && el.closest(PROTECTED); };

  document.addEventListener('contextmenu', function (e) {
    if (isProtected(e.target)) e.preventDefault();
  });
  document.addEventListener('dragstart', function (e) {
    if (e.target && (e.target.tagName === 'IMG' || isProtected(e.target))) e.preventDefault();
  });

  // Long copies carry attribution; short ones (an email address, a phone number) are untouched.
  document.addEventListener('copy', function (e) {
    var sel = String(window.getSelection ? window.getSelection() : '');
    if (sel.length < 180 || !e.clipboardData) return;
    var credit = '\n\n— Source: Muhammad Usama · ' + location.origin + location.pathname;
    e.clipboardData.setData('text/plain', sel + credit);
    e.preventDefault();
  });

  var style = document.createElement('style');
  style.textContent =
    'img,picture,video,canvas{-webkit-user-drag:none;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none}' +
    '.card,.feat,.deck,.cert-media,.about-photo,.portrait-card,.m-media{user-select:none;-webkit-user-select:none}';
  document.head.appendChild(style);
})();
