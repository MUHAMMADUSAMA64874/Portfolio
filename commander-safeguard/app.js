const versions = {
  2005: { version: "V1", note: "Original PHP portal" },
  2007: { version: "V2", note: "Commander’s Lab" },
  2008: { version: "V3", note: "Flat navigation" },
  2010: { version: "V4", note: "Final .com design" },
  2011: { version: "V5", note: "ASP relaunch" },
  2012: { version: "V6", note: "PHP era begins" },
  2013: { version: "V7", note: "PHP snapshot" },
  2014: { version: "V8", note: "Game portal" },
  2015: { version: "V9", note: "Final full crawl" },
  2016: { version: "V10", note: "Partial capture" },
};

const viewerDialog = document.querySelector("#viewer-dialog");
const viewer = document.querySelector("#site-viewer");
const viewerVersion = document.querySelector("#viewer-version");
const viewerNewTab = document.querySelector("#viewer-new-tab");
const aboutDialog = document.querySelector("#about-dialog");
let activeYear = 2015;

function openYear(year) {
  activeYear = Number(year);
  const item = versions[activeYear];
  const url = `/Portfolio/commander-safeguard/snapshot/${activeYear}/`;
  viewerVersion.textContent = `${item.version} · ${activeYear} · ${item.note}`;
  viewer.src = url;
  viewerNewTab.href = url;
  if (!viewerDialog.open) viewerDialog.showModal();
  document.body.classList.add("dialog-open");
}

document.querySelectorAll("[data-open-year]").forEach((button) => {
  button.addEventListener("click", () => openYear(button.dataset.openYear));
});

document.querySelector("#viewer-close").addEventListener("click", () => viewerDialog.close());
document.querySelector("#viewer-home").addEventListener("click", () => { viewer.src = `/Portfolio/commander-safeguard/snapshot/${activeYear}/`; });
viewerDialog.addEventListener("close", () => {
  viewer.src = "about:blank";
  document.body.classList.remove("dialog-open");
});

document.querySelector("#about-button").addEventListener("click", () => aboutDialog.showModal());
document.querySelector("[data-close-about]").addEventListener("click", () => aboutDialog.close());
window.addEventListener("message", (event) => {
  if (event.data?.type === "museum-info") aboutDialog.showModal();
});

fetch("/Portfolio/commander-safeguard/api/archive.json")
  .then((response) => response.json())
  .then((archive) => {
    document.querySelector("#stat-files").textContent = archive.availableFiles || "0";
    const status = document.querySelector("#hero-status");
    status.textContent = archive.ready ? `${archive.availableFiles}/${archive.uniqueFiles} files ready` : "Archive download required";
    status.closest(".status-chip").classList.toggle("is-warning", !archive.ready || archive.failedFiles > 0);
  })
  .catch(() => {
    document.querySelector("#hero-status").textContent = "Archive status unavailable";
  });
