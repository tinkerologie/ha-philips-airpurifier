import { html, nothing } from "lit";
import { PhilipsAirPurifierBaseCard } from "../base-card";
import { finite, strings, stubConfig } from "../discovery";
import { powerIcon, purifierIcon, ring } from "../icons";
import type { HomeAssistant, Role } from "../types";
export class PhilipsAirPurifierPurifierCard extends PhilipsAirPurifierBaseCard {
  static override cardType = "philips-airpurifier-purifier-card";
  static override editorTag = "philips-airpurifier-card-editor";
  protected readonly controlRole: Role = "fan";
  static getStubConfig(hass: HomeAssistant) {
    return stubConfig(hass, this.cardType, "fan");
  }
  protected override render() {
    const guard = this.guard();
    const fan = this.caps("fan")[0];
    if (guard !== nothing || !fan)
      return html`<ha-card
        ><div class="body">
          ${this.heading("Purifier")}${guard !== nothing ? guard : html`<div class="notice">This device does not expose a purifier fan.</div>`}
        </div></ha-card
      >`;
    const state = fan.state;
    const disabled = fan.availability !== "available" || this.busy;
    const on = state?.state === "on";
    const presets = strings(state?.attributes.preset_modes);
    const features = finite(state?.attributes.supported_features) ?? 0;
    const percentage = finite(state?.attributes.percentage);
    const step = finite(state?.attributes.percentage_step);
    const pm25 = this.caps("pm25")[0];
    return html`<ha-card
      ><div class="body">
        <header>
          ${this.heading("Purifier")}<button
            class="icon-button"
            aria-label=${on ? "Turn purifier off" : "Turn purifier on"}
            aria-pressed=${on}
            ?disabled=${disabled}
            @click=${() => this.action(fan, on ? "turn_off" : "turn_on")}
          >
            ${powerIcon()}
          </button>
        </header>
        <div class="hero">
          ${purifierIcon()}
          <div>
            ${
              this.config.show_pm25 !== false && pm25
                ? html`<div class="secondary">PM2.5</div>
                    <div class="value">${this.reading(pm25)}</div>`
                : html`<div class="value">
                    ${fan.availability === "available" ? (on ? "On" : "Off") : this.value(fan)}
                  </div>`
            }
            <div class="state">
              ${fan.availability !== "available" ? this.value(fan) : on ? String(state?.attributes.preset_mode ?? "Purifying").replaceAll("_", " ") : "Standby"}
            </div>
          </div>
        </div>
        ${
          this.config.show_presets !== false && presets.length
            ? html`<div class="section-title">Mode</div>
                <div class="chips">
                  ${presets.map((p) => html`<button class="mode" aria-label=${`Set mode ${p.replaceAll("_", " ")}`} aria-pressed=${state?.attributes.preset_mode === p && on} ?disabled=${disabled} @click=${() => this.action(fan, "set_preset_mode", { preset_mode: p })}>${p.replaceAll("_", " ")}</button>`)}
                </div>`
            : nothing
        }
        ${this.config.show_speed !== false && features & 1 && step && step > 0 ? html`<div class="section"><label for="speed">Fan speed · ${percentage === undefined ? "Automatic" : `${percentage}%`}</label><input id="speed" aria-label="Fan speed" type="range" min="0" max="100" step=${step} .value=${String(percentage ?? 0)} ?disabled=${disabled} @change=${(e: Event) => this.action(fan, "set_percentage", { percentage: Number((e.target as HTMLInputElement).value) })} /></div>` : nothing}
        ${this.auxiliary()}
        ${
          this.config.show_filter !== false && this.caps("filter").length
            ? html`<div class="section">
                <div class="section-title">Device health</div>
                ${this.caps("filter").map((f) => {
                  const percent = f.state?.attributes.unit_of_measurement === "%" ? finite(f.state.state) : undefined;
                  return html`<button
                    class="filter"
                    aria-label=${`Details for ${this.label(f)}`}
                    @click=${() => this.moreInfo(f.id)}
                  >
                    ${percent !== undefined ? ring(percent) : nothing}<span class="filter-text"
                      ><span class="filter-name">${this.label(f)}</span
                      ><span class="filter-value">${this.value(f)}</span
                      ><span class="secondary">
                        ·
                        ${f.availability === "available" ? String(f.state?.attributes["Replacement Status"] ?? "Filter life remaining") : "Check device connection"}</span
                      ></span
                    >
                  </button>`;
                })}
              </div>`
            : nothing
        }
        <div class="section actions">
          <button aria-label="Open purifier details" @click=${() => this.moreInfo(fan.id)}>Device details ↗</button>
        </div>
        ${this.feedback()}
      </div></ha-card
    >`;
  }
  private auxiliary() {
    const lock = this.caps("lock")[0];
    const light = this.caps("light")[0];
    if (!lock && !light) return nothing;
    return html`<div class="section actions">
      ${[lock, light].map((c) => (c ? html`<button aria-label=${c === lock ? "Toggle child lock" : "Toggle display light"} aria-pressed=${c.state?.state === "on"} ?disabled=${this.busy || c.availability !== "available"} @click=${() => this.action(c, c.state?.state === "on" ? "turn_off" : "turn_on")}>${c === lock ? "Child lock" : "Display"} · ${c.availability === "available" ? (c.state?.state === "on" ? "On" : "Off") : this.value(c)}</button>` : nothing))}
    </div>`;
  }
}
