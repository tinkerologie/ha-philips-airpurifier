import { html, nothing } from "lit";
import { PhilipsAirPurifierBaseCard } from "../base-card";
import { finite, strings, stubConfig } from "../discovery";
import { dropIcon, powerIcon } from "../icons";
import type { HomeAssistant, Role } from "../types";
export class PhilipsAirPurifierHumidityCard extends PhilipsAirPurifierBaseCard {
  static override cardType = "philips-airpurifier-humidity-card";
  static override editorTag = "philips-airpurifier-card-editor";
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
          ${this.heading("Humidity")}${guard !== nothing ? guard : html`<div class="notice">This device does not expose a humidifier.</div>`}
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
    const nextTarget = (direction: number) =>
      targetSupported
        ? Math.min(max, Math.max(min, Number((min + Math.round((target - min) / step + direction) * step).toFixed(6))))
        : undefined;
    return html`<ha-card
      ><div class="body">
        <header>
          ${this.heading("Humidity")}<button
            class="icon-button"
            aria-label=${on ? "Turn humidifier off" : "Turn humidifier on"}
            aria-pressed=${on}
            ?disabled=${disabled}
            @click=${() => this.action(humidifier, on ? "turn_off" : "turn_on")}
          >
            ${powerIcon()}
          </button>
        </header>
        <div class="hero">
          ${dropIcon()}
          <div>
            <div class="secondary">Current humidity</div>
            <div class="value">
              ${humidifier.availability !== "available" ? this.value(humidifier) : current !== undefined ? html`${format(current)}<span class="unit"> %</span>` : "Unknown"}
            </div>
            <div class="state mode">
              ${humidifier.availability !== "available" ? this.value(humidifier) : String(a.action ?? (on ? "On" : "Off")).replaceAll("_", " ")}
            </div>
          </div>
        </div>
        ${
          this.config.show_target_control !== false
            ? html`<div class="section-title">Target humidity</div>
                <div class="stepper">
                  <button
                    aria-label="Decrease target humidity"
                    ?disabled=${disabled || !targetSupported || target <= min}
                    @click=${() => this.action(humidifier, "set_humidity", { humidity: nextTarget(-1) })}
                  >
                    −</button
                  ><span class="target">${target !== undefined ? `${format(target)}%` : "Unknown"}</span
                  ><button
                    aria-label="Increase target humidity"
                    ?disabled=${disabled || !targetSupported || target >= max}
                    @click=${() => this.action(humidifier, "set_humidity", { humidity: nextTarget(1) })}
                  >
                    +
                  </button>
                </div>
                ${!targetSupported ? html`<div class="secondary">Target controls need the device’s humidity bounds and step.</div>` : nothing}`
            : nothing
        }
        ${
          this.config.show_mode !== false && modes.length
            ? html`<div class="section">
                <div class="section-title">Mode</div>
                <div class="chips">
                  ${modes.map((mode) => html`<button class="mode" aria-label=${`Set mode ${mode.replaceAll("_", " ")}`} aria-pressed=${a.mode === mode && on} ?disabled=${disabled} @click=${() => this.action(humidifier, "set_mode", { mode })}>${mode.replaceAll("_", " ")}</button>`)}
                </div>
              </div>`
            : nothing
        }
        ${
          this.config.show_water_level !== false && water
            ? html`<div class="section">
                <button class="filter" aria-label="Water level details" @click=${() => this.moreInfo(water.id)}>
                  <span>Water level</span><strong>${this.value(water)}</strong>
                </button>
              </div>`
            : nothing
        }
        <div class="section actions">
          <button aria-label="Open humidifier details" @click=${() => this.moreInfo(humidifier.id)}>
            Device details ↗
          </button>
        </div>
        ${this.feedback()}
      </div></ha-card
    >`;
  }
}
