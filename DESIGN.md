---
version: alpha
name: RevLine Sri Lanka Atlas
description: A standalone, offline, top-down vector map using RevLine's cartoon racing scenery.
colors:
  ink: "#0f1724"
  panel: "#15233c"
  text: "#f8f9fc"
  muted: "#b6c4d8"
  yellow: "#ffc928"
  water: "#2fa8e0"
  grass: "#5bbb47"
  forest: "#2f8a3a"
typography:
  display:
    fontFamily: "'Lilita One', sans-serif"
  body:
    fontFamily: "'Segoe UI', sans-serif"
  data:
    fontFamily: "'Teko', sans-serif"
rounded:
  DEFAULT: "16px"
omitted:
  - section: spacing
    reason: Single map canvas with responsive overlay positioning, not a multi-screen component system.
---

The user's explicit reference is the existing code-drawn race scenery, especially
frontend/ART-REQUESTS/references/screens/race-grass.png and
frontend/career/region-art.js. Use its green grass, ink outlines, blue water,
charcoal roads, rounded canopy shapes, yellow controls and chunky type.
Lilita One and Teko are existing project fonts from frontend/shared/theme.css;
the copies here allow the folder to run independently. This is an intentional
isolated atlas, not a redesign of the game or its root instrument UI.

The geographical shapes are data, not decoration. Retain Protomaps source paths
and building footprints. Do not randomly generate roads, landmarks or buildings.
Roof colours, canopy texture and dashed road markings are illustrative treatments.
Do not claim surveyed tree positions, roof colours, lane layouts or heights.

style.css is canonical for UI tokens (runtime ownership model B): each colour
above maps to its same-name CSS variable, typography maps to --display, --body,
--data, and rounded.DEFAULT to --radius. map-style.js owns cartographic paint.
The map is 2D. Four native buttons select fixed bird's-eye directions: Front
−148°, Right −58°, Back 32°, Left 122°, all at pitch 58°. The selected direction
also rotates the full country map. Between zooms 14.5 and 17, the front view
transitions from the north-up island overview; other views add 90°/180°/270°.
The URL's view query preserves direction. User orbit and pitch gestures
are disabled, including keyboard rotation. A 1° vertical field of view gives the
ground a near-orthographic strategy-game presentation. No building mesh or
extrusion is used. Sprites hide while the camera turns. Loading/failed directional
images retain their own geographic footprints until the correct image is ready.
Vector geometry remains sharp through zoom 22; native source detail stops at 15.
Decorative forest canopies are generated at display resolution and confined to
mapped forest polygons.

Unity Plaza is the first explicitly user-authorized photo-based landmark. Its
transparent 1536 × 1024 sprite is generated from the actual refurbished facade
and official current LED-fascia reference. The image has finite raster resolution;
do not extend the vector sharpness guarantee to this sprite. At zoom 17+, its base
anchor registers to the footprint's northeast corner. The sign-bearing facade
follows the eastern NE–SE frontage beside Galle Road. In the original Front view, only translation and positive
uniform scaling are allowed: never dynamically stretch, shear, mirror or rotate
the image to fit footprint corners. Original image proportions take precedence
over filling every corner of the polygon; illustrated depth is approximate.
The original generic building fill is excluded only while the
sprite has loaded successfully; failed artwork retains the mapped footprint.
Buildings Off hides both sprites. Other buildings remain the existing flat shapes.
Majestic City is based on the user's Google Flow image. Following the user's
frontage-alignment correction, a built-in ImageGen camera edit supplies the current
1325 × 1187 majestic-city-aligned.png: its measured front base slopes about 23.2°,
matching Unity Plaza and approximately parallel to Galle Road (within 1.5° with
the frontage in view). The original JPEG and first 1254 × 1254 cutout are retained alongside
it in landmarks/majestic-city/. Its own measured ground anchor is pinned to the
northeast footprint corner; frontage length sets uniform scale. Keep walls upright
and keep its Front view on the original uniform scaling and translation. The edited image is not
pixel-identical to the supplied artwork, and its side/depth and roof are illustrative,
not an exact four-corner projection or survey. Do not stretch it to fill the polygon.
The two records share one renderer and one combined footprint filter, so a missing
image restores only its own footprint. Sprites are ordered by projected ground depth.
Alpha-aware map picking ignores transparent margins; dragging over the artwork pans
the map. Native sprite buttons retain keyboard activation and visible focus.
The Majestic City place jump frames its artwork, while details show the source POI.
Six new images in landmarks/views/ provide the other three directions. Rear and
unseen side faces are explicitly approximate. Generated camera discrepancies use
one constant vertical-axis calibration per image, followed by uniform map scaling.
The calibration keeps vertical walls upright and both base directions parallel to
the map axes. Its coefficients never change with pan, zoom or viewport; do not
revive the old per-frame three-corner fit. Front transforms remain unchanged.
Eight independent image-cache entries use alpha-based picking. Correct ground
corners and projected depth control placement/occlusion in each view.
“Both buildings · Bambalapitiya” frames both landmarks in the clear canvas area.
Rooftop equipment is interpretation, not surveyed detail. Source records and prompts
live beside each image under landmarks/.

Desktop overlays sit at the edges, leaving the island central. On phones,
place/layer controls move to the bottom; the country fit reserves space for them.
The map owns panning, with arrow-key and zoom-button alternatives to gestures.
Native select and dialog retain platform keyboard/focus behavior. Controls have
44px touch targets where possible, visible focus and selected-state semantics.
User navigation respects reduced motion. No camera, microphone or location access.

| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
|---|---|---|---|---|
| Select/Listbox | Native select in index.html | This file | Operating-system popup | Keyboard, selection, mobile |
| Scrollbar | Global style.css baseline | This file | Standards and WebKit fallback | Overflow and computed style |
| Dialog | Native about-dialog in index.html | This file | Escape and close button | Focus restore, mobile scrolling |
| Map feedback | app.js status and load-error | This file | Loading, ready, retry | Browser with missing archive |
| Illustrated landmark | landmark.js directional sprites, fixed calibration, ground anchors and alpha picking | This file | Two buildings × four fixed directions | Stable proportions, upright walls, base axes, pointer/keyboard, combined filters, independent failed-image fallback |
| Map direction | Native view-picker buttons, app.js and ATLAS_CAMERA | This file | Front / Right / Back / Left | Selected state, keyboard, URL restoration, full-country coverage, mobile framing |

No remote runtime dependencies: libraries, fonts and country archive are local.
Errors stay visible and offer retry. External source links are user-activated.
There is no saved account data, backend, race-state integration or device-save access.
