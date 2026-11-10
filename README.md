# Philips AirPurifier for Home Assistant

Control compatible Philips air purifiers, humidifiers, fans, and heaters from Home Assistant. The integration uses local CoAP to receive device updates and send commands. After the device joins your network, day-to-day control runs locally.

<!-- BADGES:START -->

[![Latest release](https://img.shields.io/github/v/release/tinkerologie/ha-philips-airpurifier)](https://github.com/tinkerologie/ha-philips-airpurifier/releases/latest)
[![Continuous integration](https://github.com/tinkerologie/ha-philips-airpurifier/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/tinkerologie/ha-philips-airpurifier/actions/workflows/ci.yml?query=branch%3Amain)
[![Test coverage](https://codecov.io/gh/tinkerologie/ha-philips-airpurifier/graph/badge.svg)](https://codecov.io/gh/tinkerologie/ha-philips-airpurifier)
[![Apache 2.0 license](https://img.shields.io/github/license/tinkerologie/ha-philips-airpurifier)](./LICENSE)

<!-- BADGES:END -->

[Install](#installation) · [Set up a device](#configuration) · [Check model support](#supported-devices) · [Add dashboard cards](#dashboard-cards) · [Get help](#troubleshooting)

## Installation

You need **Home Assistant 2026.9.0 or later** and a [supported Philips device](#supported-devices) that Home Assistant can reach over your local network. Some firmware versions disable local CoAP or stop responding to it intermittently. If local control is a purchase requirement, verify the firmware or buy from a seller with a return policy.

### Install with HACS

[![Open Philips AirPurifier in HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=tinkerologie&repository=ha-philips-airpurifier&category=integration)

1. Open **Philips AirPurifier** in HACS.
2. Select **Download**.
3. Restart Home Assistant.
4. [Add your device](#configuration).

### Install manually

1. Download `philips_airpurifier.zip` from the [latest release](https://github.com/tinkerologie/ha-philips-airpurifier/releases/latest).
2. Extract the archive into `custom_components/philips_airpurifier/` in your Home Assistant configuration directory.
3. Make sure that `manifest.json` is directly inside the `philips_airpurifier` directory.
4. Restart Home Assistant.
5. [Add your device](#configuration).

<details>
<summary>Verify the release archive</summary>

Download `SHA256SUMS` from the same release. Run these commands from the directory that contains both files.

```bash
gh attestation verify philips_airpurifier.zip -R tinkerologie/ha-philips-airpurifier
sha256sum -c SHA256SUMS
```

On macOS, use `shasum -a 256 -c SHA256SUMS`. The GitHub CLI command verifies the build provenance. The checksum command verifies the downloaded bytes.

</details>

## Configuration

If Home Assistant discovers your device, open **Settings → Devices & services** and select **Configure** on the discovery card. Follow the instructions on the screen.

### Add a device manually

_These steps use the procedural rules of ASD-STE100 Simplified Technical English._

1. Open **Settings → Devices & services**.
2. Select **Add integration**.
3. Search for **Philips AirPurifier**.
4. Select **Philips AirPurifier**.
5. Enter the IP address or hostname of the Philips device.
6. Select **Submit**.

Home Assistant identifies the model during setup. If the IP address changes and discovery cannot update it, open the integration entry menu and select **Reconfigure**.

ASD-STE100 was developed for aerospace maintenance documentation. This procedure applies its guidance on short sentences, imperative verbs, and one instruction per sentence. [ASD-STE100, section 5](https://www.asd-ste100.org/assets/files/ASD-STE100_ISSUE9.pdf)

## Supported devices

Match the model code on your device label. Available entities depend on the model and firmware.

| Device family           | Supported models                                                                                                                                                                                                                                                                                               |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Air purifiers           | AC0650, AC0850, AC0950, AC0951, AC1214, AC1715, AC2210, AC2220, AC2221, AC2729, AC2889, AC2936, AC2939, AC2958, AC2959, AC3033, AC3036, AC3039, AC3055, AC3059, AC3210, AC3220, AC3221, AC3259, AC3420, AC3421, AC3737, AC3829, AC3836, AC3854, AC3858, AC4220, AC4221, AC4236, AC4550, AC4558, AC5659, AC5660 |
| AMF combination devices | AMF765, AMF870                                                                                                                                                                                                                                                                                                 |
| Humidifiers             | HU1509, HU1510, HU4209/00, HU5710                                                                                                                                                                                                                                                                              |
| Fans and heaters        | CX3120, CX3550, CX5120, CX7550                                                                                                                                                                                                                                                                                 |

<details>
<summary>Model variants and firmware behavior</summary>

- **AC0850.** Variants /11, /20, /31, /41, /70, /81, and /85 are listed. For /11, /20, /31, /41, and /70, the integration distinguishes `AWS_Philips_AIR` from `AWS_Philips_AIR_Combo`.
- **AC3854 and AC3858.** AC3854 variants are /25, /50, and /51. AC3858 variants are /50, /51, /83, and /86.
- **AMF765 and AMF870.** The Oscillation number entity sets the angle. Set it to `0°` to stop or to `30°` through `350°` in `5°` steps. The fan oscillation toggle restores the last reported angle or uses `90°` if none is known.
- **CX5120 and CX7550.** Push-only firmware can require a brief display backlight change during setup or reconnect to make the device send status. The CX5120 change is unreleased and was verified on CX5120/11 firmware 0.4.9.
- **CX7550.** Use the Philips Air+ app to join Wi-Fi. In standby, firmware keeps the display backlight dim and ignores commands to turn it off. The **Standby temperature display** switch controls the temperature readout separately.

</details>

## Available entities

| Function | What Home Assistant can expose                                                                             |
| -------- | ---------------------------------------------------------------------------------------------------------- |
| Control  | Fan power, speed, presets, and oscillation. Humidifier target and modes. Climate target and heating modes. |
| Monitor  | PM2.5, indoor allergen index, gas, humidity, and temperature.                                              |
| Maintain | Filter life and replacement alerts, water refill alerts, and device repairs.                               |
| Adjust   | Display backlight, child lock, timer, and other model-specific settings.                                   |

For example, use the PM2.5 sensor in an automation that changes the purifier preset. Use the filter life sensor to plan a replacement.

## Dashboard cards

The integration loads three cards automatically. In the dashboard editor, select **Add card**, then choose **Philips Purifier**, **Philips Air Quality**, or **Philips Humidity**. Select your device in the card editor. Reload the browser if the cards do not appear after an update.

| Card                | Use it to                                                                                          |
| ------------------- | -------------------------------------------------------------------------------------------------- |
| Philips Purifier    | Control power, preset, speed, and supported device features. View filter life and PM2.5.           |
| Philips Air Quality | Compare available readings and show a 24-hour PM2.5 trend from Home Assistant recorder statistics. |
| Philips Humidity    | View humidity and water level. Set target humidity or mode when the device exposes those controls. |

<details>
<summary>YAML examples and card options</summary>

Use the Home Assistant device ID for `device_id`.

```yaml
type: custom:philips-airpurifier-purifier-card
device_id: YOUR_HOME_ASSISTANT_DEVICE_ID
```

```yaml
type: custom:philips-airpurifier-air-quality-card
device_id: YOUR_HOME_ASSISTANT_DEVICE_ID
```

```yaml
type: custom:philips-airpurifier-humidity-card
device_id: YOUR_HOME_ASSISTANT_DEVICE_ID
```

| Card        | Optional settings                                                  |
| ----------- | ------------------------------------------------------------------ |
| All cards   | `name`                                                             |
| Purifier    | `entity`, `show_presets`, `show_speed`, `show_filter`, `show_pm25` |
| Air Quality | Ordered `sensors` list, `show_trend`, `show_climate`               |
| Humidity    | `entity`, `show_target_control`, `show_mode`, `show_water_level`   |

An `entity` override must belong to the selected device. Omit the `sensors` list to show the supported readings in Philips app order. Gas and TVOC are device indices. The air quality card accepts the theme variables `--pap-good-color`, `--pap-fair-color`, `--pap-poor-color`, and `--pap-very-poor-color`.

If you manage dashboard resources in YAML, you can register the module explicitly.

```yaml
resources:
  - url: /philips_airpurifier_frontend/philips-airpurifier-cards.js
    type: module
```

</details>

## Troubleshooting

| Symptom                                  | What to do                                                                                                              |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| No discovery card                        | Confirm that Home Assistant can reach the device. [Add it manually](#add-a-device-manually) with its IP address.        |
| Device unavailable                       | Stop other local CoAP clients that access the same device. If the connection stays unavailable, power-cycle the device. |
| Integration missing after manual install | Confirm the location of `manifest.json`. Restart Home Assistant and review **Settings → System → Logs**.                |
| Dashboard card missing                   | Reload the browser after Home Assistant restarts. Confirm that the integration is loaded.                               |

### Collect logs for a connection problem

A device can answer ping and the Philips Air+ app while local CoAP remains unresponsive. The integration attempts to reconnect. For intermittent failures such as [issue #172](https://github.com/tinkerologie/ha-philips-airpurifier/issues/172), collect a log that includes both the outage and recovery.

<details>
<summary>Debug log settings and reconnect messages</summary>

Add these loggers to `configuration.yaml` and restart Home Assistant. You can also set the same levels temporarily with the `logger.set_level` action.

```yaml
logger:
  logs:
    custom_components.philips_airpurifier: debug
    coap: debug
    philips_airctrl: debug
```

Leave the watchdog settings as they were when the issue occurred. Stop other local CoAP clients, such as a second Home Assistant instance. If possible, download device diagnostics during the outage and after recovery. The `connection` section contains the reconnect state and last error.

| Log message                          | Meaning                                                              |
| ------------------------------------ | -------------------------------------------------------------------- |
| `No updates from … for N seconds`    | The last push arrived approximately N seconds before this line.      |
| `failed at the create stage`         | The device did not answer the connection handshake.                  |
| `failed at the status stage`         | The handshake worked but the device did not answer the status read.  |
| `registered but no initial response` | The client subscribed but received no initial push.                  |
| `Reconnected … after N attempt(s)`   | The connection recovered. The log line includes the outage duration. |

Download the log from **Settings → System → Logs**. Restore the normal log levels after the capture. Remove IP addresses, device identifiers, and personal names before sharing logs or diagnostics.

</details>

### Report a bug or request model support

Search [existing issues](https://github.com/tinkerologie/ha-philips-airpurifier/issues) first. For a new report, include the full model code, device firmware, Home Assistant version, integration version, and the steps to reproduce the problem. Use the [issue forms](https://github.com/tinkerologie/ha-philips-airpurifier/issues/new/choose).

For a model request, use the [philips-airctrl CLI](https://github.com/tinkerologie/philips-airctrl) to collect status data if the device responds to a status read. Stop the integration for that device before running another local CoAP client. Capture the relevant modes and remove identifiers before attaching the data.

## Contributing

Read the [contribution guide](./CONTRIBUTING.md) for issue triage, local setup, and pull request checks. See the [changelog](./CHANGELOG.md) for release changes and the [quality scale self-audit](./custom_components/philips_airpurifier/quality_scale.yaml) for implementation status.

## Credits and license

The integration builds on [rgerganov’s protocol research](https://xakcop.com/post/ctrl-air-purifier/), [betaboon’s original CoAP integration](https://github.com/betaboon/philips-airpurifier-coap), and work by [Denaun](https://github.com/Denaun), [mhetzi](https://github.com/mhetzi), [Kraineff](https://github.com/Kraineff), [shexbeer](https://github.com/shexbeer), [Thomas Lovén](https://github.com/thomasloven), and the [project contributors](https://github.com/tinkerologie/ha-philips-airpurifier/graphs/contributors).

The project uses the [Apache 2.0 license](./LICENSE). The bundled icon handling code uses the [MIT license](./custom_components/philips_airpurifier/LICENSE.txt). You can also [support the project on GitHub Sponsors](https://github.com/sponsors/ruaan-deysel).
