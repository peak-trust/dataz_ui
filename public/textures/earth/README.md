# Earth Globe Textures

High-resolution 4K textures for the cinematic globe visualization in the Story feature.

## Files

- **earth-day.jpg** (1.3MB, 4096x2048)
  - Day-time Earth texture without clouds
  - Shows continents, oceans, and topography
  - Used as the main `map` texture

- **earth-bump.jpg** (403KB, 4096x2048)
  - Elevation/bump map for 3D depth effect
  - Shows mountains, valleys, and terrain relief
  - Used as the `bumpMap` texture

- **earth-night.jpg** (4.8MB, 4096x2048)
  - Night-time Earth with city lights or cloud overlay
  - Reserved for future night-side rendering feature

## Source

Textures sourced from: https://github.com/turban/webgl-earth
License: Public domain / Open source

## Performance

- **4K Resolution** (4096x2048 pixels)
- **Optimized JPEG** compression for web delivery
- **Total size**: ~6.5MB for all textures
- **Load time**: ~1-2 seconds on typical broadband

## Future Enhancements

1. **Progressive Loading**: Implement low-res → high-res streaming
2. **WebP Format**: Convert to WebP for 30% smaller file size
3. **Lazy Loading**: Only load textures when Story page is visited
4. **Night Mode**: Blend day/night textures based on time or scroll progress
5. **Clouds Layer**: Add animated cloud layer for realism

## Texture Coordinates

All textures use standard equirectangular projection (latitude/longitude mapping):
- X-axis: Longitude (-180° to +180°)
- Y-axis: Latitude (+90° to -90°)
- Center: Prime Meridian (0°), Equator (0°)

## Attribution

These textures are derived from public satellite imagery and are free to use in this project.

