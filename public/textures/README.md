# Earth Textures

Place these files in this directory before building. Without them, the
Earth renders as a solid gray sphere — the code works, it just has nothing
to map.

## Required files

### `earth-day.jpg`
NASA Visible Earth — Blue Marble. Use the 2048×1024 or 4096×2048 version.

Source: <https://visibleearth.nasa.gov/collection/1484/blue-marble>

Specifically the "Blue Marble: Land Surface, Shallow Water, and Shaded
Topography" image. Rename it to `earth-day.jpg`.

### `earth-clouds.jpg`
NASA Visible Earth — Cloud Cover.

Source: <https://visibleearth.nasa.gov/images/57747/blue-marble-clouds>

Save as `earth-clouds.jpg`. The shader uses the same image as both the
color map and the alpha map (white = opaque clouds, black = transparent).

## Optional

### `env.hdr`
HDRI environment for image-based lighting. Skipped in this build —
adds 5–30MB to first-load. If you want it later:

1. Drop a `.hdr` file here.
2. Add `<Environment files="/textures/env.hdr" />` to `Scene.tsx`.

Polyhaven has good free options: <https://polyhaven.com/hdris>

## Licensing

NASA Visible Earth imagery is in the public domain. Polyhaven HDRIs are
CC0. No attribution required for either, though crediting NASA is the
right thing to do.
