# Sri Lanka · RevLine Atlas

A separate, offline 2D map of Sri Lanka, in the project's cartoon racing style.
This folder is independent of the game, iOS bundle, voice module and device saves.

## Open

On this Mac, double-click **Open Map.command**. Keep the terminal window open.
Alternatively, from this folder:

```sh
python3 server.py --open
```

The address is `http://127.0.0.1:8123`. Python 3.9+ and a WebGL-capable browser
are required. Use `--port 8124` if the default port is occupied.
Opening `index.html` directly is not supported: the archive uses HTTP byte ranges.
The server binds only to this computer. No installation, login or internet is
needed to view the bundled map. Copy the **entire folder** when moving it.

## Explore

- Drag, scroll or pinch to move and zoom. Arrow keys and +/− also work.
- Whole island fits Sri Lanka on screen; the menu jumps to 16 towns/cities plus the two landmarks and their combined view.
- Choose **Unity Plaza · Bambalapitiya** or **Majestic City · Bambalapitiya** to see the building artwork.
  Front / Right / Back / Left select four fixed bird's-eye directions. Pan and zoom
  remain available; rotating around the building is deliberately disabled.
- Names, Buildings and Trees independently toggle their map layers.
- Click mapped roads/buildings for details. The URL remembers the current view.
- About this map explains the source, detail limits and illustrative styling.

## What this actually contains

`data/sri-lanka.pmtiles` contains the complete bounding-box extract from the
26 October 2026 Protomaps v4.15.2 basemap, retaining **all source zoom levels 0–15**.
The extraction covers longitude 79.3–82.1 and latitude 5.7–10.15, including the
island and surrounding water. It contains 140,070 addressed tiles, with repeated
empty/sea content deduplicated. The archive is approximately 176 MB (decimal).
Exact size, checksum and provenance are in `data/source.json`.

The map redraws vector geometry at every display zoom, up to **level 22**.
Enlarging it does not pixelate the geographical shapes. The original dataset
still has finite precision: zooming beyond level 15 enlarges the existing geometry
and does not discover extra detail. This is the scalable equivalent of the user's
“one huge image” request: a country archive with a viewer, rather than a bitmap.

**Accuracy limit:** this is OpenStreetMap data, not Google's map database, satellite
imagery, or a cadastral survey. It cannot guarantee every real road/building, an exact
Google Maps match, or identical detail in every area. Protomaps is a curated basemap;
not every OSM tag is included. Buildings are individual footprints at source zoom 15.
Unmapped buildings are left absent. No buildings or roads are invented.

Road positions, coastlines and building footprints come from the data. Roof colours,
forest canopy texture and lane markings are illustrative. They do not assert actual
roof colours, individual tree locations, lane counts or surveyed building heights.
Forest decoration uses a small screen-resolution texture; the geography is vector.
The style matches `frontend/career/region-art.js` and the original race scenery.

Unity Plaza is a deliberate exception to generic building styling. It is a **flat
transparent image**, not a 3D model, anchored to its mapped Galle Road frontage.
The original image retains its proportions at every zoom: translation and one
uniform scale replace the former three-corner warping. Its illustrated depth is
approximate rather than stretched to fill the entire source polygon.
The illustrated blue-glass facade and LED podium follow exterior photos; rooftop
details are interpreted. The sprite has finite image resolution, unlike the vector
roads. It replaces Unity Plaza's generic footprint at zoom 17+.
Majestic City uses a transparent camera edit based on the user's supplied Flow
image, with its frontage angle matched to Unity Plaza and Galle Road. The original
and first cutout are retained. The other three directions use six additional images
with constant camera calibration, upright walls and fixed ground anchors. Artwork
loads on demand with independent image-failure fallback. Rear faces are approximate. Other Bambalapitiya buildings remain generic footprints.
See [Unity Plaza sources](landmarks/unity-plaza/README.md) and
[Majestic City asset and placement](landmarks/majestic-city/README.md).
The [directional assets, prompts and placement notes](landmarks/views/README.md)
cover all three additional views. Links such as `?view=back` preserve the direction.

## Files and reuse

- `index.html`, `style.css`, `app.js`: the viewer and controls.
- `map-style.js`: the editable cartographic style and canopy painter.
- `landmark.js`: both landmarks' placement data, shared renderer and fixed-view settings.
- `landmarks/`: transparent sprites, originals, references and provenance.
- `data/sri-lanka.pmtiles`: the portable vector archive; usable in other PMTiles clients.
- `fonts/`, `vendor/`: bundled local fonts, map renderer and PMTiles reader.
- `server.py`: minimal standard-library HTTP server with byte-range support.
- `DESIGN.md`: visual direction and interaction contract.

No build process or package manager is needed. To host elsewhere, serve this folder
with a static server that supports HTTP Range requests and correct binary MIME types.
Keep the OpenStreetMap attribution visible. This work does not publish a website or
add the archive to the racing app's bundle.

## Verification

```sh
python3 check-server.py
node --check app.js
node --check map-style.js
node --check landmark.js
```

`check-browser.cjs` exercises the full viewer with Playwright (a development-only
dependency), while the server is running. Set `PLAYWRIGHT_MODULE` to an installed
Playwright module path and `CHROME_PATH` if Chrome is elsewhere. The test blocks
external runtime requests and covers all place jumps, building detail, zoom 22,
toggles, keyboard, phone layout, reduced motion, and missing-archive recovery.
`check-landmark.cjs` additionally checks ground anchoring, unchanged image proportions
across zoom/pan animation frames, Galle Road frontage, fixed camera, sprite selection,
building toggle, and missing-image fallback.
Headless captures use software WebGL because macOS headless Metal showed stale
tile rectangles; this test setting does not change the delivered viewer.

## Sources and licences

- [OpenStreetMap contributors / ODbL](https://www.openstreetmap.org/copyright).
- [Protomaps basemap download and attribution](https://docs.protomaps.com/basemaps/downloads).
- [Protomaps layer schema and inclusion limits](https://docs.protomaps.com/basemaps/layers).
- [PMTiles extractor](https://docs.protomaps.com/pmtiles/cli), version 1.31.2.
- [MapLibre GL JS](https://maplibre.org/), version 5.10.0, BSD-3-Clause.
- [PMTiles JavaScript](https://github.com/protomaps/PMTiles), version 4.5.0, BSD-3-Clause.
- [OpenFreeMap font glyph service](https://openfreemap.org/), Noto font glyphs / SIL OFL.
- Existing RevLine Lilita One and Teko fonts / SIL OFL.

Library and font notices are retained alongside their files. All Unicode blocks
used by source labels were identified by scanning the country archive. The single
unsupported supplementary-plane emoji in “Banyan 🌲” is omitted from its map label;
the original source data is unchanged. No remote font/tile service runs in the viewer.

`check-views.cjs` covers the four map directions, directional artwork, stable camera
calibration, ground anchors, country/city coverage, mobile view controls, URL restore,
selection and independent directional-image failure recovery.
