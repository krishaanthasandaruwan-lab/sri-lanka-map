# Unity Plaza · first illustrated landmark

Current map: the original asset below is the Front view. The user subsequently
requested Right, Back and Left views; their separate artwork, fixed camera
calibration and approximate rear appearance are documented in [four views](../views/README.md).

The user requested only Unity Plaza as a first trial: real building appearance,
in the existing cartoon map style, with the fixed bird's-eye presentation of a
2D strategy game. This is one transparent sprite, not a 3D model or 360° view.

## Appearance references

- [Steradian Capital's refurbishment case study](https://www.steradiancapital.com/track-record/asset-management-and-refurbishment-shopping-centre)
  provides the daytime corner photo used for facade shape and proportions.
  Downloaded source: `https://images.ctfassets.net/gdw3chgtx8xp/6d1wB2ROGZRn97MoswlDEh/108206aecf540b899c8a7ab3ae2c39ee/Unity_01.jpg`.
- [Unity Plaza's official website](https://unityplaza.lk/) provides the current
  blue-glass tower and wraparound LED-fascia reference in its header video:
  `https://unityplaza.lk/wp-content/themes/unity-plaza-v2/img/unity-plaza-hpa.webm`.
  The saved reference is a frame at 3 seconds; the promotional sky/effects are
  not part of the generated building.
- [Official LED-screen update](https://unityplaza.lk/a-new-glow-for-galle-road/)
  confirms the newer wraparound display. The illustration uses restrained abstract
  blue graphics and the building name instead of copying a temporary ad campaign.

Photos remain copyright their respective owners and are research references,
not runtime map layers. The application loads only the generated sprite.

## Geographic registration

The local 26 October 2026 Protomaps archive identifies both the Unity Plaza POI and
building with feature ID **35184714032280**. The point is
**6.893515547074671 N, 79.85515594482422 E**. `footprint.geojson` stores the full
source polygon; the nearby tile edge also contains a clipped copy, which was not
used for placement. `landmark.js` uses the complete source coordinates.

At zoom 17+, the generic fill/shadow/outline for this ID are excluded only after
the sprite loads and the street camera has reached its fixed angle. The image's
ground corner at **(890, 980)** maps to the geographic northeast corner. The named
facade starts at image point **(282, 720)** and follows the **NE–SE eastern edge
beside Galle Road**. The camera bearing is −148°, pitch 58°, vertical FOV 1°.

Only a translation and a single positive scale are applied during map rendering.
There is no live shear, nonuniform stretch, mirror or image rotation. Scale follows
the projected frontage length; the anchor stays on its geographic coordinate.
The near-orthographic ground reduces perspective changes across the viewport.
The original artwork is unchanged; its illustrated depth is approximate and does
not fill every source-footprint corner. The narrow pavement sits outside the walls.

The earlier three-corner affine fit was removed after the user's zoom/pan examples
showed the tower leaning and stretching. Corner alignment alone was an insufficient
test: current checks also require unchanged proportions in intermediate frames.

This registers the building's position and base. It does not certify survey-level
dimensions or every facade/roof detail. The roof, HVAC and antennas are plausible
interpretations where reference coverage is incomplete. No neighboring building
has been replaced or invented.

## Asset

- `unity-plaza.png`: 1536 × 1024 RGBA, genuine transparent background.
- Generated with the built-in **ImageGen** tool on 27 October 2026.
- Source prompt: `prompt.txt`; inputs: `references/refurbished-corner.jpg` and
  `references/official-video-03.jpg`.
- Reference appearance: modern blue reflective glazing, off-white vertical fins,
  retail podium, ground-floor shops and the newer LED fascia.
- Finite raster resolution: extreme enlargement is not lossless vector detail.

Pre-change viewer files are saved in `../../.checkpoints/before-unity-plaza.tar.gz`.
The previous placement implementation is saved in
`../../.checkpoints/before-unity-placement-fix.tar.gz`.
The country archive, voice module, game and device saves were not changed.

## Artwork supplied by another generator or artist

Keep the map placement separate from the artwork. Supply a transparent PNG/WebP
in this same fixed view with upright vertical edges, the road-facing sign on the
visible front facade, a known ground anchor and frontage endpoints in image pixels.
Include canvas dimensions, the intended real-world front edge and reference images.
Choose the image's view to match the fixed camera; a flat sprite cannot provide a
new azimuth by rotating the bitmap without tilting its verticals or mirroring text.
Keep shadows tight to the base and leave roads/neighbors out of the asset.

The renderer scales the whole supplied asset uniformly. If another view is needed,
request a matching directional asset instead of warping its corners. This step
adds no shop, placement editor, purchasing or persistence; those remain future work
at the user's direction.
