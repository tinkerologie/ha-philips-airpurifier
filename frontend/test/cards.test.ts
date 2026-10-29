import { expect, fixture as mount, html, oneEvent } from "@open-wc/testing";
import { fixture } from "./fixtures";
import { registerCards } from "../src/index";
import { PhilipsAirPurifierPurifierCard } from "../src/cards/purifier-card";
import { PhilipsAirPurifierHumidityCard } from "../src/cards/humidity-card";
import { PhilipsAirPurifierAirQualityCard } from "../src/cards/air-quality-card";
import type { PhilipsAirPurifierCardEditor } from "../src/editor-base";
import { resolve, finite } from "../src/discovery";
import type { CardConfig } from "../src/types";
async function card<
  T extends PhilipsAirPurifierPurifierCard | PhilipsAirPurifierHumidityCard | PhilipsAirPurifierAirQualityCard,
>(tag: string, model = "AC3858/51", options: Partial<CardConfig> = {}) {
  const f = fixture(model);
  const element = document.createElement(tag) as T;
  element.setConfig({ type: `custom:${tag}`, device_id: "purifier", ...options });
  element.hass = { ...f.hass, states: { ...f.hass.states } };
  await mount(element);
  await element.updateComplete;
  return { ...f, element, root: element.shadowRoot! };
}
const purifier = "philips-airpurifier-purifier-card";
const humidity = "philips-airpurifier-humidity-card";
const air = "philips-airpurifier-air-quality-card";
describe("Philips dashboard cards", () => {
  it("registers once and supplies picker metadata and suggestions", () => {
    registerCards();
    registerCards();
    expect(window.customCards?.filter((c) => c.type.startsWith("philips-")).length).eq(3);
    const { hass } = fixture();
    expect(window.customCards?.[0]?.getEntitySuggestion(hass, "fan.test")?.config.device_id).eq("purifier");
    expect(window.customCards?.[0]?.getEntitySuggestion(hass, "fan.other")).eq(null);
  });
  it("validates configuration and supports sizing and stubs", () => {
    const e = new PhilipsAirPurifierPurifierCard();
    for (const config of [
      { type: "bad" },
      { type: `custom:${purifier}`, show_speed: "yes" },
      { type: `custom:${purifier}`, entity: "sensor.pm" },
      { type: `custom:${purifier}`, sensors: [false] },
    ])
      expect(() => e.setConfig(config as CardConfig)).to.throw();
    expect(e.getGridOptions().columns).eq(12);
    expect(e.getCardSize()).greaterThan(0);
    expect(PhilipsAirPurifierPurifierCard.getStubConfig(fixture().hass).device_id).eq("purifier");
    expect(PhilipsAirPurifierHumidityCard.getStubConfig(fixture("HU1509").hass).device_id).eq("purifier");
    expect(PhilipsAirPurifierAirQualityCard.getStubConfig(fixture().hass).device_id).eq("purifier");
  });
  it("renders real metrics, filter health and power/mode/speed service payloads", async () => {
    const { element, root, calls } = await card(purifier);
    expect(root.textContent).contains("6 µg/m³");
    expect(root.textContent).contains("96 %");
    (root.querySelector('[aria-label="Turn purifier off"]') as HTMLButtonElement).click();
    await element.updateComplete;
    await new Promise((r) => setTimeout(r));
    expect(calls[0]).deep.eq({ domain: "fan", service: "turn_off", data: { entity_id: "fan.test" } });
    const choose = async (opener: string, choice: string) => {
      (root.querySelector(opener) as HTMLButtonElement).click();
      await element.updateComplete;
      const dialog = root.querySelector("dialog")!;
      expect(dialog.open).eq(true);
      [...dialog.querySelectorAll<HTMLButtonElement>(".choice")].find((b) => b.textContent?.trim() === choice)!.click();
      await element.updateComplete;
      expect(dialog.querySelector('[aria-checked="true"]')?.textContent?.trim()).eq(choice);
      (dialog.querySelector(".apply") as HTMLButtonElement).click();
      await new Promise((r) => setTimeout(r));
      await element.updateComplete;
      expect(root.querySelector("dialog")).eq(null);
    };
    await choose(".mode-button", "Sleep");
    expect(calls[1]?.data).deep.eq({ entity_id: "fan.test", preset_mode: "sleep" });
    await choose('[aria-label^="Fan speed"]', "Speed 3");
    expect(calls[2]?.data).deep.eq({ entity_id: "fan.test", percentage: 75 });
    await choose('[aria-label^="Fan speed"]', "Auto");
    expect(calls[3]?.data).deep.eq({ entity_id: "fan.test", preset_mode: "auto" });
    await choose('[aria-label^="Light"]', "Air quality");
    expect(calls[4]).deep.eq({
      domain: "select",
      service: "select_option",
      data: { entity_id: "select.lamp", option: "air_quality" },
    });
    await choose('[aria-label^="Timer"]', "2h");
    expect(calls[5]?.data).deep.eq({ entity_id: "select.timer", option: "2h" });
  });
  it("mirrors the Philips app controls panel", async () => {
    const { element, hass, root, calls } = await card(purifier);
    expect(root.querySelector(".mode-button")?.textContent).contains("Auto+");
    expect(root.querySelector('[aria-label^="Fan speed"]')?.getAttribute("aria-label")).eq("Fan speed: Speed 2");
    expect(root.querySelector('[aria-label^="Display light"]')?.getAttribute("aria-label")).eq("Display light: off");
    (root.querySelector('[aria-label="Toggle child lock"]') as HTMLButtonElement).click();
    await new Promise((r) => setTimeout(r));
    (root.querySelector('[aria-label^="Display light"]') as HTMLButtonElement).click();
    await new Promise((r) => setTimeout(r));
    expect(calls.map((c) => `${c.domain}.${c.service}`)).deep.eq(["switch.turn_on", "light.turn_on"]);
    (root.querySelector(".mode-button") as HTMLButtonElement).click();
    await element.updateComplete;
    expect([...root.querySelectorAll(".choice")].map((c) => c.textContent?.trim())).deep.eq([
      "Auto+",
      "Sleep",
      "Turbo",
    ]);
    (root.querySelector(".cancel") as HTMLButtonElement).click();
    await element.updateComplete;
    expect(root.querySelector("dialog")).eq(null);
    expect(calls.length).eq(2);
    let events = 0;
    element.addEventListener("hass-more-info", () => events++);
    (root.querySelector('[aria-label="Open purifier details"]') as HTMLButtonElement).click();
    expect(events).eq(1);
    const fan = hass.states["fan.test"]!;
    hass.states["fan.test"] = { ...fan, state: "off" };
    hass.states["switch.auto_plus"] = { ...hass.states["switch.auto_plus"]!, state: "off" };
    hass.states["switch.lock"] = { ...hass.states["switch.lock"]!, state: "on" };
    element.hass = {
      ...hass,
      states: { ...hass.states },
      formatEntityAttributeValue: (_e, _a, v) => (v === "turbo" ? "Turbo boost" : String(v)),
    };
    await element.updateComplete;
    expect(root.querySelector(".mode-button")?.textContent).contains("Choose a mode");
    expect(root.querySelector('[aria-label^="Fan speed"]')?.getAttribute("aria-label")).eq("Fan speed: Off");
    expect(root.querySelector(".hero .state")?.textContent?.trim()).eq("Standby");
    (root.querySelector(".mode-button") as HTMLButtonElement).click();
    await element.updateComplete;
    expect([...root.querySelectorAll(".choice")].map((c) => c.textContent?.trim())).deep.eq([
      "Auto",
      "Sleep",
      "Turbo boost",
    ]);
    root.querySelector("dialog")!.dispatchEvent(new Event("cancel"));
    await element.updateComplete;
    expect(root.querySelector("dialog")).eq(null);
  });
  it("hides controls the device or config does not offer", async () => {
    const { hass, root } = await card(purifier, "AC3858/51", { show_presets: false, show_speed: false });
    expect(root.querySelector(".mode-button")).eq(null);
    expect(root.querySelector('[aria-label^="Fan speed"]')).eq(null);
    const {
      "switch.lock": _l,
      "light.display": _d,
      "select.lamp": _s,
      "select.timer": _t,
      ...entities
    } = hass.entities!;
    const bare = await card(purifier);
    bare.element.hass = { ...bare.hass, entities };
    await bare.element.updateComplete;
    expect(bare.root.querySelector('[aria-label="Toggle child lock"]')).eq(null);
    expect(bare.root.querySelectorAll(".control-tile").length).eq(1);
    const fan = bare.hass.states["fan.test"]!;
    bare.element.hass = {
      ...bare.hass,
      entities,
      states: { ...bare.hass.states, "fan.test": { ...fan, attributes: { ...fan.attributes, preset_mode: null } } },
    };
    await bare.element.updateComplete;
    expect(bare.root.querySelector(".mode-button")?.textContent).contains("Manual");
  });
  it("never crosses devices or assumes fan support", async () => {
    const { root, hass } = await card(purifier, "HU1509");
    expect(root.textContent).contains("does not expose a purifier fan");
    expect(resolve(hass, { type: "", device_id: "missing" }, "humidifier")).deep.eq([]);
    const other = await card(purifier, "AC3858/51", { device_id: "missing" });
    expect(other.root.textContent).contains("could not be found");
  });
  it("handles unavailable, missing and unknown sensors independently", async () => {
    const { hass, element, root } = await card(air, "AC3858/51", {
      sensors: ["sensor.pm", "sensor.tvoc"],
    });
    hass.states = { ...hass.states };
    hass.states["sensor.pm"] = { ...hass.states["sensor.pm"]!, state: "unknown" };
    element.hass = { ...hass };
    await element.updateComplete;
    expect(root.textContent).contains("Unknown");

    expect(root.textContent).contains("TVOC index");
    expect(root.textContent).contains("3");
  });
  it("disables offline controls and reports rejected services", async () => {
    const { hass, element, root, calls } = await card(purifier);
    hass.states = { ...hass.states };
    hass.states["fan.test"] = { ...hass.states["fan.test"]!, state: "unavailable" };
    element.hass = { ...hass };
    await element.updateComplete;
    expect((root.querySelector('[aria-label="Turn purifier on"]') as HTMLButtonElement).disabled).eq(true);
    expect(calls.length).eq(0);
    hass.states = { ...hass.states };
    hass.states["fan.test"] = { ...hass.states["fan.test"]!, state: "on" };
    element.hass = {
      ...hass,
      callService: async () => {
        throw new Error("Device offline");
      },
    };
    await element.updateComplete;
    (root.querySelector('[aria-label="Turn purifier off"]') as HTMLButtonElement).click();
    await new Promise((r) => setTimeout(r));
    await element.updateComplete;
    expect(root.querySelector('[role="alert"]')?.textContent).contains("Device offline");
  });
  it("uses humidifier bounds and number step, and never invents bounds", async () => {
    const { root, element, hass, calls } = await card(humidity, "AC2729");
    (root.querySelector('[aria-label="Increase target humidity"]') as HTMLButtonElement).click();
    await new Promise((r) => setTimeout(r));
    expect(calls[0]).deep.eq({
      domain: "humidifier",
      service: "set_humidity",
      data: { humidity: 60, entity_id: "humidifier.test" },
    });
    hass.states = { ...hass.states };
    hass.states["humidifier.test"] = {
      ...hass.states["humidifier.test"]!,
      attributes: { ...hass.states["humidifier.test"]!.attributes, humidity: 70 },
    };
    element.hass = { ...hass };
    await element.updateComplete;
    expect((root.querySelector('[aria-label="Increase target humidity"]') as HTMLButtonElement).disabled).eq(true);
    hass.states = { ...hass.states };
    delete hass.states["number.target"];
    element.hass = { ...hass };
    await element.updateComplete;
    expect((root.querySelector('[aria-label="Decrease target humidity"]') as HTMLButtonElement).disabled).eq(true);
    expect(finite(null)).eq(undefined);
    expect(finite("bad")).eq(undefined);
  });
  it("emits more-info and editor configuration events", async () => {
    const { element, root, hass } = await card(purifier);
    const info = oneEvent(element, "hass-more-info");
    (root.querySelector('[aria-label="Open purifier details"]') as HTMLButtonElement).click();
    expect((await info).detail.entityId).eq("fan.test");
    const editor = PhilipsAirPurifierPurifierCard.getConfigElement() as PhilipsAirPurifierCardEditor;
    editor.hass = hass;
    editor.setConfig({ type: `custom:${purifier}`, device_id: "purifier" });
    await mount(editor);
    await editor.updateComplete;
    const changed = oneEvent(editor, "config-changed");
    editor.shadowRoot!.querySelector("ha-form")!.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: { type: `custom:${purifier}`, device_id: "purifier", name: "Bedroom" } },
      })
    );
    const event = await changed;
    expect(event.detail.config.name).eq("Bedroom");
    expect(event.bubbles && event.composed).eq(true);
  });
  it("ignores unrelated state updates and honors visibility configuration", async () => {
    const { element, hass, root } = await card(purifier, "AC3858/51", {
      show_pm25: false,
      show_filter: false,
      show_speed: false,
      show_presets: false,
    });
    expect(root.querySelector("input")).eq(null);
    expect(root.querySelector(".filter")).eq(null);
    element.hass = {
      ...hass,
      states: { ...hass.states, "sensor.other": { entity_id: "sensor.other", state: "1", attributes: {} } },
    };
    expect(await element.updateComplete).eq(true);
  });
  it("rejects cross-device sensor overrides", async () => {
    const { element, hass, root, add } = await card(air);
    add("sensor.other", "pm25", "999", {}, "other");
    element.hass = { ...hass };
    element.setConfig({ type: `custom:${air}`, device_id: "purifier", sensors: ["sensor.other"] });
    await element.updateComplete;
    expect(root.textContent).contains("must belong to the selected Philips device");
    expect(root.textContent).not.contains("999");
  });
  it("supports native humidity steps without an enabled number entity", async () => {
    const { element, hass, root, calls } = await card(humidity, "HU1509");
    const state = hass.states["humidifier.test"]!;
    element.hass = {
      ...hass,
      states: {
        ...hass.states,
        "humidifier.test": { ...state, attributes: { ...state.attributes, target_humidity_step: 5 } },
        "number.target": { entity_id: "number.target", state: "unavailable", attributes: {} },
      },
    };
    await element.updateComplete;
    (root.querySelector('[aria-label="Increase target humidity"]') as HTMLButtonElement).click();
    await new Promise((r) => setTimeout(r));
    expect(calls[0]?.data.humidity).eq(55);
  });
  it("shows an unavailable reading while other tiles remain usable", async () => {
    const { element, hass, root } = await card(air);
    element.hass = {
      ...hass,
      states: { ...hass.states, "sensor.tvoc": { ...hass.states["sensor.tvoc"]!, state: "unavailable" } },
    };
    await element.updateComplete;
    expect(root.textContent).contains("Unavailable");
    expect(root.textContent).contains("6");
  });
  it("restricts editor entities to the configured device", async () => {
    const { hass, add } = fixture();
    add("fan.other", "pap", "on", {}, "other");
    const editor = PhilipsAirPurifierPurifierCard.getConfigElement() as PhilipsAirPurifierCardEditor;
    editor.hass = hass;
    editor.setConfig({ type: `custom:${purifier}`, device_id: "purifier" });
    await mount(editor);
    await editor.updateComplete;
    const form = editor.shadowRoot!.querySelector("ha-form") as HTMLElement & {
      data: Record<string, unknown>;
      schema: { name: string; selector: { entity?: { include_entities: string[] } } }[];
    };
    expect(form.schema.find((s) => s.name === "entity")?.selector.entity?.include_entities).deep.eq(["fan.test"]);
    expect(form.data.show_speed).eq(true);
    expect(form.data.show_filter).eq(true);
  });
  it("keeps other readings visible when a configured sensor is deleted", async () => {
    const { root } = await card(air, "AC3858/51", { sensors: ["sensor.pm", "sensor.deleted", "sensor.tvoc"] });
    expect(root.textContent).contains("Unavailable");
    expect(root.textContent).contains("6");
    expect(root.textContent).contains("TVOC index");
    expect(root.querySelectorAll(".tile").length).eq(3);
  });
  it("discovers air-quality sensors when the editor clears the override list", async () => {
    const { root } = await card(air, "AC3858/51", { sensors: [] });
    expect(root.querySelectorAll(".tile").length).eq(3);
    expect(root.textContent).contains("TVOC index");
  });
  it("summarises air quality using the worst Philips level", async () => {
    const { element, hass, root, add } = await card(air);
    expect(root.querySelector(".pill")?.textContent).eq("Good");
    expect(root.textContent).contains("looking good");
    expect(root.textContent).contains("/12");
    add("sensor.gas", "gas_level", "3", { unit_of_measurement: "L" });
    hass.states["sensor.pm"] = { ...hass.states["sensor.pm"]!, state: "20" };
    element.hass = { ...hass, states: { ...hass.states } };
    await element.updateComplete;
    expect(root.querySelector(".pill")?.textContent).eq("Poor");
    expect(root.querySelector("ha-card")?.className).contains("band-poor");
    expect(root.textContent).contains("L3");
    expect([...root.querySelectorAll(".metric-label")].map((e) => e.textContent)).deep.eq([
      "PM2.5",
      "Gas",
      "Allergens",
      "TVOC",
    ]);
    expect(root.querySelector(".tile.band-fair")).not.eq(null);
    hass.states["sensor.pm"] = { ...hass.states["sensor.pm"]!, state: "80" };
    element.hass = { ...hass, states: { ...hass.states } };
    await element.updateComplete;
    expect(root.querySelector(".pill")?.textContent).eq("Very poor");
  });
  it("omits the summary when no reading has a known scale", async () => {
    const { root } = await card(air, "AC3858/51", { sensors: ["sensor.tvoc"] });
    expect(root.querySelector(".pill")).eq(null);
    expect(root.querySelector(".summary")).eq(null);
    expect(root.querySelector(".meter")).eq(null);
  });
  it("shows the PM2.5 level on the purifier hero", async () => {
    const { root } = await card(purifier);
    expect(root.querySelector(".hero .pill")?.textContent).eq("Good");
    const hidden = await card(purifier, "AC3858/51", { show_pm25: false });
    expect(hidden.root.querySelector(".hero .pill")).eq(null);
  });
  it("clamps the level meter to its scale", async () => {
    const { element, hass, root } = await card(air);
    hass.states["sensor.pm"] = { ...hass.states["sensor.pm"]!, state: "250" };
    element.hass = { ...hass, states: { ...hass.states } };
    await element.updateComplete;
    expect((root.querySelector(".tile.band-very_poor .meter span") as HTMLElement).style.width).eq("100%");
  });
  it("draws the 24-hour PM2.5 trend from hourly statistics", async () => {
    const f = fixture();
    const messages: Record<string, unknown>[] = [];
    const hour = 3_600_000;
    const now = Date.now();
    const rows = [
      { start: now - 3 * hour, mean: 4, min: 1, max: 9 },
      { start: new Date(now - 2 * hour).toISOString(), mean: 20, min: 2, max: 30 },
      { start: now - hour, mean: null },
      { start: now - hour, mean: 6 },
    ];
    const element = document.createElement(air) as PhilipsAirPurifierAirQualityCard;
    element.setConfig({ type: `custom:${air}`, device_id: "purifier" });
    element.hass = {
      ...f.hass,
      callWS: async <T>(message: Record<string, unknown>) => {
        messages.push(message);
        return { "sensor.pm": rows } as T;
      },
    };
    await mount(element);
    await new Promise((r) => setTimeout(r));
    await element.updateComplete;
    const root = element.shadowRoot!;
    expect(messages.length).eq(1);
    expect(messages[0]).include({ type: "recorder/statistics_during_period", period: "hour" });
    expect(root.querySelector(".trend svg")?.getAttribute("aria-label")).contains("peak 30");
    expect(root.querySelector(".trend-threshold")).not.eq(null);
    element.hass = { ...element.hass! };
    await element.updateComplete;
    expect(messages.length).eq(1);
    let events = 0;
    element.addEventListener("hass-more-info", () => events++);
    (root.querySelector(".trend-button") as HTMLButtonElement).click();
    expect(events).eq(1);
    element.setConfig({ type: `custom:${air}`, device_id: "purifier", show_trend: false });
    await element.updateComplete;
    await element.updateComplete;
    expect(root.querySelector(".trend")).eq(null);
  });
  it("keeps readings when statistics are missing or fail", async () => {
    const f = fixture();
    for (const callWS of [
      undefined,
      async () => {
        throw new Error("recorder unavailable");
      },
      async <T>() => ({}) as T,
    ]) {
      const element = document.createElement(air) as PhilipsAirPurifierAirQualityCard;
      element.setConfig({ type: `custom:${air}`, device_id: "purifier" });
      element.hass = { ...f.hass, ...(callWS ? { callWS } : {}) };
      await mount(element);
      await new Promise((r) => setTimeout(r));
      await element.updateComplete;
      expect(element.shadowRoot!.querySelector(".trend")).eq(null);
      expect(element.shadowRoot!.querySelectorAll(".tile").length).eq(3);
    }
  });
  it("shows room humidity comfort and temperature", async () => {
    const { element, hass, root } = await card(air);
    expect(root.querySelectorAll(".climate-item").length).eq(2);
    const humidity = () => root.querySelector(".climate-item")!;
    const hint = () =>
      [...humidity().querySelectorAll(".climate-text .secondary")].map((e) => e.textContent?.trim())[1];
    expect(hint()).eq("Humid");
    expect(root.querySelector(".climate")?.textContent).contains("°C");
    for (const [value, expected] of [
      ["20", "Dry"],
      ["45", "Comfortable"],
      ["unavailable", undefined],
    ]) {
      hass.states["sensor.humidity"] = { ...hass.states["sensor.humidity"]!, state: value! };
      element.hass = { ...hass, states: { ...hass.states } };
      await element.updateComplete;
      expect(hint()).eq(expected);
    }
    expect(humidity().querySelector(".climate-value")?.textContent).contains("Unavailable");
    let events = 0;
    element.addEventListener("hass-more-info", () => events++);
    (root.querySelector(".climate-item") as HTMLButtonElement).click();
    expect(events).eq(1);
    element.setConfig({ type: `custom:${air}`, device_id: "purifier", show_climate: false });
    await element.updateComplete;
    expect(root.querySelector(".climate")).eq(null);
    const { hass: bare } = fixture();
    const { "sensor.humidity": _h, "sensor.temperature": _t, ...entities } = bare.entities!;
    element.setConfig({ type: `custom:${air}`, device_id: "purifier" });
    element.hass = { ...bare, entities };
    await element.updateComplete;
    expect(root.querySelector(".climate")).eq(null);
  });
  it("lays out long option lists compactly and focuses the current choice", async () => {
    const { element, hass, root } = await card(purifier);
    const options = ["Off", ...Array.from({ length: 12 }, (_, i) => `${i + 1}h`)];
    hass.states["select.timer"] = { ...hass.states["select.timer"]!, state: "3h", attributes: { options } };
    element.hass = { ...hass, states: { ...hass.states } };
    await element.updateComplete;
    (root.querySelector('[aria-label^="Timer"]') as HTMLButtonElement).click();
    await element.updateComplete;
    expect(root.querySelector(".choices")?.classList.contains("compact")).eq(true);
    expect(root.activeElement?.textContent?.trim()).eq("3h");
    (root.querySelector(".cancel") as HTMLButtonElement).click();
    await element.updateComplete;
    (root.querySelector(".mode-button") as HTMLButtonElement).click();
    await element.updateComplete;
    expect(root.querySelector(".choices")?.classList.contains("compact")).eq(false);
  });
  it("never applies a value the sheet does not offer", async () => {
    const { element, hass, root, calls } = await card(purifier);
    const fan = hass.states["fan.test"]!;
    element.hass = {
      ...hass,
      states: { ...hass.states, "fan.test": { ...fan, attributes: { ...fan.attributes, preset_mode: null } } },
    };
    await element.updateComplete;
    (root.querySelector(".mode-button") as HTMLButtonElement).click();
    await element.updateComplete;
    const apply = root.querySelector(".apply") as HTMLButtonElement;
    expect(apply.disabled).eq(true);
    (root.querySelector(".sheet-close") as HTMLButtonElement).click();
    await element.updateComplete;
    await element.updateComplete;
    expect(root.querySelector("dialog")).eq(null);
    expect(root.activeElement).eq(root.querySelector(".mode-button"));
    element.hass = {
      ...hass,
      states: {
        ...hass.states,
        "fan.test": { ...fan, state: "off", attributes: { ...fan.attributes, preset_modes: ["sleep", "turbo"] } },
      },
    };
    await element.updateComplete;
    (root.querySelector('[aria-label^="Fan speed"]') as HTMLButtonElement).click();
    await element.updateComplete;
    expect((root.querySelector(".apply") as HTMLButtonElement).disabled).eq(true);
    expect(calls.length).eq(0);
  });
  it("re-renders for a PM2.5 sensor outside an explicit sensor list", async () => {
    const f = fixture();
    const now = Date.now();
    const element = document.createElement(air) as PhilipsAirPurifierAirQualityCard;
    element.setConfig({ type: `custom:${air}`, device_id: "purifier", sensors: ["sensor.tvoc"] });
    const callWS = async <T>() =>
      ({
        "sensor.pm": [
          { start: now - 7_200_000, mean: 4 },
          { start: now - 3_600_000, mean: 5 },
        ],
      }) as T;
    element.hass = { ...f.hass, callWS };
    await mount(element);
    await new Promise((r) => setTimeout(r));
    await element.updateComplete;
    const root = element.shadowRoot!;
    expect(root.querySelector(".trend-button")?.className).contains("band-good");
    element.hass = {
      ...f.hass,
      callWS,
      states: { ...f.hass.states, "sensor.pm": { ...f.hass.states["sensor.pm"]!, state: "80" } },
    };
    await element.updateComplete;
    expect(root.querySelector(".trend-button")?.className).contains("band-very_poor");
  });
  it("blocks applying a sheet once its device goes offline", async () => {
    const { element, hass, root, calls } = await card(purifier);
    (root.querySelector(".mode-button") as HTMLButtonElement).click();
    await element.updateComplete;
    expect((root.querySelector(".apply") as HTMLButtonElement).disabled).eq(false);
    const online = { ...hass.states["fan.test"]! };
    element.hass = { ...hass, states: { ...hass.states, "fan.test": { ...online, state: "unavailable" } } };
    await element.updateComplete;
    expect((root.querySelector(".apply") as HTMLButtonElement).disabled).eq(true);
    // A capability captured while online must not send once the entity is offline.
    const stale = { id: "fan.test", state: online, availability: "available" as const };
    await (element as unknown as { action(c: typeof stale, s: string): Promise<void> }).action(stale, "turn_on");
    expect(calls.length).eq(0);
  });
  it("refreshes the trend on a timer while connected", async () => {
    const f = fixture();
    let tick: (() => void) | undefined;
    const realSet = window.setInterval;
    const realClear = window.clearInterval;
    let cleared = 0;
    window.setInterval = ((fn: () => void) => {
      tick = fn;
      return 1;
    }) as typeof window.setInterval;
    window.clearInterval = (() => cleared++) as typeof window.clearInterval;
    try {
      let fetches = 0;
      const element = document.createElement(air) as PhilipsAirPurifierAirQualityCard;
      element.setConfig({ type: `custom:${air}`, device_id: "purifier" });
      element.hass = {
        ...f.hass,
        callWS: async <T>() => {
          fetches++;
          return {} as T;
        },
      };
      await mount(element);
      await element.updateComplete;
      expect(fetches).eq(1);
      tick!();
      await element.updateComplete;
      expect(fetches).eq(2);
      element.remove();
      expect(cleared).eq(1);
    } finally {
      window.setInterval = realSet;
      window.clearInterval = realClear;
    }
  });
  it("sets humidifier modes from a segmented switch with translated labels", async () => {
    const { element, hass, root, calls } = await card(humidity, "AC2729");
    element.hass = {
      ...hass,
      states: { ...hass.states, "humidifier.test": { ...hass.states["humidifier.test"]! } },
      formatEntityAttributeValue: (_e, attribute, v) => (attribute === "mode" && v === "sleep" ? "Night" : String(v)),
    };
    await element.updateComplete;
    const radios = [...root.querySelectorAll<HTMLInputElement>('.segmented input[type="radio"]')];
    expect(radios.map((r) => r.parentElement?.textContent?.trim())).deep.eq(["Auto", "Night"]);
    expect(radios[0]!.checked).eq(true);
    expect(root.querySelector("legend")?.textContent).eq("Mode");
    radios[1]!.click();
    await new Promise((r) => setTimeout(r));
    expect(calls[0]).deep.eq({
      domain: "humidifier",
      service: "set_mode",
      data: { mode: "sleep", entity_id: "humidifier.test" },
    });
    // The switch follows the entity, not the optimistic click, until Home Assistant confirms.
    element.hass = { ...hass, states: { ...hass.states } };
    await element.updateComplete;
    expect(radios[0]!.checked).eq(true);
    expect(root.querySelector("ha-card")?.className).contains("is-on");
    element.hass = {
      ...hass,
      states: { ...hass.states, "humidifier.test": { ...hass.states["humidifier.test"]!, state: "unavailable" } },
    };
    await element.updateComplete;
    expect((root.querySelector(".segmented") as HTMLFieldSetElement).disabled).eq(true);
    expect(root.querySelector("ha-card")?.className).contains("is-unavailable");
    expect(root.querySelector(".hero .state")?.textContent?.trim()).eq("Check the device connection");
  });
  it("shows notices and errors as Home Assistant style alerts", async () => {
    const { root } = await card(purifier, "HU1509");
    expect(root.querySelector('.alert.info[role="status"]')?.textContent).contains("does not expose a purifier fan");
    const missing = await card(purifier, "AC3858/51", { device_id: "missing" });
    expect(missing.root.querySelector(".alert.warning")).not.eq(null);
    const { element, hass, root: failing } = await card(purifier);
    element.hass = {
      ...hass,
      callService: async () => {
        throw new Error("Device offline");
      },
    };
    await element.updateComplete;
    (failing.querySelector('[aria-label="Turn purifier off"]') as HTMLButtonElement).click();
    await new Promise((r) => setTimeout(r));
    await element.updateComplete;
    expect(failing.querySelector('.alert.error[role="alert"]')?.textContent).contains("Device offline");
  });
  it("moves the sheet selection with the arrow keys and localizes dialog actions", async () => {
    const { element, hass, root } = await card(purifier);
    element.hass = {
      ...hass,
      localize: (key: string) => ({ "ui.common.cancel": "Abbrechen", "ui.common.close": "Schließen" })[key] ?? "",
    };
    await element.updateComplete;
    const opener = root.querySelector(".mode-button") as HTMLButtonElement;
    expect(opener.getAttribute("aria-haspopup")).eq("dialog");
    expect(opener.hasAttribute("aria-pressed")).eq(false);
    opener.click();
    await element.updateComplete;
    expect(root.querySelector(".cancel")?.textContent?.trim()).eq("Abbrechen");
    expect(root.querySelector(".sheet-close")?.getAttribute("aria-label")).eq("Schließen");
    const group = root.querySelector('[role="radiogroup"]')!;
    const checked = () => root.querySelector('[aria-checked="true"]')?.textContent?.trim();
    expect([...root.querySelectorAll(".choice")].map((c) => c.getAttribute("tabindex"))).deep.eq(["0", "-1", "-1"]);
    group.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    await element.updateComplete;
    await element.updateComplete;
    expect(checked()).eq("Sleep");
    expect(root.activeElement?.textContent?.trim()).eq("Sleep");
    group.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));
    group.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await element.updateComplete;
    group.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));
    await element.updateComplete;
    expect(checked()).eq("Turbo");
  });
  it("sizes each card for masonry and sections views", () => {
    const quality = new PhilipsAirPurifierAirQualityCard();
    quality.setConfig({ type: `custom:${air}` });
    expect(quality.getCardSize()).eq(9);
    quality.setConfig({ type: `custom:${air}`, show_trend: false, show_climate: false });
    expect(quality.getCardSize()).eq(4);
    expect(new PhilipsAirPurifierHumidityCard().getCardSize()).eq(7);
    expect(new PhilipsAirPurifierPurifierCard().getGridOptions()).deep.eq({
      columns: 12,
      min_columns: 6,
      rows: "auto",
    });
  });
});
