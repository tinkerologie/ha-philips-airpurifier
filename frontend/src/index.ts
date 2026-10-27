import { PhilipsAirPurifierPurifierCard } from "./cards/purifier-card";
import { PhilipsAirPurifierAirQualityCard } from "./cards/air-quality-card";
import { PhilipsAirPurifierHumidityCard } from "./cards/humidity-card";
import { PhilipsAirPurifierCardEditor } from "./editor-base";
import { DOMAIN, resolve } from "./discovery";
import type { Role } from "./types";
const definitions: [string, CustomElementConstructor][] = [
  ["philips-airpurifier-purifier-card", PhilipsAirPurifierPurifierCard],
  ["philips-airpurifier-air-quality-card", PhilipsAirPurifierAirQualityCard],
  ["philips-airpurifier-humidity-card", PhilipsAirPurifierHumidityCard],
  ["philips-airpurifier-card-editor", PhilipsAirPurifierCardEditor],
];
export function registerCards(): void {
  for (const [tag, ctor] of definitions) if (!customElements.get(tag)) customElements.define(tag, ctor);
  window.customCards ??= [];
  for (const [suffix, name, role, description] of [
    ["purifier", "Philips Purifier", "fan", "Power, modes, air quality and filter health."],
    ["air-quality", "Philips Air Quality", "air", "Your device’s particle, allergen and gas readings."],
    ["humidity", "Philips Humidity", "humidifier", "Humidity, target controls and water level."],
  ] as const) {
    const type = `philips-airpurifier-${suffix}-card`;
    if (window.customCards.some((c) => c.type === type)) continue;
    window.customCards.push({
      type,
      name,
      description,
      preview: true,
      documentationURL: "https://github.com/tinkerologie/ha-philips-airpurifier#dashboard-cards",
      getEntitySuggestion(hass, entityId) {
        const e = hass.entities?.[entityId];
        if (e?.platform !== DOMAIN || !e.device_id) return null;
        const config = { type: `custom:${type}`, device_id: e.device_id };
        return resolve(hass, config, role as Role).some((c) => c.id === entityId) ? { config } : null;
      },
    });
  }
}
registerCards();
