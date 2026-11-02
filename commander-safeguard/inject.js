(() => {
  const styles = document.createElement("style");
  styles.textContent = `
    #museum-archive-banner{box-sizing:border-box;width:100%;min-height:32px;padding:7px 12px;position:relative;z-index:2147483647;background:#08142d;color:#d9e8ff;border-bottom:1px solid #31568a;text-align:center;font:12px/1.4 Arial,sans-serif;letter-spacing:.02em}
    #museum-archive-banner a,#museum-archive-banner button{padding:0;border:0;background:none;color:#65e4e6;text-decoration:underline;cursor:pointer;font:inherit}
    .museum-missing-image{box-sizing:border-box;background:#101b35!important;border:2px dashed #6383b8!important;color:#dce8ff!important}
  `;
  document.head.append(styles);

  const year = window.__CS_ARCHIVE_YEAR__;
  const localise = (value) => {
    if (!value) return value;
    return value
      .replace(/^https?:\/\/(?:[^/]+\.)?safeguard\.com\.pk(?::\d+)?\/commandersafeguard/i, `/Portfolio/commander-safeguard/snapshot/${year}`)
      .replace(/^https?:\/\/(?:www\.)?commandersafeguard\.com\.pk(?::\d+)?/i, `/Portfolio/commander-safeguard/snapshot/${year}`);
  };

  document.querySelectorAll("a[href]").forEach((anchor) => {
    const updated = localise(anchor.getAttribute("href"));
    if (updated) anchor.setAttribute("href", updated);
  });
  document.querySelectorAll("img[src], embed[src], object[data]").forEach((element) => {
    for (const attribute of ["src", "data"]) {
      if (element.hasAttribute(attribute)) element.setAttribute(attribute, localise(element.getAttribute(attribute)));
    }
  });

  document.addEventListener("error", (event) => {
    const image = event.target;
    if (!(image instanceof HTMLImageElement) || image.dataset.museumPlaceholder) return;
    image.dataset.museumPlaceholder = "true";
    image.classList.add("museum-missing-image");
    image.alt = image.alt || `Archived image unavailable: ${image.src.split("/").at(-1)}`;
  }, true);
})();

// Fallback: old IE-style <object classid> Flash embeds are not always picked up by
// Ruffle's polyfill, so start a player for any SWF embed that is still unreplaced.
(() => {
  const start = () => {
    const R = window.RufflePlayer && window.RufflePlayer.newest && window.RufflePlayer.newest();
    if (!R) return;
    document.querySelectorAll('object, embed').forEach((el) => {
      if (el.closest('ruffle-player, ruffle-object, ruffle-embed')) return;
      const param = [...el.querySelectorAll('param')].find((p) => /^(movie|src)$/i.test(p.name));
      const src = (param && param.value) || el.getAttribute('src') || el.getAttribute('data') || '';
      if (!/\.swf(\?|$)/i.test(src)) return;
      const player = R.createPlayer();
      const w = el.getAttribute('width') || el.offsetWidth || 550, h = el.getAttribute('height') || el.offsetHeight || 400;
      player.style.width = /%$/.test(w) ? w : w + 'px';
      player.style.height = /%$/.test(h) ? h : h + 'px';
      el.replaceWith(player);
      player.load({ url: new URL(src, location.href).href, autoplay: 'on', unmuteOverlay: 'hidden', splashScreen: true });
    });
  };
  if (document.readyState === 'complete') setTimeout(start, 1200);
  else window.addEventListener('load', () => setTimeout(start, 1200));
})();
