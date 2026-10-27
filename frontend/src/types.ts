export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
}
export interface RegistryEntity {
  entity_id: string;
  device_id: string | null;
  platform: string;
  translation_key?: string | null;
  entity_category?: string | null;
  disabled_by?: string | null;
}
export interface Device {
  id: string;
  name?: string | null;
  name_by_user?: string | null;
  model?: string | null;
}
export interface HomeAssistant {
  states: Record<string, HassEntity>;
  entities?: Record<string, RegistryEntity>;
  devices?: Record<string, Device>;
  locale?: { language: string; [key: string]: unknown };
  themes?: unknown;
  formatEntityState(entity: HassEntity, state?: string): string;
  formatEntityAttributeValue?(entity: HassEntity, attribute: string, value?: unknown): string;
  formatEntityName?(entity: HassEntity): string;
  localize?(key: string): string;
  callWS?<T>(message: Record<string, unknown>): Promise<T>;
  callService(domain: string, service: string, data: Record<string, unknown>): Promise<unknown>;
}
export interface CardConfig {
  type: string;
  device_id?: string;
  entity?: string;
  name?: string;
  sensors?: string[];
  show_presets?: boolean;
  show_speed?: boolean;
  show_filter?: boolean;
  show_pm25?: boolean;
  show_target_control?: boolean;
  show_mode?: boolean;
  show_water_level?: boolean;
  show_trend?: boolean;
  show_climate?: boolean;
}
export type Role =
  | "fan"
  | "humidifier"
  | "pm25"
  | "air"
  | "filter"
  | "humidity"
  | "temperature"
  | "water"
  | "target"
  | "lock"
  | "light"
  | "auto_plus"
  | "lamp"
  | "timer";
export interface Capability {
  id: string;
  key?: string | null;
  state?: HassEntity;
  availability: "available" | "unavailable" | "unknown";
}
export interface CustomCard {
  type: string;
  name: string;
  description: string;
  preview: boolean;
  documentationURL: string;
  getEntitySuggestion(hass: HomeAssistant, entityId: string): { config: CardConfig } | null;
}
declare global {
  interface Window {
    customCards?: CustomCard[];
  }
}
