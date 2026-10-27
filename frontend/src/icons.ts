import { html, svg } from "lit";
export const powerIcon = () =>
  html`<svg viewBox="0 0 24 24" aria-hidden="true">${svg`<path d="M12 3v9M6.3 5.7a8 8 0 1 0 11.4 0"/>`}</svg>`;
export const purifierIcon = () =>
  html`<svg viewBox="0 0 74 108" aria-hidden="true">
    ${svg`<rect x="14" y="21" width="46" height="78" rx="14"/><ellipse cx="37" cy="24" rx="22" ry="7"/><path d="M22 43v40m7-40v46m8-46v46m8-46v46m7-46v40M25 12c-6-5 6-5 0-10m12 10c-6-5 6-5 0-10m12 10c-6-5 6-5 0-10"/>`}
  </svg>`;
export const dropIcon = () =>
  html`<svg viewBox="0 0 74 108" aria-hidden="true">
    ${svg`<path d="M37 12C32 27 13 46 13 64a24 24 0 0 0 48 0C61 46 42 27 37 12Z"/><path d="M24 64a13 13 0 0 0 13 13"/>`}
  </svg>`;
export const ring = (percent: number) =>
  html`<svg class="filter-ring" viewBox="0 0 48 48" aria-hidden="true">
    <circle class="track" cx="24" cy="24" r="20" />
    <circle cx="24" cy="24" r="20" pathLength="100" stroke-dasharray="${Math.max(0, Math.min(100, percent))} 100" />
  </svg>`;
