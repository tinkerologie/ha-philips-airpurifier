import { LitElement, html, nothing, svg, type CSSResultGroup, type PropertyValues, type TemplateResult } from "lit";
import { activeDevice, capability, deviceIds, resolve } from "./discovery";
import { styles } from "./styles";
import type { Capability, CardConfig, HomeAssistant, Role } from "./types";
export type AlertTone = "info" | "warning" | "error";
// Material Design Icons paths, as used by ha-alert.
const alertIcons: Record<AlertTone, string> = {
  info: "M11 9h2V7h-2m1 13c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m0-18A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2m-1 15h2v-6h-2z",
  warning: "M12 2 1 21h22M12 6l7.53 13H4.47M11 10v4h2v-4m-2 6v2h2v-2",
  error:
    "M11 15h2v2h-2zm0-8h2v6h-2zm1-5C6.47 2 2 6.5 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 18a8 8 0 0 1-8-8 8 8 0 0 1 8-8 8 8 0 0 1 8 8 8 8 0 0 1-8 8",
};
/** A tinted, icon-led message in the style of Home Assistant's ha-alert. */
export function alert(message: unknown, tone: AlertTone = "info", role: "status" | "alert" = "status") {
  return html`<div class="alert ${tone}" role=${role}>
    <svg viewBox="0 0 24 24" aria-hidden="true">${svg`<path d=${alertIcons[tone]} />`}</svg><span>${message}</span>
  </div>`;
}
export abstract class PhilipsAirPurifierBaseCard extends LitElement {
  static override styles: CSSResultGroup = styles;
  static cardType = "";
  static editorTag = "";
  static override properties = {
    hass: { attribute: false },
    config: { attribute: false },
    busy: { state: true },
    error: { state: true },
  };
  declare hass?: HomeAssistant;
  declare config: CardConfig;
  declare protected busy: boolean;
  declare protected error: string;
  protected abstract readonly controlRole: Role;
  constructor() {
    super();
    this.config = { type: "" };
    this.busy = false;
    this.error = "";
  }
  static getConfigElement(this: { editorTag: string }): HTMLElement {
    return document.createElement(this.editorTag);
  }
  setConfig(config: CardConfig): void {
    const ctor = this.constructor as typeof PhilipsAirPurifierBaseCard;
    if (!config || config.type !== `custom:${ctor.cardType}`) throw new Error(`Expected custom:${ctor.cardType}`);
    for (const [key, value] of Object.entries(config)) {
      if (key.startsWith("show_") && typeof value !== "boolean") throw new Error(`${key} must be a boolean`);
      if (["entity", "device_id", "name"].includes(key) && (typeof value !== "string" || !value.trim()))
        throw new Error(`${key} must be non-empty text`);
    }
    if (config.entity && !config.entity.startsWith(`${this.controlRole}.`))
      throw new Error(`entity must be a ${this.controlRole} entity`);
    if (
      config.sensors &&
      (!Array.isArray(config.sensors) ||
        config.sensors.some((id) => typeof id !== "string" || !id.startsWith("sensor.")))
    )
      throw new Error("sensors must be a list of sensor entity IDs");
    this.config = { ...config, ...(config.sensors ? { sensors: [...config.sensors] } : {}) };
    this.error = "";
  }
  // Masonry rows are 50px; these match the default layout of each card.
  getCardSize(): number {
    if (this.controlRole !== "air") return this.controlRole === "fan" ? 9 : 7;
    return 4 + (this.config.show_trend !== false ? 3 : 0) + (this.config.show_climate !== false ? 2 : 0);
  }
  getGridOptions() {
    return { columns: 12, min_columns: 6, rows: "auto" };
  }
  protected override shouldUpdate(changed: PropertyValues<this>): boolean {
    if (changed.size !== 1 || !changed.has("hass")) return true;
    const previous = changed.get("hass");
    const current = this.hass;
    if (
      !previous ||
      !current ||
      previous.entities !== current.entities ||
      previous.devices !== current.devices ||
      previous.locale !== current.locale ||
      previous.themes !== current.themes
    )
      return true;
    return this.related().some((c) => previous.states[c.id] !== current.states[c.id]);
  }
  protected related(): Capability[] {
    return this.hass
      ? (
          [
            "fan",
            "humidifier",
            "air",
            "pm25",
            "filter",
            "humidity",
            "temperature",
            "water",
            "target",
            "lock",
            "light",
            "auto_plus",
            "lamp",
            "timer",
          ] as Role[]
        ).flatMap((role) => resolve(this.hass!, this.config, role))
      : [];
  }
  protected caps(role: Role): Capability[] {
    return this.hass ? resolve(this.hass, this.config, role) : [];
  }
  protected label(c: Capability): string {
    if (c.state)
      return (
        this.hass?.formatEntityName?.(c.state) ??
        String(c.state.attributes.friendly_name ?? c.key?.replaceAll("_", " ") ?? c.id)
      );
    return c.key?.replaceAll("_", " ") ?? c.id;
  }
  /** A Home Assistant frontend translation, or the English fallback on older or partial hass objects. */
  protected t(key: string, fallback: string): string {
    return this.hass?.localize?.(key) || fallback;
  }
  protected value(c: Capability): string {
    if (c.availability !== "available" || !c.state)
      return this.t(`state.default.${c.availability}`, c.availability === "unknown" ? "Unknown" : "Unavailable");
    return this.hass?.formatEntityState(c.state) ?? c.state.state;
  }
  /** Translated attribute value (for example a humidifier mode), falling back to a readable raw value. */
  protected attributeLabel(c: Capability, attribute: string, value: string): string {
    const translated = c.state && this.hass?.formatEntityAttributeValue?.(c.state, attribute, value);
    return translated && translated !== value ? translated : prettify(value);
  }
  /** The tile-card state class for a control entity: drives the accent colour. */
  protected stateClass(c: Capability | undefined): string {
    if (!c || c.availability !== "available") return "is-unavailable";
    return c.state?.state === "on" ? "is-on" : "is-off";
  }
  protected reading(c: Capability) {
    const formatted = this.value(c);
    const unit = c.state?.attributes.unit_of_measurement;
    if (c.availability === "available" && typeof unit === "string" && unit && formatted.endsWith(unit)) {
      return html`${formatted.slice(0, -unit.length).trim()}<span class="unit"> ${unit}</span>`;
    }
    return formatted;
  }
  protected moreInfo(id: string): void {
    this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: id }, bubbles: true, composed: true }));
  }
  protected async action(c: Capability, service: string, data: Record<string, unknown> = {}): Promise<void> {
    // Re-read availability: a dialog may hold a capability captured earlier.
    if (!this.hass || this.busy || capability(this.hass, c.id).availability !== "available") return;
    this.busy = true;
    this.error = "";
    try {
      await this.hass.callService(c.id.split(".")[0]!, service, { ...data, entity_id: c.id });
    } catch (error) {
      this.error =
        error instanceof Error ? error.message : "The device could not complete the action. Please try again.";
    } finally {
      this.busy = false;
    }
  }
  protected heading(fallback: string) {
    const id = this.hass && activeDevice(this.hass, this.config);
    const device = id ? this.hass?.devices?.[id] : undefined;
    return html`<div class="heading">
      <h2>${this.config.name ?? device?.name_by_user ?? device?.name ?? "Philips AirPurifier"}</h2>
      <div class="eyebrow">${fallback}</div>
    </div>`;
  }
  protected guard(): TemplateResult | typeof nothing {
    if (!this.hass) return alert("Connecting to Home Assistant…");
    const device = activeDevice(this.hass, this.config);
    if (!device || !deviceIds(this.hass).includes(device))
      return alert("Select a Philips device in the card editor. The configured device could not be found.", "warning");
    if (
      this.config.entity &&
      (this.hass.entities?.[this.config.entity]?.device_id !== device ||
        this.hass.entities?.[this.config.entity]?.platform !== "philips_airpurifier")
    )
      return alert("The control entity must belong to the selected Philips device.", "warning");
    if (
      this.config.sensors?.some((id) => {
        const registry = this.hass!.entities?.[id];
        // A deleted sensor has no registry entry or state: show its unavailable
        // tile without hiding the remaining readings. A live unregistered
        // sensor cannot be verified as belonging to this device.
        if (!registry) return Boolean(this.hass!.states[id]);
        return registry.device_id !== device || registry.platform !== "philips_airpurifier";
      })
    )
      return alert("Air-quality sensors must belong to the selected Philips device.", "warning");
    return nothing;
  }
  protected feedback() {
    return html`<div aria-live="polite" role="status">
        ${this.busy ? html`<span class="secondary">Sending…</span>` : nothing}
      </div>
      ${this.error ? alert(this.error, "error", "alert") : nothing}`;
  }
}
export function prettify(value: string): string {
  const text = value.replaceAll("_", " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}
