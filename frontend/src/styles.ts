import { css } from "lit";
// Built on the Home Assistant design tokens (--ha-space-*, --ha-font-*,
// --ha-border-radius-*, semantic --ha-color-* and the --state-* colours). Each
// token keeps a fallback equal to its core value, so the cards also follow user
// themes and render the same on frontends that predate a token.
export const styles = css`
  :host {
    display: block;
    container-type: inline-size;
    height: 100%;
    font-family: var(--ha-font-family-body, Roboto, Noto, sans-serif);
    /* Tile-card language: the active state colour while on, neutral while off. */
    --pap-active-color: var(--state-fan-active-color, var(--state-active-color, var(--primary-color)));
    --pap-accent: var(--pap-active-color);
  }
  * {
    box-sizing: border-box;
  }
  ha-card {
    height: 100%;
    overflow: hidden;
    background: var(--ha-card-background, var(--card-background-color));
    color: var(--primary-text-color);
    border-radius: var(--ha-card-border-radius, var(--ha-border-radius-lg, 12px));
  }
  ha-card.is-off {
    --pap-accent: var(--state-inactive-color, var(--secondary-text-color));
  }
  ha-card.is-unavailable {
    --pap-accent: var(--state-unavailable-color, var(--disabled-text-color, var(--secondary-text-color)));
  }
  .body {
    padding: var(--ha-space-5, 20px);
  }
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ha-space-3, 12px);
    margin-block-end: var(--ha-space-4, 16px);
  }
  .heading {
    min-width: 0;
  }
  .header-actions {
    display: flex;
    gap: var(--ha-space-1, 4px);
  }
  h2 {
    margin: 0;
    font-size: var(--ha-font-size-l, 16px);
    font-weight: var(--ha-font-weight-medium, 500);
    line-height: var(--ha-line-height-condensed, 1.2);
    overflow-wrap: anywhere;
  }
  .eyebrow,
  .secondary {
    color: var(--secondary-text-color);
    font-size: var(--ha-font-size-s, 12px);
    line-height: var(--ha-line-height-normal, 1.6);
  }
  .eyebrow {
    margin-block-start: var(--ha-space-1, 4px);
    line-height: var(--ha-line-height-condensed, 1.2);
  }
  button,
  input {
    font: inherit;
    color: inherit;
  }
  button {
    min-height: 48px;
    padding: var(--ha-space-2, 8px) var(--ha-space-3, 12px);
    border: var(--ha-border-width-sm, 1px) solid var(--ha-color-border-neutral-quiet, var(--divider-color));
    border-radius: var(--ha-border-radius-lg, 12px);
    background: transparent;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: background-color var(--ha-animation-duration-fast, 150ms) ease-in-out;
  }
  button:hover:not(:disabled) {
    background: color-mix(in srgb, var(--pap-accent) 12%, transparent);
  }
  button:focus-visible,
  .segment:has(input:focus-visible) {
    outline: 2px solid var(--ha-color-focus, var(--primary-color));
    outline-offset: 2px;
  }
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  button.active,
  button[aria-pressed="true"] {
    color: var(--pap-accent);
    background: color-mix(in srgb, var(--pap-accent) 20%, transparent);
    border-color: transparent;
  }
  .icon-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    padding: var(--ha-space-3, 12px);
    border-radius: var(--ha-border-radius-circle, 50%);
  }
  .icon-button.plain {
    border: 0;
    color: var(--secondary-text-color);
  }
  svg {
    width: 24px;
    height: 24px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .hero {
    display: flex;
    align-items: center;
    gap: var(--ha-space-5, 20px);
    margin: 0 calc(-1 * var(--ha-space-5, 20px)) var(--ha-space-5, 20px);
    padding: var(--ha-space-4, 16px) var(--ha-space-5, 20px);
    background: linear-gradient(
      to var(--pap-inline-end, right),
      color-mix(in srgb, var(--pap-accent) 14%, transparent),
      transparent
    );
  }
  :host(:dir(rtl)) {
    --pap-inline-end: left;
  }
  .hero svg {
    flex-shrink: 0;
    width: 64px;
    height: 94px;
    color: var(--pap-accent);
  }
  .value {
    font-size: clamp(var(--ha-font-size-2xl, 24px), 8cqi, var(--ha-font-size-4xl, 32px));
    font-weight: var(--ha-font-weight-medium, 500);
    line-height: var(--ha-line-height-condensed, 1.2);
    font-variant-numeric: tabular-nums;
    overflow-wrap: anywhere;
  }
  .unit {
    color: var(--secondary-text-color);
    font-size: var(--ha-font-size-m, 14px);
    font-weight: var(--ha-font-weight-normal, 400);
    white-space: nowrap;
  }
  .state {
    margin-block-start: var(--ha-space-2, 8px);
    color: var(--pap-accent);
    font-size: var(--ha-font-size-m, 14px);
    font-weight: var(--ha-font-weight-medium, 500);
  }
  .section {
    margin-block-start: var(--ha-space-4, 16px);
    padding-block-start: var(--ha-space-4, 16px);
    border-block-start: var(--ha-border-width-sm, 1px) solid var(--ha-color-border-neutral-quiet, var(--divider-color));
  }
  .section-title {
    margin-block-end: var(--ha-space-2, 8px);
    padding: 0;
    font-size: var(--ha-font-size-m, 14px);
    font-weight: var(--ha-font-weight-medium, 500);
  }
  .filter,
  .row {
    display: flex;
    align-items: center;
    gap: var(--ha-space-3, 12px);
    width: 100%;
    padding: var(--ha-space-2, 8px);
    border: 0;
    text-align: start;
  }
  .row {
    justify-content: space-between;
  }
  .filter-ring {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    transform: rotate(-90deg);
    stroke-width: 4;
    color: var(--pap-accent);
  }
  .filter-ring .track {
    stroke: var(--ha-color-border-neutral-quiet, var(--divider-color));
  }
  .filter-text {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }
  .filter-name {
    font-size: var(--ha-font-size-m, 14px);
  }
  .filter-value {
    font-weight: var(--ha-font-weight-medium, 500);
  }
  /* Mirrors ha-alert: a tinted surface with a leading icon in the tone colour. */
  .alert {
    --pap-alert-color: var(--info-color, var(--ha-color-fill-primary-loud-resting, var(--primary-color)));
    display: flex;
    align-items: flex-start;
    gap: var(--ha-space-2, 8px);
    margin-block-start: var(--ha-space-3, 12px);
    padding: var(--ha-space-2, 8px) var(--ha-space-3, 12px);
    border-radius: var(--ha-border-radius-sm, 4px);
    background: color-mix(in srgb, var(--pap-alert-color) 12%, transparent);
    color: var(--primary-text-color);
    font-size: var(--ha-font-size-m, 14px);
    line-height: var(--ha-line-height-normal, 1.6);
    overflow-wrap: anywhere;
  }
  header + .alert {
    margin-block-start: 0;
  }
  .alert svg {
    flex: none;
    width: 24px;
    height: 24px;
    fill: var(--pap-alert-color);
    stroke: none;
  }
  .alert.warning {
    --pap-alert-color: var(--warning-color, var(--ha-color-fill-warning-loud-resting, #ffa600));
  }
  .alert.error {
    --pap-alert-color: var(--error-color, var(--ha-color-fill-danger-loud-resting, #db4437));
  }
  .stepper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ha-space-3, 12px);
  }
  .stepper .icon-button {
    color: var(--pap-accent);
    border-color: color-mix(in srgb, var(--pap-accent) 40%, transparent);
  }
  .target {
    font-size: var(--ha-font-size-3xl, 28px);
    font-weight: var(--ha-font-weight-medium, 500);
    font-variant-numeric: tabular-nums;
  }
  /* Segmented switch: native radios keep arrow-key navigation and form semantics. */
  fieldset.segmented {
    min-width: 0;
    margin: 0;
    padding: 0;
    border: 0;
  }
  .segments {
    display: flex;
    gap: var(--ha-space-1, 4px);
    padding: var(--ha-space-1, 4px);
    border-radius: var(--ha-border-radius-pill, 9999px);
    background: var(--ha-color-fill-neutral-quiet-resting, var(--secondary-background-color));
  }
  .segment {
    position: relative;
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    min-width: 0;
    min-height: 44px;
    padding-inline: var(--ha-space-2, 8px);
    border-radius: var(--ha-border-radius-pill, 9999px);
    color: var(--secondary-text-color);
    font-size: var(--ha-font-size-m, 14px);
    font-weight: var(--ha-font-weight-medium, 500);
    text-align: center;
    cursor: pointer;
  }
  .segment input {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
  .segment:has(input:checked) {
    background: var(--ha-card-background, var(--card-background-color));
    color: var(--pap-accent);
    box-shadow: var(--ha-box-shadow-s, 0 1px 2px rgb(0 0 0 / 15%));
  }
  .segmented:disabled .segment {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .band-good {
    --pap-band: var(--pap-good-color, var(--ha-color-fill-success-loud-resting, var(--green-color, #4caf50)));
  }
  .band-fair {
    --pap-band: var(--pap-fair-color, var(--amber-color, #ffc107));
  }
  .band-poor {
    --pap-band: var(--pap-poor-color, var(--ha-color-fill-warning-loud-resting, var(--orange-color, #ff9800)));
  }
  .band-very_poor {
    --pap-band: var(--pap-very-poor-color, var(--ha-color-fill-danger-loud-resting, var(--red-color, #f44336)));
  }
  ha-card[class*="band-"] .body {
    background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--pap-band) 16%, transparent),
      transparent var(--pap-band-fade, 70%)
    );
  }
  .pill {
    flex-shrink: 0;
    padding: var(--ha-space-1, 4px) var(--ha-space-3, 12px);
    border-radius: var(--ha-border-radius-pill, 9999px);
    background: color-mix(in srgb, var(--pap-band, var(--pap-accent)) 20%, transparent);
    color: var(--primary-text-color);
    font-size: var(--ha-font-size-s, 12px);
    font-weight: var(--ha-font-weight-medium, 500);
    line-height: var(--ha-line-height-normal, 1.6);
  }
  .pill::before {
    content: "";
    display: inline-block;
    width: 8px;
    height: 8px;
    margin-inline-end: var(--ha-space-2, 8px);
    border-radius: var(--ha-border-radius-circle, 50%);
    background: var(--pap-band, var(--pap-accent));
    vertical-align: middle;
  }
  .hero .pill {
    display: inline-block;
    margin-block-start: var(--ha-space-2, 8px);
    margin-inline-end: var(--ha-space-2, 8px);
  }
  .summary {
    margin: 0 0 var(--ha-space-4, 16px);
    font-size: var(--ha-font-size-l, 16px);
    font-weight: var(--ha-font-weight-medium, 500);
    line-height: var(--ha-line-height-condensed, 1.2);
  }
  .metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(92px, 100%), 1fr));
    gap: var(--ha-space-2, 8px);
  }
  .tile {
    display: flex;
    flex-direction: column;
    gap: var(--ha-space-1, 4px);
    min-width: 0;
    padding: var(--ha-space-3, 12px);
    border: 0;
    border-radius: var(--ha-border-radius-lg, 12px);
    text-align: start;
    background: var(--ha-card-background, var(--card-background-color));
    background-image: linear-gradient(
      color-mix(in srgb, var(--primary-text-color) 4%, transparent),
      color-mix(in srgb, var(--primary-text-color) 4%, transparent)
    );
  }
  .metric-label {
    overflow: hidden;
    color: var(--secondary-text-color);
    font-size: var(--ha-font-size-m, 14px);
    font-weight: var(--ha-font-weight-medium, 500);
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .metrics .value {
    font-size: var(--ha-font-size-3xl, 28px);
    white-space: nowrap;
  }
  .meter {
    display: block;
    height: 6px;
    margin-block: var(--ha-space-1, 4px);
    overflow: hidden;
    border-radius: var(--ha-border-radius-pill, 9999px);
    background: color-mix(in srgb, var(--pap-band, var(--pap-accent)) 18%, transparent);
  }
  .meter span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: var(--pap-band, var(--pap-accent));
    transition: width var(--ha-animation-duration-slow, 350ms) ease;
  }
  .trend-button {
    display: block;
    width: 100%;
    margin-block-start: var(--ha-space-4, 16px);
    padding: var(--ha-space-3, 12px);
    border: 0;
    border-radius: var(--ha-border-radius-lg, 12px);
    text-align: start;
    background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
    color: var(--pap-band, var(--pap-accent));
  }
  .trend {
    margin: 0;
  }
  .trend figcaption {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: var(--ha-space-1, 4px) var(--ha-space-3, 12px);
    margin-block-end: var(--ha-space-2, 8px);
  }
  .trend svg {
    display: block;
    width: 100%;
    height: 96px;
    overflow: visible;
    stroke: none;
  }
  .trend-range {
    fill: currentColor;
    fill-opacity: 0.12;
  }
  .trend-line {
    fill: none;
    stroke: currentColor;
    stroke-width: 2.5;
    vector-effect: non-scaling-stroke;
  }
  .trend-dot {
    stroke: currentColor;
    stroke-width: 9;
    stroke-linecap: round;
    vector-effect: non-scaling-stroke;
  }
  .trend-threshold {
    stroke: var(--secondary-text-color);
    stroke-opacity: 0.5;
    stroke-width: 1;
    stroke-dasharray: 4 4;
    vector-effect: non-scaling-stroke;
  }
  /* Time runs left to right in every locale, matching the SVG and Home Assistant charts. */
  .trend-axis {
    direction: ltr;
    display: flex;
    justify-content: space-between;
    margin-block-start: var(--ha-space-1, 4px);
  }
  .climate {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(140px, 100%), 1fr));
    gap: var(--ha-space-2, 8px);
    margin-block-start: var(--ha-space-2, 8px);
  }
  .climate-item {
    display: flex;
    align-items: center;
    gap: var(--ha-space-3, 12px);
    padding: var(--ha-space-3, 12px);
    border: 0;
    border-radius: var(--ha-border-radius-lg, 12px);
    text-align: start;
    background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
  }
  .climate-icon {
    display: inline-flex;
    padding: var(--ha-space-2, 8px);
    border-radius: var(--ha-border-radius-circle, 50%);
    color: var(--pap-accent);
    background: color-mix(in srgb, var(--pap-accent) 20%, transparent);
  }
  .climate-icon svg {
    width: 20px;
    height: 20px;
  }
  .climate-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .climate-value {
    font-size: var(--ha-font-size-l, 16px);
    font-weight: var(--ha-font-weight-medium, 500);
    font-variant-numeric: tabular-nums;
  }
  .controls-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-block-end: var(--ha-space-2, 8px);
  }
  .controls-head .section-title {
    margin: 0;
    color: var(--secondary-text-color);
  }
  .round-row {
    display: flex;
    justify-content: center;
    gap: var(--ha-space-8, 32px);
    margin-block-end: var(--ha-space-4, 16px);
  }
  .round {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--ha-space-2, 8px);
    font-size: var(--ha-font-size-m, 14px);
  }
  .round .icon-button {
    width: 64px;
    height: 64px;
    padding: var(--ha-space-4, 16px);
    border-width: var(--ha-border-width-md, 2px);
  }
  .round .icon-button svg {
    width: 28px;
    height: 28px;
  }
  .mode-button,
  .control-tile {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--ha-space-3, 12px);
    width: 100%;
    min-height: 56px;
    border-radius: var(--ha-border-radius-xl, 16px);
    font-size: var(--ha-font-size-l, 16px);
    font-weight: var(--ha-font-weight-medium, 500);
  }
  .mode-button {
    border-color: transparent;
    color: var(--pap-accent);
    background: color-mix(in srgb, var(--pap-accent) 12%, transparent);
  }
  .mode-button svg {
    width: 28px;
    height: 28px;
  }
  .control-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--ha-space-2, 8px);
    margin-block-start: var(--ha-space-2, 8px);
  }
  .control-tile span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  dialog {
    width: min(420px, calc(100vw - 2 * var(--ha-space-4, 16px)));
    padding: var(--ha-space-6, 24px);
    border: 0;
    border-radius: var(--ha-dialog-border-radius, var(--ha-border-radius-4xl, 28px));
    background: var(--ha-card-background, var(--card-background-color));
    color: var(--primary-text-color);
    box-shadow: var(--ha-box-shadow-l, 0 12px 48px rgb(0 0 0 / 30%));
  }
  dialog[open] {
    animation: pap-sheet-in var(--ha-animation-duration-normal, 250ms) ease-out;
  }
  @keyframes pap-sheet-in {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
  }
  dialog::backdrop {
    background: rgb(0 0 0 / 45%);
  }
  .sheet-close {
    position: absolute;
    top: var(--ha-space-3, 12px);
    inset-inline-start: var(--ha-space-3, 12px);
    border: 0;
    color: var(--secondary-text-color);
  }
  dialog h3 {
    margin: 0 0 var(--ha-space-5, 20px);
    padding-inline: var(--ha-space-12, 48px);
    text-align: center;
    font-size: var(--ha-font-size-xl, 20px);
    font-weight: var(--ha-font-weight-normal, 400);
    line-height: 48px;
  }
  .choices {
    display: flex;
    flex-direction: column;
    gap: var(--ha-space-1, 4px);
    max-height: 50vh;
    overflow-y: auto;
  }
  .choices.compact {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .choice {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--ha-space-4, 16px);
    min-height: 56px;
    border: 0;
    border-radius: var(--ha-border-radius-xl, 16px);
    color: var(--pap-accent);
    font-size: var(--ha-font-size-l, 16px);
    font-weight: var(--ha-font-weight-medium, 500);
  }
  .choice svg {
    width: 28px;
    height: 28px;
  }
  .choice[aria-checked="true"] {
    background: color-mix(in srgb, var(--pap-accent) 20%, transparent);
  }
  .choice:focus-visible,
  .apply:focus-visible,
  .cancel:focus-visible {
    outline-offset: -2px;
  }
  .sheet-actions {
    display: flex;
    flex-direction: row-reverse;
    gap: var(--ha-space-2, 8px);
    margin-block-start: var(--ha-space-6, 24px);
  }
  .apply,
  .cancel {
    padding-inline: var(--ha-space-6, 24px);
    border: 0;
    border-radius: var(--ha-border-radius-pill, 9999px);
    font-weight: var(--ha-font-weight-medium, 500);
  }
  .apply {
    color: var(--ha-color-on-primary-loud, var(--text-primary-color, #fff));
    background: var(--ha-color-fill-primary-loud-resting, var(--primary-color));
  }
  .apply:hover:not(:disabled) {
    background: var(--ha-color-fill-primary-loud-hover, var(--primary-color));
  }
  .cancel {
    color: var(--primary-color);
  }
  /* Home Assistant shows choice dialogs as bottom sheets on phones. */
  @media (max-width: 870px) {
    dialog {
      width: 100%;
      max-width: none;
      margin: auto 0 0;
      border-end-start-radius: 0;
      border-end-end-radius: 0;
      padding-block-end: calc(var(--ha-space-6, 24px) + env(safe-area-inset-bottom, 0px));
    }
    .sheet-actions {
      flex-direction: column;
    }
  }
  @container (max-width: 360px) {
    .body {
      padding: var(--ha-space-4, 16px);
    }
    .hero {
      gap: var(--ha-space-4, 16px);
      margin-inline: calc(-1 * var(--ha-space-4, 16px));
      padding-inline: var(--ha-space-4, 16px);
    }
    .hero svg {
      width: 48px;
      height: 70px;
    }
    .round-row {
      gap: var(--ha-space-6, 24px);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation: none !important;
      transition: none !important;
    }
  }
`;
