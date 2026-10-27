import type { Capability, CardConfig, HomeAssistant, RegistryEntity, Role } from "./types";
export const DOMAIN = "philips_airpurifier";
const airKeys = new Set(["pm25", "indoor_allergen_index", "gas_level", "total_volatile_organic_compounds"]);
const filterKeys = new Set([
  "pre_filter",
  "pre_filter_cleaning",
  "hepa_filter",
  "active_carbon_filter",
  "wick",
  "nanoprotect_filter",
]);
export function deviceIds(hass: HomeAssistant): string[] {
  return [
    ...new Set(
      Object.values(hass.entities ?? {})
        .filter((e) => e.platform === DOMAIN && e.device_id)
        .map((e) => e.device_id!)
    ),
  ];
}
export function activeDevice(hass: HomeAssistant, config: CardConfig): string | undefined {
  if (config.device_id) return config.device_id;
  if (config.entity) return hass.entities?.[config.entity]?.device_id ?? undefined;
  return deviceIds(hass)[0];
}
function matches(hass: HomeAssistant, e: RegistryEntity, role: Role): boolean {
  const domain = e.entity_id.split(".")[0];
  const key = e.translation_key;
  const deviceClass = hass.states[e.entity_id]?.attributes.device_class;
  switch (role) {
    case "fan":
    case "humidifier":
    case "light":
      return domain === role;
    case "pm25":
      return domain === "sensor" && (key === "pm25" || deviceClass === "pm25");
    case "humidity":
      return domain === "sensor" && (key === "humidity" || deviceClass === "humidity");
    case "air":
      return domain === "sensor" && (airKeys.has(key ?? "") || deviceClass === "pm25");
    case "filter":
      return (
        domain === "sensor" &&
        (filterKeys.has(key ?? "") || "Filter Life Remaining" in (hass.states[e.entity_id]?.attributes ?? {}))
      );
    case "water":
      return domain === "sensor" && key === "water_level";
    case "target":
      return domain === "number" && key === "humidity_target";
    case "lock":
      return domain === "switch" && key === "child_lock";
  }
}
export function capability(hass: HomeAssistant, id: string): Capability {
  const state = hass.states[id];
  return {
    id,
    state,
    key: hass.entities?.[id]?.translation_key,
    availability:
      !state || state.state === "unavailable" ? "unavailable" : state.state === "unknown" ? "unknown" : "available",
  };
}
export function resolve(hass: HomeAssistant, config: CardConfig, role: Role): Capability[] {
  if (config.entity && (role === "fan" || role === "humidifier")) return [capability(hass, config.entity)];
  if (role === "air" && config.sensors) return config.sensors.map((id) => capability(hass, id));
  const device = activeDevice(hass, config);
  if (!device) return [];
  return Object.values(hass.entities ?? {})
    .filter((e) => e.platform === DOMAIN && e.device_id === device && !e.disabled_by && matches(hass, e, role))
    .map((e) => capability(hass, e.entity_id));
}
export function stubConfig(hass: HomeAssistant, type: string, role: Role): Omit<CardConfig, "type"> {
  const device_id = deviceIds(hass).find((id) => resolve(hass, { type, device_id: id }, role).length > 0);
  return device_id ? { device_id } : {};
}
export function finite(value: unknown): number | undefined {
  if ((typeof value !== "string" && typeof value !== "number") || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}
export function strings(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
}
