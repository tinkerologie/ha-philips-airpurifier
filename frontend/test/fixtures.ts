import type { HomeAssistant, HassEntity, RegistryEntity } from "../src/types";
export function fixture(model = "AC3858/51") {
  const calls: { domain: string; service: string; data: Record<string, unknown> }[] = [];
  const states: Record<string, HassEntity> = {};
  const entities: Record<string, RegistryEntity> = {};
  function add(id: string, key: string, state: string, attributes: Record<string, unknown> = {}, device = "purifier") {
    states[id] = { entity_id: id, state, attributes: { friendly_name: key.replaceAll("_", " "), ...attributes } };
    entities[id] = { entity_id: id, device_id: device, platform: "philips_airpurifier", translation_key: key };
  }
  if (model !== "HU1509")
    add("fan.test", "pap", "on", {
      preset_mode: "auto",
      preset_modes: ["auto", "sleep", "turbo"],
      percentage: 50,
      percentage_step: 25,
      supported_features: 57,
    });
  if (model !== "HU1509") {
    add("sensor.pm", "pm25", "6", { device_class: "pm25", unit_of_measurement: "µg/m³" });
    add("sensor.allergen", "indoor_allergen_index", "2");
    add("sensor.tvoc", "total_volatile_organic_compounds", "3");
    add("sensor.humidity", "humidity", "62", { device_class: "humidity", unit_of_measurement: "%" });
    add("sensor.temperature", "temperature", "25.6", { device_class: "temperature", unit_of_measurement: "°C" });
    add("sensor.filter", "nanoprotect_filter", "96", {
      unit_of_measurement: "%",
      "Replacement Status": "Good condition",
    });
    add("switch.lock", "child_lock", "off");
    add("light.display", "display_backlight", "off");
    add("switch.auto_plus", "auto_plus", "on");
    add("select.lamp", "lamp_mode", "off", { options: ["off", "air_quality", "ambient_light_mode"] });
    add("select.timer", "timer", "Off", { options: ["Off", "1h", "2h"] });
  }
  if (model !== "AC3858/51") {
    add("humidifier.test", "pap", "on", {
      humidity: 50,
      current_humidity: 47,
      min_humidity: model === "HU1509" ? 30 : 40,
      max_humidity: 70,
      action: "idle",
      available_modes: ["auto", "sleep"],
      mode: "auto",
    });
    add("number.target", "humidity_target", "50", { min: 0, max: 100, step: 10 });
    add("sensor.water", "water_level", "75", { unit_of_measurement: "%" });
  }
  const hass: HomeAssistant = {
    states,
    entities,
    devices: { purifier: { id: "purifier", name: "Office 1", model } },
    locale: { language: "en" },
    formatEntityState: (e, state = e.state) =>
      `${state}${e.attributes.unit_of_measurement ? ` ${e.attributes.unit_of_measurement}` : ""}`,
    callService: async (domain, service, data) => {
      calls.push({ domain, service, data });
    },
  };
  return { hass, calls, add };
}
