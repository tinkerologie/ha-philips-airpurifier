import { html, nothing, type PropertyValues } from "lit";
import { PhilipsAirPurifierBaseCard } from "../base-card";
import { finite, stubConfig } from "../discovery";
import { humidityIcon, temperatureIcon } from "../icons";
import {
  PM25_GOOD_LIMIT,
  band,
  bandLabel,
  bandSummary,
  byDisplayOrder,
  humidityComfort,
  fraction,
  metric,
  worst,
} from "../quality";
import { fetchTrend, trendChart, type Point } from "../trend";
import type { Capability, HomeAssistant, Role } from "../types";
export class PhilipsAirPurifierAirQualityCard extends PhilipsAirPurifierBaseCard {
  static override cardType = "philips-airpurifier-air-quality-card";
  static override editorTag = "philips-airpurifier-card-editor";
  protected readonly controlRole: Role = "air";
  static override properties = { ...PhilipsAirPurifierBaseCard.properties, trend: { state: true } };
  declare private trend: Point[];
  private trendKey = "";
  private trendAt = 0;
  constructor() {
    super();
    this.trend = [];
  }
  static getStubConfig(hass: HomeAssistant) {
    return stubConfig(hass, this.cardType, "air");
  }
  protected override updated(changed: PropertyValues<this>): void {
    super.updated(changed);
    const pm25 = this.config.show_trend !== false && this.hass ? this.caps("pm25")[0] : undefined;
    if (!pm25 || !this.hass) {
      this.trendKey = "";
      if (this.trend.length) this.trend = [];
      return;
    }
    // Hourly statistics change slowly; refresh at most every 15 minutes.
    if (this.trendKey === pm25.id && Date.now() - this.trendAt < 900_000) return;
    this.trendKey = pm25.id;
    this.trendAt = Date.now();
    fetchTrend(this.hass, pm25.id).then(
      (points) => {
        if (this.trendKey === pm25.id) this.trend = points;
      },
      () => {
        // The trend is decorative; readings stay usable when statistics fail.
        if (this.trendKey === pm25.id) this.trend = [];
      }
    );
  }
  protected override render() {
    const guard = this.guard();
    const sensors = this.config.sensors?.length ? this.caps("air") : this.caps("air").sort(byDisplayOrder);
    const overall = worst(sensors.map(band));
    return html`<ha-card class=${overall ? `band-${overall}` : ""}
      ><div class="body">
        <header>
          ${this.heading("Air quality")}${
            overall && guard === nothing ? html`<span class="pill">${bandLabel[overall]}</span>` : nothing
          }
        </header>
        ${
          guard !== nothing
            ? guard
            : !sensors.length
              ? html`<div class="notice">This device does not expose air-quality sensors.</div>`
              : html`${overall ? html`<p class="summary">${bandSummary[overall]}</p>` : nothing}
                  <div class="metrics">${sensors.map((c) => this.tile(c))}</div>
                  ${this.renderTrend()} ${this.renderClimate()}`
        }
      </div></ha-card
    >`;
  }
  private renderClimate() {
    if (this.config.show_climate === false) return nothing;
    const humidity = this.caps("humidity")[0];
    const temperature = this.caps("temperature")[0];
    if (!humidity && !temperature) return nothing;
    const item = (c: Capability, name: string, icon: unknown, hint?: string) =>
      html`<button
        class="climate-item"
        aria-label=${`Details for ${this.label(c)}`}
        @click=${() => this.moreInfo(c.id)}
      >
        <span class="climate-icon">${icon}</span>
        <span class="climate-text">
          <span class="secondary">${name}</span>
          <span class="climate-value">${this.reading(c)}</span>
          ${hint ? html`<span class="secondary">${hint}</span>` : nothing}
        </span>
      </button>`;
    return html`<div class="climate">
      ${humidity ? item(humidity, "Humidity", humidityIcon(), humidityComfort(humidity)) : nothing}
      ${temperature ? item(temperature, "Temperature", temperatureIcon()) : nothing}
    </div>`;
  }
  private renderTrend() {
    const pm25 = this.config.show_trend !== false ? this.caps("pm25")[0] : undefined;
    if (!pm25 || this.trend.length < 2) return nothing;
    const unit = String(pm25.state?.attributes.unit_of_measurement ?? "");
    return html`<button
      class="trend-button ${band(pm25) ? `band-${band(pm25)}` : ""}"
      aria-label="Open PM2.5 history"
      @click=${() => this.moreInfo(pm25.id)}
    >
      ${trendChart(this.trend, unit, PM25_GOOD_LIMIT, this.hass?.locale?.language)}
    </button>`;
  }
  private tile(c: Capability) {
    const m = metric(c);
    const level = band(c);
    const width = fraction(c);
    const n = finite(c.state?.state);
    const short = c.availability === "available" && n !== undefined && (m?.prefix || m?.suffix);
    return html`<button
      class="tile ${level ? `band-${level}` : ""}"
      aria-label=${`Details for ${this.label(c)}${level ? `, ${bandLabel[level]}` : ""}`}
      @click=${() => this.moreInfo(c.id)}
    >
      <span class="metric-label">${m?.label ?? this.label(c)}</span>
      <span class="value"
        >${short ? html`${m.prefix ?? ""}${n}${m.suffix ? html`<span class="unit"> ${m.suffix}</span>` : nothing}` : c.availability !== "available" ? "—" : this.reading(c)}</span
      >
      ${
        width !== undefined
          ? html`<span class="meter" aria-hidden="true"><span style="width:${(width * 100).toFixed(1)}%"></span></span>`
          : nothing
      }
      <span class="secondary"
        >${c.availability !== "available" ? this.value(c) : level ? bandLabel[level] : (m?.hint ?? "Sensor reading")}</span
      >
    </button>`;
  }
}
