import { html, nothing } from "lit";
import { PhilipsAirPurifierBaseCard } from "../base-card";
import { stubConfig } from "../discovery";
import type { HomeAssistant, Role } from "../types";
export class PhilipsAirPurifierAirQualityCard extends PhilipsAirPurifierBaseCard {
  static override cardType = "philips-airpurifier-air-quality-card";
  static override editorTag = "philips-airpurifier-card-editor";
  protected readonly controlRole: Role = "air";
  static getStubConfig(hass: HomeAssistant) {
    return stubConfig(hass, this.cardType, "air");
  }
  protected override render() {
    const guard = this.guard();
    const sensors = this.caps("air");
    return html`<ha-card
      ><div class="body">
        <header>${this.heading("Air quality")}</header>
        ${
          guard !== nothing
            ? guard
            : !sensors.length
              ? html`<div class="notice">This device does not expose air-quality sensors.</div>`
              : html`<div class="tiles">
                  ${sensors.map(
                    (c) =>
                      html`<button
                        class="tile"
                        aria-label=${`Details for ${this.label(c)}`}
                        @click=${() => this.moreInfo(c.id)}
                      >
                        <span class="secondary">${this.label(c)}</span>
                        <div class="value">${this.reading(c)}</div>
                        <span class="secondary"
                          >${c.key === "indoor_allergen_index" ? "Allergen index · 1–12" : c.key === "total_volatile_organic_compounds" ? "TVOC index" : c.key === "gas_level" ? "Gas index" : c.key === "pm25" || c.state?.attributes.device_class === "pm25" ? "Fine particles" : "Sensor reading"}</span
                        >
                      </button>`
                  )}
                </div>`
        }
      </div></ha-card
    >`;
  }
}
