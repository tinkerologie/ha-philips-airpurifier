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
    (root.querySelector('[aria-label="Set mode sleep"]') as HTMLButtonElement).click();
    await new Promise((r) => setTimeout(r));
    expect(calls[1]?.data).deep.eq({ entity_id: "fan.test", preset_mode: "sleep" });
    const speed = root.querySelector("input")!;
    speed.value = "75";
    speed.dispatchEvent(new Event("change"));
    await new Promise((r) => setTimeout(r));
    expect(calls[2]?.data).deep.eq({ entity_id: "fan.test", percentage: 75 });
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
});
