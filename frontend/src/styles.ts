import { css } from "lit";
export const styles = css`
  :host {
    display: block;
    container-type: inline-size;
    height: 100%;
    --pap-accent: var(--state-fan-active-color, var(--primary-color));
  }
  ha-card {
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    background: var(--ha-card-background, var(--card-background-color));
    color: var(--primary-text-color);
    border-radius: var(--ha-card-border-radius, 16px);
  }
  .body {
    padding: 20px;
  }
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 20px;
  }
  h2 {
    font-size: 1.2rem;
    font-weight: 600;
    line-height: 1.35;
    margin: 0;
    overflow-wrap: anywhere;
  }
  .eyebrow,
  .secondary {
    color: var(--secondary-text-color);
    font-size: 0.8rem;
    line-height: 1.5;
  }
  .eyebrow {
    margin-bottom: 4px;
    letter-spacing: 0.09em;
    text-transform: uppercase;
  }
  button,
  select,
  input {
    font: inherit;
    color: inherit;
  }
  button {
    min-height: 48px;
    border: 1px solid var(--ha-color-border-neutral-quiet, var(--divider-color));
    border-radius: 12px;
    background: transparent;
    padding: 10px 14px;
    cursor: pointer;
  }
  button:hover:not(:disabled) {
    background: color-mix(in srgb, var(--pap-accent) 12%, transparent);
  }
  button:focus-visible,
  input:focus-visible,
  select:focus-visible {
    outline: 3px solid var(--ha-color-focus, var(--primary-color));
    outline-offset: 3px;
  }
  button:disabled,
  input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  button[aria-pressed="true"],
  .primary {
    color: var(--pap-accent);
    background: color-mix(in srgb, var(--pap-accent) 14%, transparent);
    border-color: transparent;
  }
  .icon-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    padding: 12px;
    border-radius: 50%;
    flex-shrink: 0;
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
    gap: 22px;
    padding: 20px;
    margin: 0 -20px 20px;
    background: linear-gradient(120deg, color-mix(in srgb, var(--pap-accent) 14%, transparent), transparent);
  }
  .hero svg {
    width: 74px;
    height: 108px;
    flex-shrink: 0;
    color: var(--pap-accent);
  }
  .value {
    font-size: clamp(2rem, 8cqi, 3rem);
    font-weight: 600;
    line-height: 1.2;
    letter-spacing: -0.03em;
    font-variant-numeric: tabular-nums;
  }
  .unit {
    color: var(--secondary-text-color);
    font-size: 0.85rem;
    font-weight: 400;
    letter-spacing: normal;
  }
  .state {
    display: inline-block;
    margin-top: 8px;
    font-size: 0.8rem;
    color: var(--pap-accent);
  }
  .chips,
  .actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .chips button {
    flex: 1 0 auto;
  }
  .section {
    border-top: 1px solid var(--ha-color-border-neutral-quiet, var(--divider-color));
    margin-top: 18px;
    padding-top: 18px;
  }
  .section-title {
    font-size: 0.85rem;
    font-weight: 600;
    margin-bottom: 10px;
  }
  label {
    display: block;
    font-size: 0.85rem;
    margin-bottom: 6px;
  }
  input[type="range"] {
    width: 100%;
    min-height: 44px;
    margin: 0;
    accent-color: var(--pap-accent);
    cursor: pointer;
    appearance: none;
    background: transparent;
  }
  input[type="range"]::-webkit-slider-runnable-track {
    height: 8px;
    border-radius: var(--ha-border-radius-pill, 999px);
    background: color-mix(in srgb, var(--pap-accent) 20%, transparent);
  }
  input[type="range"]::-moz-range-track {
    height: 8px;
    border-radius: var(--ha-border-radius-pill, 999px);
    background: color-mix(in srgb, var(--pap-accent) 20%, transparent);
  }
  input[type="range"]::-moz-range-progress {
    height: 8px;
    border-radius: var(--ha-border-radius-pill, 999px);
    background: var(--pap-accent);
  }
  input[type="range"]::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    margin-top: -6px;
    border-radius: 50%;
    border: 0;
    background: var(--pap-accent);
  }
  input[type="range"]::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 0;
    background: var(--pap-accent);
  }
  .tiles {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(135px, 100%), 1fr));
    gap: 12px;
  }
  .tile {
    text-align: start;
    padding: 16px;
    min-width: 0;
    border-radius: 14px;
    background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
    border: 0;
  }
  .tile .value {
    font-size: 1.9rem;
    margin: 8px 0;
    overflow-wrap: anywhere;
  }
  .tile .secondary {
    display: block;
  }
  .filter {
    display: flex;
    align-items: center;
    gap: 14px;
    width: 100%;
    text-align: start;
    border: 0;
    padding: 8px 0;
  }
  .filter-ring {
    width: 54px;
    height: 54px;
    flex-shrink: 0;
    transform: rotate(-90deg);
    stroke-width: 4;
    color: var(--pap-accent);
  }
  .filter-ring .track {
    stroke: var(--ha-color-border-neutral-quiet, var(--divider-color));
  }
  .filter-text {
    flex: 1;
    min-width: 0;
  }
  .filter-name {
    display: block;
    font-size: 0.85rem;
  }
  .filter-value {
    font-weight: 600;
  }
  .notice {
    padding: 16px;
    border-radius: 12px;
    background: color-mix(in srgb, var(--primary-text-color) 5%, transparent);
    color: var(--secondary-text-color);
    line-height: 1.5;
  }
  .error {
    color: var(--error-color);
    margin-top: 12px;
    font-size: 0.85rem;
  }
  .stepper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .target {
    font-size: 1.8rem;
    font-weight: 500;
  }
  .mode {
    text-transform: capitalize;
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
    border-radius: var(--ha-border-radius-pill, 999px);
    background: color-mix(in srgb, var(--pap-band, var(--pap-accent)) 20%, transparent);
    color: var(--primary-text-color);
    font-size: var(--ha-font-size-s, 0.8rem);
    font-weight: var(--ha-font-weight-medium, 500);
    line-height: 1.5;
  }
  .pill::before {
    content: "";
    display: inline-block;
    width: 8px;
    height: 8px;
    margin-inline-end: var(--ha-space-2, 8px);
    border-radius: 50%;
    background: var(--pap-band, var(--pap-accent));
    vertical-align: middle;
  }
  .summary {
    margin: calc(-1 * var(--ha-space-2, 8px)) 0 var(--ha-space-5, 20px);
    font-size: var(--ha-font-size-l, 1.1rem);
    font-weight: var(--ha-font-weight-medium, 500);
    line-height: var(--ha-line-height-condensed, 1.3);
  }
  .metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(92px, 100%), 1fr));
    gap: var(--ha-space-2, 8px);
  }
  .metrics .tile {
    display: flex;
    flex-direction: column;
    gap: var(--ha-space-1, 4px);
    padding: var(--ha-space-3, 12px);
    border-radius: var(--ha-border-radius-lg, 12px);
    background: var(--ha-card-background, var(--card-background-color));
    background-image: linear-gradient(
      color-mix(in srgb, var(--primary-text-color) 4%, transparent),
      color-mix(in srgb, var(--primary-text-color) 4%, transparent)
    );
  }
  .metric-label {
    font-size: var(--ha-font-size-m, 0.875rem);
    font-weight: var(--ha-font-weight-medium, 500);
    color: var(--secondary-text-color);
  }
  .metrics .value {
    margin: 0;
    font-size: var(--ha-font-size-3xl, 1.75rem);
    white-space: nowrap;
  }
  .metric-label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .meter {
    display: block;
    height: 6px;
    margin-block: var(--ha-space-1, 4px);
    border-radius: var(--ha-border-radius-pill, 999px);
    background: color-mix(in srgb, var(--pap-band, var(--pap-accent)) 18%, transparent);
    overflow: hidden;
  }
  .meter span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: var(--pap-band, var(--pap-accent));
    transition: width var(--ha-animation-duration-slow, 0.35s) ease;
  }
  .hero .pill {
    display: inline-block;
    margin: var(--ha-space-2, 8px) var(--ha-space-2, 8px) 0 0;
  }
  .trend-button {
    display: block;
    width: 100%;
    margin-top: var(--ha-space-4, 16px);
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
    margin-bottom: var(--ha-space-2, 8px);
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
  .trend-axis {
    display: flex;
    justify-content: space-between;
    margin-top: var(--ha-space-1, 4px);
  }
  .climate {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(140px, 100%), 1fr));
    gap: var(--ha-space-2, 8px);
    margin-top: var(--ha-space-2, 8px);
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
    border-radius: 50%;
    color: var(--pap-accent);
    background: color-mix(in srgb, var(--pap-accent) 14%, transparent);
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
    font-size: var(--ha-font-size-l, 1.1rem);
    font-weight: var(--ha-font-weight-medium, 500);
    font-variant-numeric: tabular-nums;
  }
  .controls-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--ha-space-2, 8px);
  }
  .controls-head .section-title {
    margin: 0;
    color: var(--secondary-text-color);
  }
  .icon-button.plain {
    border: 0;
    color: var(--pap-accent);
  }
  .round-row {
    display: flex;
    justify-content: center;
    gap: var(--ha-space-8, 32px);
    margin-bottom: var(--ha-space-5, 20px);
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
    padding: 18px;
    border-width: 2px;
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
    min-height: 64px;
    border-color: transparent;
    color: var(--pap-accent);
    background: color-mix(in srgb, var(--pap-accent) 12%, transparent);
    font-size: var(--ha-font-size-xl, 20px);
  }
  .mode-button svg {
    width: 30px;
    height: 30px;
  }
  .control-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--ha-space-3, 12px);
    margin-top: var(--ha-space-3, 12px);
  }
  .control-tile {
    border-width: 2px;
  }
  .control-tile[aria-pressed="true"] {
    border-color: transparent;
  }
  dialog {
    width: min(420px, calc(100vw - 32px));
    box-sizing: border-box;
    padding: var(--ha-space-6, 24px);
    border: 0;
    border-radius: var(--ha-border-radius-3xl, 28px);
    background: var(--ha-card-background, var(--card-background-color));
    color: var(--primary-text-color);
    box-shadow: var(--ha-box-shadow-l, 0 12px 48px rgb(0 0 0 / 30%));
  }
  dialog[open] {
    animation: pap-sheet-in var(--ha-animation-duration-normal, 0.25s) ease-out;
  }
  @keyframes pap-sheet-in {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
  }
  .sheet-close {
    position: absolute;
    top: var(--ha-space-3, 12px);
    inset-inline-start: var(--ha-space-3, 12px);
    border: 0;
    color: var(--secondary-text-color);
  }
  .sheet-actions {
    display: flex;
    flex-direction: row-reverse;
    gap: var(--ha-space-2, 8px);
    margin-top: var(--ha-space-6, 24px);
  }
  .sheet-actions .apply,
  .sheet-actions .cancel {
    width: auto;
    margin: 0;
    padding-inline: var(--ha-space-6, 24px);
  }
  /* Home Assistant shows choice dialogs as bottom sheets on phones. */
  @media (max-width: 870px) {
    dialog {
      width: 100%;
      max-width: none;
      margin: auto 0 0;
      border-end-start-radius: 0;
      border-end-end-radius: 0;
      padding-bottom: calc(var(--ha-space-6, 24px) + env(safe-area-inset-bottom, 0px));
    }
    .sheet-actions {
      flex-direction: column;
    }
    .sheet-actions .apply,
    .sheet-actions .cancel {
      width: 100%;
    }
  }
  dialog::backdrop {
    background: rgb(0 0 0 / 45%);
  }
  dialog h3 {
    margin: 0 0 var(--ha-space-5, 20px);
    text-align: center;
    font-size: var(--ha-font-size-xl, 20px);
    font-weight: var(--ha-font-weight-bold, 600);
  }
  .choices {
    display: flex;
    flex-direction: column;
    gap: var(--ha-space-1, 4px);
    max-height: 50vh;
    overflow-y: auto;
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
  .choices.compact {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .choices:focus-visible {
    outline: none;
  }
  .choice svg {
    width: 28px;
    height: 28px;
  }
  .choice:focus-visible,
  .apply:focus-visible,
  .cancel:focus-visible {
    outline-offset: -3px;
  }
  .choice[aria-checked="true"] {
    background: color-mix(in srgb, var(--pap-accent) 12%, transparent);
  }
  .apply,
  .cancel {
    display: block;
    width: 100%;
    margin-top: var(--ha-space-4, 16px);
    border: 0;
    border-radius: var(--ha-border-radius-pill, 9999px);
    font-weight: var(--ha-font-weight-medium, 500);
  }
  .apply {
    min-height: 48px;
    color: var(--ha-color-on-primary-loud, var(--text-primary-color, #fff));
    background: var(--ha-color-fill-primary-loud-resting, var(--primary-color));
  }
  .apply:hover {
    background: var(--ha-color-fill-primary-loud-hover, var(--primary-color));
  }
  .cancel {
    color: var(--pap-accent);
  }
  @container (max-width: 360px) {
    .body {
      padding: 16px;
    }
    .hero {
      margin-inline: -16px;
      padding: 16px;
      gap: 16px;
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
