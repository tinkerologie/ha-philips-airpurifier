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
export const humidityIcon = () =>
  html`<svg viewBox="0 0 24 24" aria-hidden="true">
    ${svg`<path d="M12 3.5C10 7 6 10.5 6 14.5a6 6 0 0 0 12 0c0-4-4-7.5-6-11Z"/>`}
  </svg>`;
export const temperatureIcon = () =>
  html`<svg viewBox="0 0 24 24" aria-hidden="true">
    ${svg`<path d="M10 13.5V5a2 2 0 1 1 4 0v8.5a4 4 0 1 1-4 0ZM12 11v5"/>`}
  </svg>`;
export const ring = (percent: number) =>
  html`<svg class="filter-ring" viewBox="0 0 48 48" aria-hidden="true">
    <circle class="track" cx="24" cy="24" r="20" />
    <circle cx="24" cy="24" r="20" pathLength="100" stroke-dasharray="${Math.max(0, Math.min(100, percent))} 100" />
  </svg>`;
const icon = (paths: ReturnType<typeof svg>) => html`<svg viewBox="0 0 24 24" aria-hidden="true">${paths}</svg>`;
export const lockIcon = (locked: boolean) =>
  icon(
    svg`<rect x="5" y="11" width="14" height="10" rx="2.5"/><path d=${locked ? "M8 11V7.5a4 4 0 0 1 8 0V11" : "M8 11V7.5a4 4 0 0 1 7.6-1.8"}/><path d="M12 15v2"/>`
  );
export const autoIcon = () =>
  icon(
    svg`<path d="M19.5 12A7.5 7.5 0 1 1 13.5 4.6"/><path d="M13 2.5l1.2 2.3-2.4 1"/><path d="M9 16.5l3-8 3 8M10.1 13.7h3.8"/>`
  );
export const sleepIcon = () =>
  icon(svg`<path d="M19.5 14.5A8 8 0 1 1 9.5 4.5a6.5 6.5 0 0 0 10 10Z"/><path d="M15 5.5h.01M18.5 9h.01"/>`);
export const mediumIcon = () =>
  icon(
    svg`<path d="M3.5 9.5c3-2.5 7-2 8.5 1.5"/><path d="M12 11c1.5 3.5-.5 7-3 8.5"/><path d="M12 11c3.5-1.5 5-5 4.5-8"/>`
  );
export const turboIcon = () =>
  icon(svg`<path d="M12 12a1.5 1.5 0 1 1 1.5 1.5A3.5 3.5 0 1 1 15.5 10a5.5 5.5 0 1 1-7.8-.8A7.5 7.5 0 1 1 4.5 15"/>`);
export const fanIcon = () =>
  icon(
    svg`<path d="M12 12c-.5-4 .5-8.5 3.5-8.5s2 5.5-3.5 8.5Zm0 0c4-.5 8.5.5 8.5 3.5s-5.5 2-8.5-3.5Zm0 0c.5 4-.5 8.5-3.5 8.5s-2-5.5 3.5-8.5Zm0 0c-4 .5-8.5-.5-8.5-3.5s5.5-2 8.5 3.5Z"/>`
  );
export const displayIcon = () =>
  icon(
    svg`<circle cx="12" cy="13" r="4"/><path d="M10.5 5.5h3v3h-3zM12 19.5V21M4 13H2.5M21.5 13H20M6.3 7.3 5.2 6.2M17.7 7.3l1.1-1.1M6.3 18.7l-1.1 1.1M17.7 18.7l1.1 1.1"/>`
  );
export const lampIcon = () => icon(svg`<path d="M6 17.5h12M12 12V8M8 13l-2-2.5M16 13l2-2.5M5 16H2.5M21.5 16H19"/>`);
export const timerIcon = () => icon(svg`<circle cx="12" cy="12" r="9"/><path d="M12 7v5H9"/>`);
export const closeIcon = () => icon(svg`<path d="M6 6l12 12M18 6 6 18"/>`);
export const infoIcon = () => icon(svg`<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>`);
export function modeIcon(mode: string) {
  if (mode.startsWith("auto") || mode === "pollution" || mode === "gas" || mode === "allergen") return autoIcon();
  if (mode.includes("sleep") || mode === "night") return sleepIcon();
  if (mode === "turbo" || mode === "high" || mode === "ventilation") return turboIcon();
  if (mode === "medium" || mode.startsWith("speed")) return mediumIcon();
  return fanIcon();
}
