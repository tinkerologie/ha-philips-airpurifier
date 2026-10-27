import { LitElement, html, nothing, type PropertyValues } from "lit";
import { activeDevice, deviceIds, resolve } from "./discovery";
import { styles } from "./styles";
import type { Capability, CardConfig, HomeAssistant, Role } from "./types";
export abstract class PhilipsAirPurifierBaseCard extends LitElement {
  static override styles = styles;
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
  getCardSize(): number {
    return this.controlRole === "air" ? 3 : 6;
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
      ? (["fan", "humidifier", "air", "filter", "humidity", "water", "target", "lock", "light"] as Role[]).flatMap(
          (role) => resolve(this.hass!, this.config, role)
        )
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
  protected value(c: Capability): string {
    if (c.availability !== "available" || !c.state)
      return (
        this.hass?.localize?.(`state.default.${c.availability}`) ||
        (c.availability === "unknown" ? "Unknown" : "Unavailable")
      );
    return this.hass?.formatEntityState(c.state) ?? c.state.state;
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
    if (!this.hass || this.busy || c.availability !== "available") return;
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
    return html`<div>
      <div class="eyebrow">${fallback}</div>
      <h2>${this.config.name ?? device?.name_by_user ?? device?.name ?? "Philips AirPurifier"}</h2>
    </div>`;
  }
  protected guard() {
    if (!this.hass) return html`<div class="notice">Connecting to Home Assistant…</div>`;
    const device = activeDevice(this.hass, this.config);
    if (!device || !deviceIds(this.hass).includes(device))
      return html`<div class="notice">
        Select a Philips device in the card editor. The configured device could not be found.
      </div>`;
    if (
      this.config.entity &&
      (this.hass.entities?.[this.config.entity]?.device_id !== device ||
        this.hass.entities?.[this.config.entity]?.platform !== "philips_airpurifier")
    )
      return html`<div class="notice">The control entity must belong to the selected Philips device.</div>`;
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
      return html`<div class="notice">Air-quality sensors must belong to the selected Philips device.</div>`;
    return nothing;
  }
  protected feedback() {
    return html`<div aria-live="polite" role="status">
        ${this.busy ? html`<span class="secondary">Sending…</span>` : nothing}
      </div>
      ${this.error ? html`<div class="error" role="alert">${this.error}</div>` : nothing}`;
  }
}
