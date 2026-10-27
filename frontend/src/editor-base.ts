import { LitElement, html } from "lit";
import type { CardConfig, HomeAssistant } from "./types";
import { resolve } from "./discovery";
const booleanFields: Record<string, string[]> = {
  purifier: ["show_presets", "show_speed", "show_filter", "show_pm25"],
  "air-quality": [],
  humidity: ["show_target_control", "show_mode", "show_water_level"],
};
export class PhilipsAirPurifierCardEditor extends LitElement {
  static override properties = { hass: { attribute: false }, config: { state: true } };
  declare hass?: HomeAssistant;
  declare config?: CardConfig;
  setConfig(config: CardConfig) {
    this.config = { ...config };
  }
  protected override render() {
    if (!this.hass || !this.config) return html``;
    const kind = this.config.type.includes("air-quality")
      ? "air-quality"
      : this.config.type.includes("humidity")
        ? "humidity"
        : "purifier";
    const schema: Record<string, unknown>[] = [
      { name: "device_id", required: true, selector: { device: { filter: [{ integration: "philips_airpurifier" }] } } },
      { name: "name", selector: { text: {} } },
    ];
    const role = kind === "air-quality" ? "air" : kind === "humidity" ? "humidifier" : "fan";
    const include = this.config.device_id
      ? {
          include_entities: resolve(this.hass, { type: this.config.type, device_id: this.config.device_id }, role).map(
            (c) => c.id
          ),
        }
      : {};
    if (kind === "air-quality")
      schema.push({
        name: "sensors",
        selector: {
          entity: { multiple: true, ...include, filter: [{ domain: "sensor", integration: "philips_airpurifier" }] },
        },
      });
    else
      schema.push({
        name: "entity",
        selector: { entity: { ...include, filter: [{ domain: role, integration: "philips_airpurifier" }] } },
      });
    for (const name of booleanFields[kind] ?? []) schema.push({ name, selector: { boolean: {} } });
    return html`<ha-form
      .hass=${this.hass}
      .data=${{ ...Object.fromEntries((booleanFields[kind] ?? []).map((name) => [name, true])), ...this.config }}
      .schema=${schema}
      .computeLabel=${(s: { name: string }) => ({ device_id: "Device", entity: "Control entity (optional override)", name: "Name (optional)", sensors: "Air-quality sensors (optional, ordered)" })[s.name] ?? { show_presets: "Show mode controls", show_speed: "Show fan speed", show_filter: "Show filter health", show_pm25: "Show PM2.5", show_target_control: "Show target controls", show_mode: "Show modes", show_water_level: "Show water level" }[s.name] ?? s.name.replaceAll("_", " ")}
      @value-changed=${this.changed}
    ></ha-form>`;
  }
  private changed(event: CustomEvent<{ value: CardConfig }>) {
    event.stopPropagation();
    const next = { ...event.detail.value, type: this.config!.type };
    if (next.device_id !== this.config?.device_id) {
      delete next.entity;
      delete next.sensors;
    }
    for (const key of ["name", "entity", "device_id"] as const) if (!next[key]) delete next[key];
    this.config = next;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: next }, bubbles: true, composed: true }));
  }
}
