import { html, nothing, type TemplateResult } from "lit";
import { PhilipsAirPurifierBaseCard } from "../base-card";
import { finite, strings, stubConfig } from "../discovery";
import {
  closeIcon,
  displayIcon,
  fanIcon,
  infoIcon,
  lampIcon,
  lockIcon,
  modeIcon,
  powerIcon,
  purifierIcon,
  ring,
  timerIcon,
} from "../icons";
import { band, bandLabel } from "../quality";
import type { Capability, HomeAssistant, Role } from "../types";
interface Choice {
  value: string;
  label: string;
  icon?: TemplateResult;
}
interface Sheet {
  title: string;
  choices: Choice[];
  selected: string;
  apply(value: string): Promise<void>;
}
const AUTO_SPEED = "auto";
export class PhilipsAirPurifierPurifierCard extends PhilipsAirPurifierBaseCard {
  static override cardType = "philips-airpurifier-purifier-card";
  static override editorTag = "philips-airpurifier-card-editor";
  static override properties = { ...PhilipsAirPurifierBaseCard.properties, sheet: { state: true } };
  declare private sheet: Sheet | undefined;
  protected readonly controlRole: Role = "fan";
  static getStubConfig(hass: HomeAssistant) {
    return stubConfig(hass, this.cardType, "fan");
  }
  protected override updated(): void {
    const dialog = this.renderRoot.querySelector("dialog");
    if (dialog && !dialog.open) dialog.showModal();
  }
  protected override render() {
    const guard = this.guard();
    const fan = this.caps("fan")[0];
    if (guard !== nothing || !fan)
      return html`<ha-card
        ><div class="body">
          ${this.heading("Purifier")}${guard !== nothing ? guard : html`<div class="notice">This device does not expose a purifier fan.</div>`}
        </div></ha-card
      >`;
    const state = fan.state;
    const on = state?.state === "on";
    const pm25 = this.caps("pm25")[0];
    const level = this.config.show_pm25 !== false && pm25 ? band(pm25) : undefined;
    return html`<ha-card
      ><div class="body">
        <header>${this.heading("Purifier")}</header>
        <div class="hero ${level ? `band-${level}` : ""}">
          ${purifierIcon()}
          <div>
            ${
              this.config.show_pm25 !== false && pm25
                ? html`<div class="secondary">PM2.5</div>
                    <div class="value">${this.reading(pm25)}</div>
                    ${level ? html`<span class="pill">${bandLabel[level]}</span>` : nothing}`
                : html`<div class="value">
                    ${fan.availability === "available" ? (on ? "On" : "Off") : this.value(fan)}
                  </div>`
            }
            <div class="state">
              ${fan.availability !== "available" ? this.value(fan) : on ? this.modeLabel(fan) : "Standby"}
            </div>
          </div>
        </div>
        ${this.controls(fan)} ${this.health()} ${this.feedback()}
      </div>
      ${this.renderSheet()}</ha-card
    >`;
  }
  private controls(fan: Capability) {
    const on = fan.state?.state === "on";
    const disabled = fan.availability !== "available" || this.busy;
    const lock = this.caps("lock")[0];
    const lockOn = lock?.state?.state === "on";
    const presets = strings(fan.state?.attributes.preset_modes);
    const mode = String(fan.state?.attributes.preset_mode ?? "");
    const tiles = [
      this.displayTile(),
      this.speedTile(fan),
      this.selectTile("lamp", "Light", lampIcon()),
      this.selectTile("timer", "Timer", timerIcon()),
    ].filter((t) => t !== nothing);
    return html`<section class="controls" aria-label="Controls">
      <div class="controls-head">
        <span class="section-title">Controls</span>
        <button class="icon-button plain" aria-label="Open purifier details" @click=${() => this.moreInfo(fan.id)}>
          ${infoIcon()}
        </button>
      </div>
      <div class="round-row">
        <div class="round">
          <button
            class="icon-button"
            aria-label=${on ? "Turn purifier off" : "Turn purifier on"}
            aria-pressed=${on}
            ?disabled=${disabled}
            @click=${() => this.action(fan, on ? "turn_off" : "turn_on")}
          >
            ${powerIcon()}
          </button>
          <span>Power</span>
        </div>
        ${
          lock
            ? html`<div class="round">
                <button
                  class="icon-button"
                  aria-label="Toggle child lock"
                  aria-pressed=${lockOn}
                  ?disabled=${this.busy || lock.availability !== "available"}
                  @click=${() => this.action(lock, lockOn ? "turn_off" : "turn_on")}
                >
                  ${lockIcon(lockOn)}
                </button>
                <span>Child lock</span>
              </div>`
            : nothing
        }
      </div>
      ${
        this.config.show_presets !== false && presets.length
          ? html`<button
              class="mode-button"
              aria-haspopup="dialog"
              aria-pressed=${on && presets.includes(mode)}
              aria-label=${`Mode: ${on ? this.modeLabel(fan) : "Off"}. Choose a mode`}
              ?disabled=${disabled}
              @click=${(event: Event) =>
                this.open(event, {
                  title: "Choose a mode",
                  selected: mode,
                  choices: presets.map((p) => ({ value: p, label: this.presetLabel(fan, p), icon: modeIcon(p) })),
                  apply: (p) => this.action(fan, "set_preset_mode", { preset_mode: p }),
                })}
            >
              ${modeIcon(mode)}<span>${on ? this.modeLabel(fan) : "Choose a mode"}</span>
            </button>`
          : nothing
      }
      ${tiles.length ? html`<div class="control-grid">${tiles}</div>` : nothing}
    </section>`;
  }
  private tile(
    c: Capability,
    name: string,
    icon: TemplateResult,
    value: string,
    onClick: (event: Event) => void,
    pressed: boolean
  ) {
    return html`<button
      class="control-tile"
      aria-label=${`${name}: ${value}`}
      aria-pressed=${pressed}
      ?disabled=${this.busy || c.availability !== "available"}
      @click=${onClick}
    >
      ${icon}<span>${value}</span>
    </button>`;
  }
  private displayTile() {
    const light = this.caps("light")[0];
    if (!light) return nothing;
    const lit = light.state?.state === "on";
    return this.tile(
      light,
      "Display light",
      displayIcon(),
      light.availability === "available" ? (lit ? "On" : "Off") : this.value(light),
      () => this.action(light, lit ? "turn_off" : "turn_on"),
      lit
    );
  }
  private speedTile(fan: Capability) {
    const a = fan.state?.attributes ?? {};
    const step = finite(a.percentage_step);
    const features = finite(a.supported_features) ?? 0;
    if (this.config.show_speed === false || !(features & 1) || !step || step <= 0) return nothing;
    const percentage = finite(a.percentage);
    const on = fan.state?.state === "on";
    const speeds = Math.round(100 / step);
    const current =
      on && percentage !== undefined && percentage > 0 ? String(Math.round(percentage / step)) : AUTO_SPEED;
    const presets = strings(a.preset_modes);
    const auto = presets.find((p) => p.startsWith("auto"));
    const label = (v: string) => (v === AUTO_SPEED ? "Auto" : `Speed ${v}`);
    const choices: Choice[] = [
      ...(auto ? [{ value: AUTO_SPEED, label: "Auto", icon: modeIcon("auto") }] : []),
      ...Array.from({ length: speeds }, (_, i) => ({
        value: String(i + 1),
        label: label(String(i + 1)),
        icon: fanIcon(),
      })),
    ];
    return this.tile(
      fan,
      "Fan speed",
      fanIcon(),
      fan.availability !== "available" ? this.value(fan) : on ? label(current) : "Off",
      (event: Event) =>
        this.open(event, {
          title: "Fan speed",
          selected: current,
          choices,
          apply: (v) =>
            v === AUTO_SPEED
              ? this.action(fan, "set_preset_mode", { preset_mode: auto })
              : this.action(fan, "set_percentage", { percentage: Math.min(100, Number(v) * step) }),
        }),
      false
    );
  }
  private selectTile(role: Role, name: string, icon: TemplateResult) {
    const select = this.caps(role)[0];
    const options = strings(select?.state?.attributes.options);
    if (!select?.state || !options.length) return nothing;
    const current = select.state.state;
    return this.tile(
      select,
      name,
      icon,
      this.value(select),
      (event: Event) =>
        this.open(event, {
          title: name === "Timer" ? "Set a timer" : `Choose ${name.toLowerCase()} mode`,
          selected: current,
          choices: options.map((o) => ({ value: o, label: this.optionLabel(select, o) })),
          apply: (o) => this.action(select, "select_option", { option: o }),
        }),
      options.indexOf(current) > 0
    );
  }
  private health() {
    const filters = this.caps("filter");
    if (this.config.show_filter === false || !filters.length) return nothing;
    return html`<div class="section">
      <div class="section-title">Device health</div>
      ${filters.map((f) => {
        const percent = f.state?.attributes.unit_of_measurement === "%" ? finite(f.state.state) : undefined;
        return html`<button
          class="filter"
          aria-label=${`Details for ${this.label(f)}`}
          @click=${() => this.moreInfo(f.id)}
        >
          ${percent !== undefined ? ring(percent) : nothing}<span class="filter-text"
            ><span class="filter-name">${this.label(f)}</span><span class="filter-value">${this.value(f)}</span
            ><span class="secondary">
              ·
              ${f.availability === "available" ? String(f.state?.attributes["Replacement Status"] ?? "Filter life remaining") : "Check device connection"}</span
            ></span
          >
        </button>`;
      })}
    </div>`;
  }
  private opener?: HTMLElement;
  private open(event: Event, sheet: Sheet) {
    this.opener = event.currentTarget as HTMLElement;
    this.sheet = sheet;
  }
  private close() {
    this.renderRoot.querySelector("dialog")?.close();
    this.sheet = undefined;
    // Return focus to the control that opened the sheet, as HA dialogs do.
    void this.updateComplete.then(() => this.opener?.focus());
  }
  private renderSheet() {
    const sheet = this.sheet;
    if (!sheet) return nothing;
    return html`<dialog
      aria-labelledby="sheet-title"
      @close=${() => (this.sheet = undefined)}
      @cancel=${() => this.close()}
    >
      <button class="icon-button sheet-close" aria-label="Close" @click=${() => this.close()}>${closeIcon()}</button>
      <h3 id="sheet-title">${sheet.title}</h3>
      <div
        class="choices ${sheet.choices.length > 6 && sheet.choices.every((c) => !c.icon) ? "compact" : ""}"
        role="radiogroup"
        aria-labelledby="sheet-title"
      >
        ${sheet.choices.map(
          (c) =>
            html`<button
              class="choice"
              role="radio"
              aria-checked=${c.value === sheet.selected}
              ?autofocus=${c.value === sheet.selected}
              @click=${() => (this.sheet = { ...sheet, selected: c.value })}
            >
              ${c.icon ?? nothing}<span>${c.label}</span>
            </button>`
        )}
      </div>
      <div class="sheet-actions">
        <button
          class="apply"
          ?disabled=${!sheet.choices.some((c) => c.value === sheet.selected)}
          @click=${async () => {
            this.close();
            await sheet.apply(sheet.selected);
          }}
        >
          Apply
        </button>
        <button class="cancel" @click=${() => this.close()}>Cancel</button>
      </div>
    </dialog>`;
  }
  private presetLabel(fan: Capability, preset: string): string {
    if (preset === "auto" && this.caps("auto_plus")[0]?.state?.state === "on") return "Auto+";
    const translated = fan.state && this.hass?.formatEntityAttributeValue?.(fan.state, "preset_mode", preset);
    return translated && translated !== preset ? translated : prettify(preset);
  }
  private modeLabel(fan: Capability): string {
    const mode = fan.state?.attributes.preset_mode;
    return typeof mode === "string" && mode ? this.presetLabel(fan, mode) : "Manual";
  }
  private optionLabel(select: Capability, option: string): string {
    const translated = select.state && this.hass?.formatEntityState(select.state, option);
    return translated && translated !== option ? translated : prettify(option);
  }
}
function prettify(value: string): string {
  const text = value.replaceAll("_", " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}
