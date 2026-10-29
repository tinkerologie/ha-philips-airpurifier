# Philips Air Purifier Home Assistant Integration

<!-- BADGES:START -->

[![Marketplace and HACS](https://img.shields.io/badge/Marketplace%20%7C%20HACS-Default-orange.svg)](https://www.hacs.xyz/docs/marketplace/)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/tinkerologie/ha-philips-airpurifier)](https://github.com/tinkerologie/ha-philips-airpurifier/commits/main)
[![GitHub Release](https://img.shields.io/github/v/release/tinkerologie/ha-philips-airpurifier)](https://github.com/tinkerologie/ha-philips-airpurifier/releases)
[![codecov](https://codecov.io/gh/tinkerologie/ha-philips-airpurifier/graph/badge.svg)](https://codecov.io/gh/tinkerologie/ha-philips-airpurifier)
[![License](https://img.shields.io/github/license/tinkerologie/ha-philips-airpurifier)](./LICENSE)
<!-- BADGES:END -->

A comprehensive **Local Push** integration for Philips air purifiers and humidifiers in Home Assistant. This integration provides complete control over your Philips air quality devices using the encrypted CoAP protocol for local communication.

## Table of Contents

- [Features](#-features)
- [Important Notice](#️-important-notice)
- [Installation](#-installation)
  - [HACS Installation (Recommended)](#hacs-installation-recommended)
  - [Manual Installation](#manual-installation)
- [Configuration](#️-configuration)
- [Supported Devices](#-supported-devices)
- [Available Entities](#-available-entities)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [Credits](#-credits)
- [License](#-license)

## Features

- **Local Control**: Direct communication with your device without cloud dependency
- **Auto-Discovery**: Automatic detection of compatible devices on your network
- **Comprehensive Entity Support**: Fan, humidifier, sensors, switches, lights, and more
- **Real-time Monitoring**: Air quality sensors, filter status, and device diagnostics
- **Material Design Icons**: Entity icons are defined through `icons.json` following Home Assistant patterns
- **Multi-language Support**: Available in English, German, Dutch, Bulgarian, Romanian, and Slovak
- **HACS Compatible**: Easy installation and updates through HACS

## ⚠️ Important Notice

**Please read this carefully before installation:**

Due to firmware limitations in Philips devices, this integration may experience stability issues. The connection might work initially but could become unresponsive over time. Common solutions include:

- Power cycling the Philips device
- Restarting Home Assistant
- Both actions combined

This integration includes automatic reconnection attempts, but they may not always succeed. These issues are inherent to the device firmware and cannot be resolved at the integration level.

**Background**: This integration is based on reverse engineering work by [@rgerganov](https://github.com/rgerganov). Read more about the [technical details](https://xakcop.com/post/ctrl-air-purifier/).

> **Note**: Philips has introduced a cloud-based API that works with Google Home and Alexa, but it's not publicly available for local integrations.

## Installation

### HACS Installation (Recommended)

1. **Add Repository**: Click the button below to add this repository to HACS:

   [![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=tinkerologie&repository=ha-philips-airpurifier&category=integration)

2. **Install**: Search for "Philips AirPurifier" in HACS and install it
3. **Restart**: Restart Home Assistant
4. **Configure**: Follow the [Configuration](#️-configuration) steps below

### Manual Installation

1. **Download**: Download `philips_airpurifier.zip` from the latest release on the [releases page](https://github.com/tinkerologie/ha-philips-airpurifier/releases)
2. **Extract**: Create the folder `config/custom_components/philips_airpurifier/` and extract the zip into it. `manifest.json` must end up directly in that folder
3. **Restart**: Restart Home Assistant
4. **Configure**: Follow the [Configuration](#️-configuration) steps below

Each release from 2026.10.4 on carries `philips_airpurifier.zip`, a `SHA256SUMS` file and a signed build provenance attestation. HACS and the Home Assistant Marketplace install the same zip. The "Downloaded N times" figure they show is the download count of the latest release's zip, so it starts again with each release. To check that a zip you downloaded is the one the release workflow built:

```bash
gh attestation verify philips_airpurifier.zip -R tinkerologie/ha-philips-airpurifier
sha256sum -c SHA256SUMS
```

Keep `SHA256SUMS` in the same folder as the zip. On macOS, use `shasum -a 256 -c SHA256SUMS`.

## Configuration

### Prerequisites

- Home Assistant 2026.9.0 or newer
- Philips air purifier/humidifier connected to your local network
- Device must support local CoAP communication (see [Important Notice](#️-important-notice))

### Setup Steps

#### Automatic Discovery (Recommended)

The integration automatically discovers compatible devices on your network using:

- MAC address patterns (B0F893*, 047863*, 849DC2*, 80A036*)
- Hostname patterns (mxchip\*)

When a device is discovered, Home Assistant will show a notification. Simply follow the setup wizard.

#### Manual Configuration

If automatic discovery doesn't work:

1. **Navigate**: Go to **Settings** → **Devices & Services**
2. **Add Integration**: Click **Add Integration**
3. **Search**: Search for "Philips AirPurifier" and select it
4. **Enter Details**: Provide your device's IP address or hostname
5. **Complete Setup**: The model will be detected automatically

### Important Notes

- **No YAML Configuration**: This integration uses the UI-based config flow only
- **IP Address Changes**: If your device's IP changes, the integration will attempt to auto-update. If this fails, simply reconfigure with the new IP address
- **Model Detection**: Unsupported models will generate a warning in the logs

### Reconfiguration

If your device changes IP addresses:

- **With Auto-discovery**: The integration will automatically detect and update the IP address
- **Manual Setup**: Add the device again with the new IP address - Home Assistant will recognize it's the same device and update the configuration

## Supported Devices

> **⚠️ Firmware Compatibility Warning**: Some newer firmware versions may disable local CoAP communication. If purchasing a device specifically for Home Assistant integration, ensure you can return it if the integration doesn't work.

### Device Support Summary

| Device Category   | Model Count    | Series Supported                                                                                                                                               |
| ----------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Air Purifiers** | 50+ models     | AC0650, AC0850, AC0950, AC1214, AC1715, AC2729, AC2889, AC2936, AC3033, AC3055, AC3210, AC3259, AC3420, AC3737, AC3829, AC3854, AC3858, AC4220, AC4550, AC5659 |
| **2-in-1 Combos** | 7 models       | AC0850C series, AMF765, AMF870                                                                                                                                 |
| **Humidifiers**   | 5 models       | CX3120, CX3550, CX5120, HU1509, HU1510, HU5710                                                                                                                 |
| **Fans**          | 1 model        | CX7550                                                                                                                                                         |
| **Total**         | **63+ models** | **29 series**                                                                                                                                                  |

### Air Purifiers

| Model Series | Variants                                   | Type                    |
| ------------ | ------------------------------------------ | ----------------------- |
| **AC0650**   | AC0650/10                                  | Compact Air Purifiers   |
| **AC0850**   | /11, /20, /31, /41, /70, /81, /85          | Compact Air Purifiers   |
| **AC0950**   | AC0950, AC0951                             | Compact Air Purifiers   |
| **AC1214**   | AC1214                                     | Compact Air Purifiers   |
| **AC1715**   | AC1715                                     | Compact Air Purifiers   |
| **AC2200**   | AC2210/10, AC2220/10, AC2221/13            | PureProtect Quiet 2200  |
| **AC2729**   | AC2729                                     | Mid-range Air Purifiers |
| **AC2889**   | AC2889                                     | Mid-range Air Purifiers |
| **AC2936**   | AC2936, AC2939, AC2958, AC2959             | Mid-range Air Purifiers |
| **AC3033**   | AC3033, AC3036, AC3039                     | Advanced Air Purifiers  |
| **AC3055**   | AC3055, AC3059                             | Advanced Air Purifiers  |
| **AC3210**   | AC3210, AC3220, AC3221                     | Advanced Air Purifiers  |
| **AC3259**   | AC3259                                     | Advanced Air Purifiers  |
| **AC3420**   | AC3420, AC3421                             | Advanced Air Purifiers  |
| **AC3737**   | AC3737                                     | Advanced Air Purifiers  |
| **AC3829**   | AC3829, AC3836                             | Advanced Air Purifiers  |
| **AC3854**   | AC3854/25, AC3854/50, AC3854/51            | Advanced Air Purifiers  |
| **AC3858**   | AC3858/50, AC3858/51, AC3858/83, AC3858/86 | Advanced Air Purifiers  |
| **AC4220**   | AC4220, AC4221, AC4236                     | Premium Air Purifiers   |
| **AC4550**   | AC4550, AC4558                             | Premium Air Purifiers   |
| **AC5659**   | AC5659, AC5660                             | Premium Air Purifiers   |

### Air Purifier & Humidifier Combos (2-in-1)

| Model Series     | Variants                | Type                                      |
| ---------------- | ----------------------- | ----------------------------------------- |
| **AC0850 Combo** | /11, /20, /31, /41, /70 | Compact 2-in-1 Devices                    |
| **AMF765**       | AMF765                  | Advanced 2-in-1 Air Purifier & Humidifier |
| **AMF870**       | AMF870                  | Premium 2-in-1 Air Purifier & Humidifier  |

### Humidifiers

| Model Series | Variants       | Type                |
| ------------ | -------------- | ------------------- |
| **CX3120**   | CX3120         | Compact Humidifier  |
| **CX3550**   | CX3550         | Compact Humidifier  |
| **CX5120**   | CX5120         | Advanced Humidifier |
| **HU1509**   | HU1509, HU1510 | Compact Humidifier  |
| **HU5710**   | HU5710         | Premium Humidifier  |

### Fans

| Model Series | Variants  | Type            |
| ------------ | --------- | --------------- |
| **CX7550**   | CX7550/01 | Oscillating Fan |

### Special Variants & Notes

**AC0850 Series Special Variants:**

- **AWS_Philips_AIR**: Standard air purifier mode (AC0850/11, /20, /31, /41, /70)
- **AWS_Philips_AIR_Combo**: 2-in-1 air purifier and humidifier mode (AC0850/11C, /20C, /31C, /41C, /70C)

**Model Naming Convention:**

- Models with `/XX` suffix indicate regional variants (e.g., AC3854/50, AC3858/51)
- Models with `C` suffix indicate combo (2-in-1) variants where applicable
- AMF series are dedicated 2-in-1 air purifier and humidifier devices
- CX and HU series are dedicated humidifiers

**AMF765 / AMF870 Rotation (Oscillation) Notes:**

- The AMF models keep the rotation angle and the on/off state in a single device value, which this integration surfaces in two ways:
  - the **Oscillation** number entity sets the angle directly — `0°` stops the rotation, `30°` to `350°` (in 5° steps) start it at that angle;
  - the fan entity's **oscillation** toggle (`fan.oscillate`) starts and stops the rotation without having to pick an angle.
- Turning the rotation off and on again restores the last angle the device reported. If no angle has been seen yet (for example, right after a Home Assistant restart), switching it on uses 90°.

**CX7550 Oscillating Fan Notes:**

- **Initial setup requires the Philips Air app**: the CX7550 must first be joined to your Wi-Fi network with the official Philips Air mobile app. Once it is on the network, this integration controls it entirely locally over CoAP — no cloud or app is needed for day-to-day use.
- **Push-only firmware**: the `AWS_Philips_AIR_Combo` firmware never answers a direct status read and only pushes updates on a real state change. The integration handles this automatically by briefly toggling the display backlight to elicit an update, so the backlight may flicker momentarily on (re)connect.
- **Display in standby (firmware limitation)**: while the fan is powered **off**, the device forces its display to a dim standby level and ignores "off" commands. As a result, the display backlight **cannot be turned off from Home Assistant while the fan is off** — it can be controlled normally while the fan is running. A separate **Standby temperature display** switch toggles whether the temperature readout is shown in standby.

## Available Entities

This integration provides comprehensive control through various Home Assistant entity types:

### Core Entities

| Entity Type    | Description                             | Features                              |
| -------------- | --------------------------------------- | ------------------------------------- |
| **Fan**        | Main device control                     | Power, speed, preset modes, rotation  |
| **Humidifier** | Humidity control (2-in-1 models)        | Target humidity, humidification modes |
| **Climate**    | Temperature control (applicable models) | Temperature settings, heating modes   |

### Monitoring Entities

| Entity Type        | Examples                          | Purpose                |
| ------------------ | --------------------------------- | ---------------------- |
| **Sensors**        | PM2.5, IAI, Temperature, Humidity | Air quality monitoring |
| **Binary Sensors** | Filter replacement, Water refill  | Maintenance alerts     |

### Control Entities

| Entity Type  | Examples                          | Purpose          |
| ------------ | --------------------------------- | ---------------- |
| **Switches** | Child lock, Display light         | Device settings  |
| **Lights**   | Display brightness, Status lights | Visual controls  |
| **Select**   | Timer settings, Function modes    | Advanced options |
| **Number**   | Custom values (model-dependent)   | Precise control  |

### Entity Attributes

The fan entity includes additional attributes with device information:

| Attribute          | Description            | Example                            |
| ------------------ | ---------------------- | ---------------------------------- |
| `name`             | Device name            | "bedroom"                          |
| `type`             | Configured model       | "AC2729"                           |
| `model_id`         | Philips model ID       | "AC2729/10"                        |
| `product_id`       | Philips product ID     | "85bc26fae62611e8a1e3061302926720" |
| `device_id`        | Philips device ID      | "3c84c6c8123311ebb1ae8e3584d00715" |
| `software_version` | Device firmware        | "0.2.1"                            |
| `wifi_version`     | WiFi module version    | "AWS_Philips_AIR@62.1"             |
| `error_code`       | Philips error code     | "49408"                            |
| `error`            | Human-readable error   | "no water"                         |
| `preferred_index`  | Air quality index type | "PM2.5", "IAI"                     |
| `runtime`          | Device uptime          | "9 days, 10:44:41"                 |

## Troubleshooting

### Debug Logging

To enable detailed logging, add this to your `configuration.yaml`:

```yaml
logger:
  logs:
    custom_components.philips_airpurifier: debug
    coap: debug
    philips_airctrl: debug
```

Logs will be available in `home-assistant.log`.

### Common Issues

| Problem                 | Solution                                                   |
| ----------------------- | ---------------------------------------------------------- |
| Device not discovered   | Check network connectivity, ensure device supports CoAP    |
| Connection drops        | Power cycle device, restart Home Assistant                 |
| Entities unavailable    | Check device firmware version, verify local API is enabled |
| Integration not loading | Check Home Assistant logs, verify installation             |

### Device answers ping and the app, but goes unavailable

Some devices stop answering the local CoAP connection for a while, often at
night, while they still answer ping and the Philips Air+ cloud app
([#172](https://github.com/tinkerologie/ha-philips-airpurifier/issues/172)).
The cause is not known yet. To help diagnose it, collect one night of evidence:

1. Enable the three debug loggers above. Either add them to `configuration.yaml`
   and restart, or call the `logger.set_level` action (no restart, resets on restart).
2. Keep your current options (for example, watchdog on and your missed package count).
3. Do not run another local CoAP client for the device, such as the `aioairctrl` CLI
   or a second Home Assistant instance. It can take over the device's connection.
   The cloud app and ping are fine; note when you use the app.
4. If you can, download the device diagnostics once during an outage and once after
   it recovers. The `connection` section shows the reconnect state and last error.
5. In the morning, download the log from **Settings → System → Logs**, set the loggers
   back to `warning`, and replace the device IP and names before sharing.

How to read the log lines:

| Log line                                             | Meaning                                                                                       |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `No updates from … for N seconds (watchdog interval` | No push for N seconds. The silence started N seconds before this line, not at this timestamp. |
| `Reconnect … failed at the create stage`             | The device did not answer the connection handshake (sync).                                    |
| `Reconnect … failed at the status stage`             | The handshake worked, but the status read got no answer.                                      |
| `registered but no initial response`                 | The push subscription was sent, but the device never sent its first update.                   |
| `Reconnected … after N attempt(s)`                   | Recovery succeeded after N attempts; the line shows how long the device was unavailable.      |

### Getting Help for Unsupported Models

If your model isn't supported yet, you can help by providing device data:

#### 1. Prepare Environment

```bash
# Create virtual environment
python -m venv env
source ./env/bin/activate  # On Windows: env\Scripts\activate

# Install required package
python -m pip install philips-airctrl
```

#### 2. Collect Device Data

```bash
# Replace $DEVICE_IP with your device's IP address
philips-airctrl --host $DEVICE_IP status --json
```

#### 3. Submit Data

1. Test different modes and speeds using the Philips app
2. Collect JSON output for each configuration
3. [Open an issue](https://github.com/tinkerologie/ha-philips-airpurifier/issues) with the collected data

#### 4. Clean Up

```bash
deactivate  # Exit virtual environment
```

## Entity Icons

Entity icons are defined using Home Assistant `icons.json` with Material Design Icons (`mdi:`) values.

## Contributing

Contributions are welcome! Here's how you can help:

### Reporting Issues

- Use the [issue tracker](https://github.com/tinkerologie/ha-philips-airpurifier/issues)
- Provide detailed information about your device model and firmware
- Include relevant logs when reporting bugs

### Adding Device Support

1. **Test your device** with the integration
2. **Collect device data** using the steps in [Troubleshooting](#-troubleshooting)
3. **Submit the data** via an issue or pull request

### Code Contributions

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Development Setup

```bash
# Clone the repository
git clone https://github.com/tinkerologie/ha-philips-airpurifier.git
cd ha-philips-airpurifier

# Install development dependencies
pip install -r requirements-dev.txt

# Run tests
pytest
```

## Credits

This integration builds upon the excellent work of many contributors:

- **[@rgerganov](https://github.com/rgerganov)**: Original reverse engineering and [py-air-control](https://github.com/rgerganov/py-air-control)
- **[@betaboon](https://github.com/betaboon)**: Initial [philips-airpurifier-coap](https://github.com/betaboon/philips-airpurifier-coap) integration
- **[@Denaun](https://github.com/Denaun)**: Major rework and improvements
- **[@mhetzi](https://github.com/mhetzi)**: Timer and reconnection functionality
- **[@Kraineff](https://github.com/Kraineff)**: Various contributions and testing
- **[@shexbeer](https://github.com/shexbeer)**: Device support and testing
- **[@thomasloven](https://github.com/thomasloven)**: Custom icon implementation

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details. The bundled icon loading and handling code by Thomas Lovén remains under the MIT License ([LICENSE.txt](./custom_components/philips_airpurifier/LICENSE.txt)).

---

### Made with ❤️ for the Home Assistant community

If you find this integration useful, consider:

- ⭐ Starring this repository
- 🐛 Reporting issues
- 🔧 Contributing improvements
- ☕ [Supporting the project](https://github.com/sponsors/ruaan-deysel)

## Dashboard cards

Requires **Home Assistant 2026.9.0 or later**. The integration automatically loads its
packaged cards after restart; select **Philips Purifier**, **Philips Air Quality**, or
**Philips Humidity** in the dashboard card picker. Each has a visual editor with a
device selector. Only entities exposed by that device appear. Reload the browser
after upgrading if the picker has not refreshed.

```yaml
type: custom:philips-airpurifier-purifier-card
device_id: YOUR_PHILIPS_DEVICE_ID
```

```yaml
type: custom:philips-airpurifier-air-quality-card
device_id: YOUR_PHILIPS_DEVICE_ID
```

```yaml
type: custom:philips-airpurifier-humidity-card
device_id: YOUR_PHILIPS_DEVICE_ID
```

All cards accept `device_id` and an optional `name`. Purifier and humidity cards
also accept an `entity` override belonging to the selected device. The purifier
card supports `show_presets`, `show_speed`, `show_filter`, and `show_pm25` (all
true by default). Its controls panel mirrors the Philips Air+ app: power and
child-lock buttons, a mode button that opens a "Choose a mode" sheet (shown as
Auto+ when the Auto+ switch is on), and tiles for the display light, fan speed,
light ring and timer, each shown only when the device supports it. The
humidity card supports `show_target_control`, `show_mode`, and `show_water_level`
(all true by default). Target bounds and step come from the actual device entities;
missing metadata disables the target control. The air-quality card accepts an
optional ordered `sensors` list; omit it to discover all supported readings in
Philips app order (PM2.5, gas, allergens, TVOC). It rates readings as Good, Fair,
Poor or Very poor (PM2.5 uses US EPA breakpoints 12/35/55 µg/m³; IAI uses 1–12 and
gas uses L1–L4), shows a 24-hour PM2.5 trend from hourly recorder statistics
(`show_trend`) and the device's humidity and temperature (`show_climate`). Override
the level colours with the `--pap-good-color`, `--pap-fair-color`,
`--pap-poor-color` and `--pap-very-poor-color` theme variables.
TVOC and gas readings are device indices, not concentration measurements.

Unavailable/unknown values are shown explicitly and unavailable controls are disabled.
Service errors appear on the card. Filter details open Home Assistant more-info;
filter resets remain deliberate integration actions. Scheduling and history use
Home Assistant automations and recorder rather than unexposed Philips cloud data.

For manual module registration (including YAML-managed dashboard resources), use:

```yaml
resources:
  - url: /philips_airpurifier_frontend/philips-airpurifier-cards.js
    type: module
```

Automatic loading uses the integration version and a bundle content hash to refresh
cached assets. Registration is safe if the module is also present in manual resources.

The integration targets the applicable implementation rules through Platinum on the
Integration Quality Scale. Documentation gaps and incomplete upstream public typing remain recorded in `quality_scale.yaml`;
this is a self-audit of a custom integration, not an official Platinum certification.

For development, run `./script/setup/project`, then the repository `script/` checks.
The isolated `frontend/` workspace uses `npm run typecheck`, `npm test`, and
`npm run build`; commit the generated module together with source changes.
