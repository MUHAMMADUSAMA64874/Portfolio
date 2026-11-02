/**
 * Production n8n Workflow Hub Engine
 * - 100% SVG service icons (Strictly zero emojis)
 * - Single-click JSON copy with n8n canvas paste compatibility (Ctrl+V)
 * - Visual pipeline diagram renderer matching user reference layout
 * - Category filter & instant template switcher
 */

import { n8nWorkflows } from './workflows-data.js';

// SVG Icon Library for n8n Services
const SERVICE_SVGS = {
  n8n: '<svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
  httpRequest: '<svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 4v10h16V8H4zm4 4h8v2H8v-2z"/></svg>',
  openai: '<svg viewBox="0 0 24 24"><path d="M22.28 12a9.98 9.98 0 0 0-.25-2.22 5.04 5.04 0 0 0-4.07-4.06A9.97 9.97 0 0 0 12 1.72a9.97 9.97 0 0 0-5.96 4A5.04 5.04 0 0 0 1.97 9.78 9.97 9.97 0 0 0 1.72 12a9.97 9.97 0 0 0 .25 2.22 5.04 5.04 0 0 0 4.07 4.06 9.97 9.97 0 0 0 5.96 4 9.97 9.97 0 0 0 5.96-4 5.04 5.04 0 0 0 4.07-4.06c.16-.72.25-1.46.25-2.22z"/></svg>',
  telegram: '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.77-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>',
  slack: '<svg viewBox="0 0 24 24"><path d="M6 15a2 2 0 1 1-2-2h2v2zm1 0a2 2 0 0 1 2-2 2 2 0 0 1 2 2v5a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-5zm2-8a2 2 0 1 1-2 2V7h2zm0 1a2 2 0 0 1 2 2 2 2 0 0 1-2 2H2a2 2 0 0 1-2-2 2 2 0 0 1 2-2h5zm8 2a2 2 0 1 1 2 2h-2V10zm-1 0a2 2 0 0 1-2 2 2 2 0 0 1-2-2V5a2 2 0 0 1 2-2 2 2 0 0 1 2 2v5zm-2 8a2 2 0 1 1 2-2v2h-2zm0-1a2 2 0 0 1-2-2 2 2 0 0 1 2-2h5a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-5z"/></svg>',
  googleSheets: '<svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H6v-3h6v3zm0-5H6V9h6v3zm7 5h-5v-3h5v3zm0-5h-5V9h5v3z"/></svg>',
  notion: '<svg viewBox="0 0 24 24"><path d="M4 4v16h16V4H4zm14 14H6V6h12v12zM8 8h3v8H8V8zm5 0h3v8h-3V8z"/></svg>',
  gmail: '<svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm5.79 14.16c-.24.67-1.39 1.28-1.94 1.36-.51.08-1.17.11-3.38-.8-2.82-1.17-4.63-4.04-4.77-4.23-.14-.19-1.14-1.52-1.14-2.9 0-1.38.72-2.06.98-2.35.26-.29.57-.36.76-.36.19 0 .38 0 .55.01.18.01.42-.07.65.49.24.58.82 2 .89 2.15.07.15.12.33.02.53-.1.2-.15.32-.3.5-.15.17-.32.39-.46.52-.15.15-.31.31-.13.62.18.31.79 1.3 1.7 2.11 1.17 1.04 2.15 1.36 2.46 1.51.31.15.49.13.67-.08.19-.21.79-.92 1-.1.23.21.36.46.24.69-.12.24-.76.7-1.07.82z"/></svg>',
  mysql: '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 4.02 2 6.5v11C2 19.98 6.48 22 12 22s10-2.02 10-4.5v-11C22 4.02 17.52 2 12 2zm0 2c4.42 0 8 1.34 8 2.5S16.42 9 12 9 4 7.66 4 6.5 7.58 4 12 4zm8 13.5c0 1.16-3.58 2.5-8 2.5s-8-1.34-8-2.5v-2.22c2.14 1.37 5.08 2.22 8 2.22s5.86-.85 8-2.22v2.22zm0-5.5c0 1.16-3.58 2.5-8 2.5s-8-1.34-8-2.5v-2.22c2.14 1.37 5.08 2.22 8 2.22s5.86-.85 8-2.22V12z"/></svg>',
  scheduleTrigger: '<svg viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>',
  default: '<svg viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>'
};

function getServiceSvg(type = '') {
  const t = type.toLowerCase();
  if (t.includes('openai') || t.includes('gpt') || t.includes('langchain')) return SERVICE_SVGS.openai;
  if (t.includes('telegram')) return SERVICE_SVGS.telegram;
  if (t.includes('slack')) return SERVICE_SVGS.slack;
  if (t.includes('sheet') || t.includes('googlesheet')) return SERVICE_SVGS.googleSheets;
  if (t.includes('notion')) return SERVICE_SVGS.notion;
  if (t.includes('gmail') || t.includes('email')) return SERVICE_SVGS.gmail;
  if (t.includes('whatsapp')) return SERVICE_SVGS.whatsapp;
  if (t.includes('mysql') || t.includes('postgres') || t.includes('mongo') || t.includes('database')) return SERVICE_SVGS.mysql;
  if (t.includes('schedule') || t.includes('trigger') || t.includes('interval')) return SERVICE_SVGS.scheduleTrigger;
  if (t.includes('http') || t.includes('webhook') || t.includes('api')) return SERVICE_SVGS.httpRequest;
  return SERVICE_SVGS.default;
}

let activeWorkflow = n8nWorkflows[0] || null;
let currentFilter = 'All';
let canvasZoom = 1;

export function initN8nHub() {
  const container = document.getElementById('n8n-hub-root');
  if (!container || !n8nWorkflows || !n8nWorkflows.length) return;

  // Keyboard users need to be able to focus the scrollable catalogue.
  container.setAttribute('tabindex', '0');
  container.setAttribute('role', 'region');
  container.setAttribute('aria-label', 'AI and automation workflow hub');

  renderHub(container);
}

function renderHub(root) {
  const categories = ['All', ...new Set(n8nWorkflows.map(w => w.category))];

  root.innerHTML = `
    <div class="n8n-hub-section container">
      <div class="n8n-hub-header">
        <div class="n8n-badge-pill">
          ${SERVICE_SVGS.n8n}
          Production n8n Templates
        </div>
        <h1 class="section-title">AI & Automation Workflow Hub</h1>
        <p class="n8n-hub-subtitle">
          Battle-tested, production-ready n8n workflow architectures. Credentials, private hosts and captured run data are stripped, with explicit typeVersion tags. Single-click copy directly into your local or cloud n8n canvas.
        </p>
      </div>

      <div class="n8n-filter-bar" id="n8n-filter-bar">
        ${categories.map(cat => `
          <button class="n8n-filter-btn ${cat === currentFilter ? 'active' : ''}" data-category="${cat}">
            ${cat}
          </button>
        `).join('')}
      </div>

      <!-- Featured Interactive Template Stage -->
      <div class="n8n-viewer-container" id="n8n-viewer-stage">
        <!-- Rendered by updateViewerStage -->
      </div>

      <!-- Workflow Cards Grid -->
      <div class="n8n-cards-grid" id="n8n-cards-grid">
        <!-- Rendered by updateCardsGrid -->
      </div>
    </div>
  `;

  setupFilterEvents();
  updateViewerStage();
  updateCardsGrid();
}

function setupFilterEvents() {
  const filterBar = document.getElementById('n8n-filter-bar');
  if (!filterBar) return;

  filterBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.n8n-filter-btn');
    if (!btn) return;
    const cat = btn.dataset.category;
    currentFilter = cat;

    filterBar.querySelectorAll('.n8n-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Switch active workflow if outside current filter
    const visibleWorkflows = getVisibleWorkflows();
    if (!visibleWorkflows.some(w => w.id === activeWorkflow.id)) {
      activeWorkflow = visibleWorkflows[0] || n8nWorkflows[0];
      updateViewerStage();
    }
    updateCardsGrid();
  });
}

function getVisibleWorkflows() {
  if (currentFilter === 'All') return n8nWorkflows;
  return n8nWorkflows.filter(w => w.category === currentFilter);
}

function updateViewerStage() {
  const stage = document.getElementById('n8n-viewer-stage');
  if (!stage || !activeWorkflow) return;

  const iconsHtml = activeWorkflow.nodeTypes.slice(0, 5).map(t => `
    <div class="n8n-service-icon-badge" title="${t}">
      ${getServiceSvg(t)}
    </div>
  `).join('');

  const overflowBadge = activeWorkflow.nodeTypes.length > 5 
    ? `<span class="n8n-node-overflow-badge">+${activeWorkflow.nodeTypes.length - 5}</span>`
    : '';

  // Parse nodes for the visual pipeline
  let parsedNodes = [];
  try {
    const obj = JSON.parse(activeWorkflow.workflowJson);
    parsedNodes = obj.nodes || [];
  } catch (_) {}

  // Show only as many chips as fit the canvas at rest, then summarise the rest
  // in a counter chip. The full chain is always available through the JSON
  // copy/download actions.
  const maxVisible = window.innerWidth >= 1080 ? 4 : window.innerWidth >= 720 ? 3 : 2;
  const visibleNodes = parsedNodes.slice(0, maxVisible);
  const hiddenCount = Math.max(0, parsedNodes.length - visibleNodes.length);

  const pipelineNodesHtml = visibleNodes.map((node, i) => `
    <div class="n8n-node-chip">
      <div class="n8n-chip-icon">
        ${getServiceSvg(node.type)}
      </div>
      <div class="n8n-chip-text">
        <span class="n8n-chip-name">${escapeHtml(node.name)}</span>
        <span class="n8n-chip-type">${escapeHtml((node.type || '').replace('n8n-nodes-base.', ''))}</span>
      </div>
    </div>
    ${i < visibleNodes.length - 1 ? '<div class="n8n-connector-arrow"></div>' : ''}
  `).join('') + (hiddenCount
    ? `<div class="n8n-connector-arrow"></div><div class="n8n-node-chip n8n-node-chip-more" data-hidden="${hiddenCount}" title="${hiddenCount} more nodes in this workflow"><div class="n8n-chip-text"><span class="n8n-chip-name">+${hiddenCount} more</span><span class="n8n-chip-type">nodes</span></div></div>`
    : '');

  stage.innerHTML = `
    <div class="n8n-viewer-info">
      <div>
        <div class="n8n-node-icons-row">
          ${iconsHtml}
          ${overflowBadge}
        </div>
        <h2 class="n8n-viewer-title">${escapeHtml(activeWorkflow.title)}</h2>
        <p class="n8n-viewer-desc">${escapeHtml(activeWorkflow.description)}</p>
      </div>

      <div>
        <div class="n8n-viewer-meta">
          <span class="n8n-meta-tag">
            <svg viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/></svg>
            ${activeWorkflow.nodeCount} Total Nodes
          </span>
          <span>•</span>
          <span class="n8n-meta-tag">
            <svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
            typeVersion Safe
          </span>
        </div>

        <div class="n8n-actions-row">
          <button class="btn-n8n-copy" id="btn-copy-workflow" type="button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
            <span>Copy Workflow JSON</span>
          </button>
          <button class="btn-n8n-download" id="btn-download-workflow" type="button" title="Download .json file">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
            <span>JSON</span>
          </button>
        </div>
      </div>
    </div>

    <div class="n8n-pipeline-canvas-box">
      <div class="n8n-canvas-grid-bg"></div>
      <div class="n8n-pipeline-viewport" id="n8n-pipeline-viewport">
        <div class="n8n-nodes-flow" id="n8n-nodes-flow">
          ${pipelineNodesHtml}
        </div>
      </div>

      <div class="n8n-zoom-controls">
        <button class="n8n-zoom-btn" id="btn-zoom-in" type="button" title="Zoom in">
          <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
        </button>
        <button class="n8n-zoom-btn" id="btn-zoom-out" type="button" title="Zoom out">
          <svg viewBox="0 0 24 24"><path d="M19 13H5v-2h14v2z"/></svg>
        </button>
        <button class="n8n-zoom-btn" id="btn-zoom-reset" type="button" title="Reset View">
          <svg viewBox="0 0 24 24"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>
        </button>
      </div>
    </div>
  `;

  setupViewerActions();
}

// Chips are sized by their content, so the only reliable way to know how many
// fit is to measure. Drop trailing chips into the "+N more" counter until the
// row stops overflowing.
function trimFlowToFit() {
  const flow = document.getElementById('n8n-nodes-flow');
  const viewport = document.getElementById('n8n-pipeline-viewport');
  if (!flow || !viewport) return;
  if (getComputedStyle(flow).flexDirection === 'column') return;

  const budget = viewport.clientWidth - 28;
  const more = flow.querySelector('.n8n-node-chip-more');
  let guard = 24;

  while (flow.scrollWidth > budget && guard-- > 0) {
    const chips = [...flow.querySelectorAll('.n8n-node-chip:not(.n8n-node-chip-more)')];
    if (chips.length <= 2) break;
    const last = chips[chips.length - 1];
    const arrow = last.nextElementSibling;
    if (arrow && arrow.classList.contains('n8n-connector-arrow')) arrow.remove();
    last.remove();
    if (more) {
      const hidden = Number(more.dataset.hidden || 0) + 1;
      more.dataset.hidden = String(hidden);
      const label = more.querySelector('.n8n-chip-name');
      if (label) label.textContent = `+${hidden} more`;
      more.title = `${hidden} more nodes in this workflow`;
    }
  }
}

// Fit the pipeline so the whole chain is visible at rest. Chips are already
// counted to the viewport, so this only trims the last few pixels. If fitting
// would shrink the labels past legibility, the canvas keeps its natural size and
// stays scrollable instead.
function fitFlowToViewport() {
  const flow = document.getElementById('n8n-nodes-flow');
  const viewport = document.getElementById('n8n-pipeline-viewport');
  if (!flow || !viewport) return;
  if (getComputedStyle(flow).flexDirection === 'column') return;
  flow.style.transform = 'scale(1)';
  const available = viewport.clientWidth - 32;
  const natural = flow.scrollWidth;
  if (!available || !natural) return;
  const scale = available / natural;
  canvasZoom = scale >= 0.78 ? Math.min(1, scale) : 1;
  flow.style.transformOrigin = 'left center';
  flow.style.transform = `scale(${canvasZoom})`;
}

function setupViewerActions() {
  const copyBtn = document.getElementById('btn-copy-workflow');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      if (!activeWorkflow || !activeWorkflow.workflowJson) return;
      navigator.clipboard.writeText(activeWorkflow.workflowJson).then(() => {
        copyBtn.classList.add('copied');
        const span = copyBtn.querySelector('span');
        const oldText = span.textContent;
        span.textContent = 'Copied! Paste into n8n (Ctrl+V)';
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          span.textContent = oldText;
        }, 2500);
      }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = activeWorkflow.workflowJson;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        copyBtn.classList.add('copied');
        setTimeout(() => copyBtn.classList.remove('copied'), 2000);
      });
    });
  }

  const downloadBtn = document.getElementById('btn-download-workflow');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      if (!activeWorkflow) return;
      const blob = new Blob([activeWorkflow.workflowJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeWorkflow.id}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  // Zoom controls
  const flow = document.getElementById('n8n-nodes-flow');
  const btnIn = document.getElementById('btn-zoom-in');
  const btnOut = document.getElementById('btn-zoom-out');
  const btnReset = document.getElementById('btn-zoom-reset');

  if (flow && btnIn && btnOut && btnReset) {
    // Once now (layout is already available), then again on the next frame so
    // webfont metrics are baked in before the final scale is chosen.
    trimFlowToFit();
    fitFlowToViewport();
    requestAnimationFrame(() => {
      trimFlowToFit();
      fitFlowToViewport();
    });
    btnIn.addEventListener('click', () => {
      canvasZoom = Math.min(1.4, canvasZoom + 0.1);
      flow.style.transform = `scale(${canvasZoom})`;
      flow.style.transformOrigin = 'left center';
    });
    btnOut.addEventListener('click', () => {
      canvasZoom = Math.max(0.6, canvasZoom - 0.1);
      flow.style.transform = `scale(${canvasZoom})`;
      flow.style.transformOrigin = 'left center';
    });
    btnReset.addEventListener('click', () => {
      trimFlowToFit();
      fitFlowToViewport();
      requestAnimationFrame(fitFlowToViewport);
    });
  }
}

// The chip count depends on canvas width, so a resize has to rebuild the stage.
// Registered once, debounced, and skipped while the width is unchanged.
let lastCanvasWidth = window.innerWidth;
let resizeTimer = 0;
window.addEventListener('resize', () => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => {
    if (window.innerWidth === lastCanvasWidth) {
      fitFlowToViewport();
      return;
    }
    lastCanvasWidth = window.innerWidth;
    if (document.getElementById('n8n-viewer-stage')) updateViewerStage();
  }, 220);
}, { passive: true });

function updateCardsGrid() {
  const grid = document.getElementById('n8n-cards-grid');
  if (!grid) return;

  const workflows = getVisibleWorkflows();

  grid.innerHTML = workflows.map(w => `
    <div class="n8n-card ${w.id === activeWorkflow.id ? 'active' : ''}" data-id="${w.id}">
      <div>
        <span class="n8n-card-category" data-cat="${escapeHtml(w.category.toLowerCase().replace(/[^a-z]/g, ''))}">${escapeHtml(w.category)}</span>
        <h4 class="n8n-card-title">${escapeHtml(w.title)}</h4>
        <p class="n8n-card-desc">${escapeHtml(w.description)}</p>
      </div>
      <div class="n8n-card-footer">
        <span class="n8n-card-nodes-count">${w.nodeCount} nodes</span>
        <span class="n8n-card-select-hint">
          Preview
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.14 12l-8.29-8.29-1.42 1.42L16.86 11H5v2z"/></svg>
        </span>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.n8n-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      const target = n8nWorkflows.find(w => w.id === id);
      if (target) {
        activeWorkflow = target;
        updateViewerStage();
        updateCardsGrid();
        // Return to the top of the hub after choosing a template on small screens
        const stage = document.getElementById('n8n-viewer-stage');
        const hub = document.getElementById('n8n-hub-root');
        if (stage && window.innerWidth < 1024) {
          if (hub && hub.scrollHeight > hub.clientHeight + 1) {
            hub.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            stage.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }
    });
  });
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Auto-boot
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initN8nHub());
} else {
  initN8nHub();
}
