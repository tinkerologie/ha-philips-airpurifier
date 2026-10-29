import { css, html, nothing } from "lit";
import { live } from "lit/directives/live.js";
import { PhilipsAirPurifierBaseCard, alert } from "../base-card";
import { styles } from "../styles";
import { finite, strings, stubConfig } from "../discovery";
import { dropIcon, infoIcon, powerIcon } from "../icons";
import type { HomeAssistant, Role } from "../types";
export class PhilipsAirPurifierHumidityCard extends PhilipsAirPurifierBaseCard {
  static override cardType = "philips-airpurifier-humidity-card";
  static override editorTag = "philips-airpurifier-card-editor";
  static override styles = [
    styles,
    css`
      :host {
        --pap-active-color: var(
          --state-humidifier-on-color,
          var(--state-humidifier-active-color, var(--primary-color))
        );
      }
    `,
  ];
  protected readonly controlRole: Role = "humidifier";
  static getStubConfig(hass: HomeAssistant) {
    return stubConfig(hass, this.cardType, "humidifier");
  }
  protected override render() {
    const guard = this.guard();
    const humidifier = this.caps("humidifier")[0];
    if (guard !== nothing || !humidifier)
      return html`<ha-card
        ><div class="body">
          <header>${this.heading("Humidity")}</header>
          ${guard !== nothing ? guard : alert("This device does not expose a humidifier.")}
        </div></ha-card
      >`;
    const state = humidifier.state;
    const a = state?.attributes ?? {};
    const on = state?.state === "on";
    const disabled = humidifier.availability !== "available" || this.busy;
    const target = finite(a.humidity);
    const min = finite(a.min_humidity);
    const max = finite(a.max_humidity);
    const step = finite(a.target_humidity_step) ?? finite(this.caps("target")[0]?.state?.attributes.step);
    const current = finite(a.current_humidity);
    const modes = strings(a.available_modes);
    const water = this.caps("water")[0];
    // Missing/invalid device bounds must never cause guessed writes.
    const targetSupported =
      target !== undefined && min !== undefined && max !== undefined && min < max && step !== undefined && step > 0;
    const format = (n: number) => new Intl.NumberFormat(this.hass?.locale?.language).format(n);
    const unknown = this.t("state.default.unknown", "Unknown");
    const available = humidifier.availability === "available";
    const nextTarget = (direction: number) =>
      targetSupported
        ? Math.min(max, Math.max(min, Number((min + Math.round((target - min) / step + direction) * step).toFixed(6))))
        : undefined;
    return html`<ha-card class=${this.stateClass(humidifier)}
      ><div class="body">
        <header>
          ${this.heading("Humidity")}
          <div class="header-actions">
            <button
              class="icon-button plain"
              aria-label="Open humidifier details"
              @click=${() => this.moreInfo(humidifier.id)}
            >
              ${infoIcon()}
            </button>
            <button
              class="icon-button ${on ? "active" : ""}"
              aria-label=${on ? "Turn humidifier off" : "Turn humidifier on"}
              ?disabled=${disabled}
              @click=${() => this.action(humidifier, on ? "turn_off" : "turn_on")}
            >
              ${powerIcon()}
            </button>
          </div>
        </header>
        <div class="hero">
          ${dropIcon()}
          <div>
            <div class="secondary">Current humidity</div>
            <div class="value">
              ${!available ? this.value(humidifier) : current !== undefined ? html`${format(current)}<span class="unit"> %</span>` : unknown}
            </div>
            <div class="state">
              ${!available ? "Check the device connection" : typeof a.action === "string" && a.action ? this.attributeLabel(humidifier, "action", a.action) : this.value(humidifier)}
            </div>
          </div>
        </div>
        ${
          this.config.show_target_control !== false
            ? html`<div class="section-title" id="target-title">Target humidity</div>
                <div class="stepper" role="group" aria-labelledby="target-title">
                  <button
                    class="icon-button"
                    aria-label="Decrease target humidity"
                    ?disabled=${disabled || !targetSupported || target <= min}
                    @click=${() => this.action(humidifier, "set_humidity", { humidity: nextTarget(-1) })}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /></svg></button
                  ><output class="target" aria-live="polite"
                    >${target !== undefined ? html`${format(target)}<span class="unit"> %</span>` : unknown}</output
                  ><button
                    class="icon-button"
                    aria-label="Increase target humidity"
                    ?disabled=${disabled || !targetSupported || target >= max}
                    @click=${() => this.action(humidifier, "set_humidity", { humidity: nextTarget(1) })}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M12 5v14" /></svg>
                  </button>
                </div>
                ${available && !targetSupported ? alert("Target controls need the device’s humidity bounds and step.") : nothing}`
            : nothing
        }
        ${
          this.config.show_mode !== false && modes.length
            ? html`<div class="section">
                <fieldset class="segmented" ?disabled=${disabled}>
                  <legend class="section-title">Mode</legend>
                  <div class="segments">
                    ${modes.map(
                      (mode) =>
                        html`<label class="segment"
                          ><input
                            type="radio"
                            name="mode"
                            .value=${mode}
                            .checked=${live(on && a.mode === mode)}
                            @change=${() => this.action(humidifier, "set_mode", { mode })}
                          /><span>${this.attributeLabel(humidifier, "mode", mode)}</span></label
                        >`
                    )}
                  </div>
                </fieldset>
              </div>`
            : nothing
        }
        ${
          this.config.show_water_level !== false && water
            ? html`<div class="section">
                <button class="row" aria-label="Water level details" @click=${() => this.moreInfo(water.id)}>
                  <span>Water level</span><strong>${this.value(water)}</strong>
                </button>
              </div>`
            : nothing
        }
        ${this.feedback()}
      </div></ha-card
    >`;
  }
}
