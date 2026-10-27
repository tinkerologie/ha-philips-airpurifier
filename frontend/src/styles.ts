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
    min-height: 44px;
    border: 1px solid var(--divider-color);
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
    outline: 3px solid var(--primary-color);
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
    border-top: 1px solid var(--divider-color);
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
    stroke: var(--divider-color);
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
