# Texture Assets

This directory contains texture files for the 3D scene.

## Required Files

### Earth Textures (for react-globe.gl)
- `earth_day_8k.jpg` - Daytime Earth texture (optional, react-globe.gl has defaults)
- `earth_night_4k.jpg` - Nighttime Earth texture (optional)
- `earth_clouds_2k.jpg` - Cloud layer overlay (optional)

### Scene Textures
- `ocean_normal.jpg` - Ocean normal map for water shader (optional)
- `desert_ground.jpg` - Desert ground texture (optional)

## Sources

Earth textures can be sourced from:
- NASA Visible Earth (https://visibleearth.nasa.gov/)
- Blue Marble textures
- react-globe.gl includes default textures if none provided

## Notes

- Textures are optional - react-globe.gl will use default textures if not provided
- Recommended format: JPG or WebP
- Keep file sizes reasonable (under 2MB each for 4K textures)

