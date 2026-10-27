# Four directional views

The existing Front illustrations are retained unchanged. Six additional PNGs supply
Right, Back and Left views of Unity Plaza and Majestic City. They were made with the
built-in ImageGen edit tool using the current front artwork and saved camera guides.
Exact prompts are in `prompts/`; hashes, dimensions and alpha bounds are recorded in
`sources.json`. These are separately illustrated facades, not mirrored front images.

| Control | Street bearing | Near footprint corner | Visible faces |
|---|---:|---|---|
| Front | −148° | Northeast | East/front and north |
| Right | −58° | Southeast | South and east/front |
| Back | 32° | Southwest | West/rear and south |
| Left | 122° | Northwest | North and west/rear |

All directions share the full country archive, roads, city jumps, zoom, layers and
feature inspection. The `view` query preserves the selected direction on reload.
“Both buildings · Bambalapitiya” frames the two illustrations in the clear map area.

Measured base points in `landmark.js` register each image to its correct geographic
corner. A constant per-image camera calibration aligns the two ground-axis slopes:
x stays unchanged, while y uses one fixed vertical scale and one fixed offset per
horizontal pixel. Vertical walls stay vertical. That calibration never depends on
zoom, pan or viewport. Rendering adds a uniform map scale and ground-anchor position,
so navigation cannot introduce changing shape or lean. Front transforms are unchanged.

This is not a four-corner footprint fit. Image depth, rear and unseen side facades,
roof equipment and continuity are artistic interpretations, not verified surveys.
The Back views deliberately hide the main front entrances and name boards. No
continuous 3D mesh is used. Images have finite raster resolution.

Each view loads on demand and stays cached in memory. Loading or failed directional
artwork displays that building's original footprint. The other building remains
usable. Alpha-based selection, keyboard activation, drag-through panning and depth
ordering work in all views. Details and About disclose approximate rear appearances.

Before-change checkpoint: `../../.checkpoints/before-four-views.tar.gz`.
No game, voice, model, iOS or saved-device files are involved.
