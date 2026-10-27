# Majestic City · placed user artwork

Current map: this folder contains the Front artwork. The additional Right, Back
and Left assets and their camera/placement rules are in [four views](../views/README.md).

The user supplied `Re-rendering_city_asset_facade_a…_2K_20261027032922.jpg`
and explicitly requested placement. `original-flow.jpg` is its unchanged 2048 × 2048
copy. The built-in ImageGen tool removed the chroma-green background; the resulting
`majestic-city.png` is a 1254 × 1254 RGBA cutout. The exact extraction instruction is
saved in `cutout-prompt.txt`. This was an image edit, not deterministic pixel keying;
the source is retained for fidelity comparison and future re-extraction.

The map now loads `majestic-city-aligned.png` (1325 × 1187), a second built-in
ImageGen edit made after the user requested that the frontage follow the road like
Unity Plaza. `alignment-prompt.txt` and `camera-guide.png` record the chosen edit's
inputs. This changes the illustrated camera, not merely its placement, and is not
pixel-identical to the supplied image. Both earlier images remain available.
Exterior corners have alpha zero. Small olive-green planters remain part of the
artwork. All versions have finite raster resolution.

## Placement

- Existing Protomaps building / POI ID: **35184580903184**.
- Source POI: **6.893978877379183 N, 79.85468119382858 E**.
- Full source polygon: `footprint.geojson`, copied from the prepared Flow pack.
- Image ground anchor: **(769, 1069)** at the near building corner.
- Frontage start: **(145, 802)** at the other end of the Galle Road facade.
- Measured drawn frontage: about **23.2°**, matching Unity Plaza's **23.2°**.
  The first cutout was about **19.5°**, visibly flatter than the road.
- Anchor maps to the geographic northeast corner, and frontage to the southeast
  corner, putting the supplied entrance face toward Galle Road.
- One positive uniform scale and translation only. No runtime shear, mirror,
  nonuniform resizing or image rotation.

This artwork does not exactly match the source polygon's depth or the idealized
camera guide. Its revised proportions remain constant during map navigation.
The frontage and one anchor are registered; do not claim
that every base/roof corner coincides with surveyed geometry. The selected view
frames the artwork separately from the source POI coordinates shown in details.

Unity Plaza's image, placement and camera remain unchanged. The shared renderer
combines both footprint exclusions, sorts sprites by ground depth, and uses the
image alpha for pointer selection. Transparent margins pass through to the map;
dragging pans normally. Both remain keyboard-selectable. Failure to load either
image restores that building's generic footprint and leaves the other functional.

Before-change viewer files: `../../.checkpoints/before-majestic-city-placement.tar.gz`.
Before this angle correction: `../../.checkpoints/before-majestic-city-angle.tar.gz`.
No game, voice, AI/model, iOS bundle or saved-device data was modified.
