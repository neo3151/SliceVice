# VOLUME 2 FORMATTING GUIDE: "The Uninstaller"

This guide defines the aesthetic and technical shifts for Volume 2 (Episodes 7-12). All assets and UI elements produced for this arc must adhere to these "Industrial Noir" constraints.

## 1. THE COLOR PALETTE: INDUSTRIAL AMBER
Volume 2 shifts from the Pink/Cyan neon of the slipstream to the Amber/Steel grit of the Mainland.

| Element | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Primary Accent** | `#ff8c00` | Industrial Amber - used for warning lights, HUD accents, and highlights. |
| **Secondary Accent** | `#4a4a4a` | Steel Grey - used for structural elements, armor plates, and shadows. |
| **High Alert** | `#ff0000` | Tactical Red - used for alarms and Vanguard searchlights. |
| **Background** | `#0a0a0a` | Deep Coal - slightly warmer/grittier than Volume 1 black. |

## 2. VISUAL STYLE: THE UNINSTALLER FILTER
- **Line Work**: Heavy, slightly more jagged lines. Volume 2 assets should look like they were drawn on rougher paper or scavenged blueprints.
- **Lighting**: "The High Humidity Glow." Light sources (Amber/Red) should have a heavy bloom, simulating a torrential winter rain in Miami.
- **Environment**: Focus on heavy machinery, rusted docks, shipping containers, and brutalist architecture (Megaplexes).

## 3. UI & HUD (READER)
- **Status Overlay**: The `.caption-hud` should use thicker borders and a stencil-like appearance.
- **V-Sentry Pulses**: Use the `high-octane-glow` effect but shift the cyan to amber for the V-Sentry HUD markers.
- **Corruption**: UI flashes should lean more into "Analog Distortion" (Horizontal bar shifts) rather than just "Color Blurs."

## 4. PROMPTING KEYWORDS
When generating assets for Volume 2, append these anchors:
> "...heavy industrial ink style, deep amber lighting, rain-drenched rusted metal, brutalist 1980s miami architecture, cinematic noir shadows, thick mechanical detail, analog grit, 4k high fidelity graphic novel art."

## 5. AUDIO ANCHOR: THE OBEY PULSE
All Volume 2 episodes must use the `AudioEngine` multi-stem system:
- **Loop**: `ep7_stem_pulse.wav` (The heartbeat).
- **Atmosphere**: `ep7_stem_drone.wav` (The heavy rain/industrial hum).
- **Static**: Disabled or extremely low (0.02) to keep the focus on the muffled "Warm" tone.
