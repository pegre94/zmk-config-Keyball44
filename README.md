# Keyball44 ZMK Configuration

This keeb created by a group of people who loves keyball.

**Special Thanks to:**
- **PCB:** [yangxing844](https://github.com/yangxing844)
- **Case:** [delock](https://github.com/delock)
- **Firmware:** [Amos698](https://github.com/Amos698)

---

## Keymap

<img src="keymap-drawer/keyball44.svg" >

---

## Layers

| # | Name | Description |
|---|------|-------------|
| 0 | **DEFAULT (QWRT)** | Standard QWERTY layout |
| 1 | **NUM** | Numbers (1-9, 0) + Arrow keys |
| 2 | **SYM** | Symbols + Bluetooth controls |
| 3 | **FUN** | Function keys (F1-F12) |
| 4 | **MOUSE** | Mouse clicks + Navigation |
| 5 | **SCROLL** | Trackball scroll mode |
| 6 | **SNIPE** | Trackball precision/snipe mode |

---

## Layer Access (Thumb Cluster)

| Key | Tap | Hold |
|-----|-----|------|
| Left Inner | Space | MOUSE (layer 4) |
| Left Outer | Tab | SCROLL (layer 5) |
| Left Far | Escape | SNIPE (layer 6) |
| Right Inner | Enter | — |
| Right Outer | Backspace | SYM (layer 2) |

---

## Custom Behaviors

### Layer-Tap (`&lt`)
- **Tapping term:** 240ms
- **Flavor:** balanced
- **Quick-tap:** 150ms

### Mod-Tap (`&mt`)
- **Tapping term:** 200ms
- **Flavor:** tap-preferred
- **Quick-tap:** 150ms

### Caps Word
Continues with `_` and `-` characters.

---

## Bluetooth Controls (SYM Layer)

| Key Position | Action |
|--------------|--------|
| A | Clear all pairings (`BT_CLR`) |
| S | Select profile 0 |
| D | Select profile 1 |
| F | Select profile 2 |

---

## Trackball Configuration

| Setting | Value |
|---------|-------|
| **CPI** | 1200 |
| **CPI Divider** | 4 |
| **Snipe CPI** | 400 |
| **Scroll Tick** | 32 |
| **Orientation** | 180° |
| **Polling Rate** | 125Hz |
| **Automouse Timeout** | 700ms |
| **Smart Algorithm** | Enabled |

---

## Hardware

- **Board:** nice!nano v2
- **Shields:** keyball44_left, keyball44_right
- **Sensor:** PMW3610 (trackball)
- **Display:** Enabled
- **ZMK Studio:** Enabled (no locking)

---

## Bluetooth Settings

| Setting | Value |
|---------|-------|
| TX Power | +8 dBm (max) |
| Connection Interval | 9 |
| Latency | 16 |
| Experimental Connection | Enabled |
| Split Battery Proxy | Enabled |

---

## Building

Firmware is built via GitHub Actions. Push to trigger a build, then download artifacts from the Actions tab.
