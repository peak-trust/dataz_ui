import * as THREE from 'three';

/**
 * Convert latitude/longitude coordinates to 3D position on a sphere
 * @param lat - Latitude in degrees (-90 to 90)
 * @param lng - Longitude in degrees (-180 to 180)
 * @param radius - Radius of the sphere (default: 1)
 * @returns THREE.Vector3 position on the sphere
 */
export function latLngToVector3(
  lat: number,
  lng: number,
  radius: number = 1
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
}

/**
 * Calculate great circle arc points between two lat/lng coordinates
 * Creates a smooth curved line on the sphere surface
 * @param startLat - Starting latitude
 * @param startLng - Starting longitude
 * @param endLat - Ending latitude
 * @param endLng - Ending longitude
 * @param radius - Sphere radius (default: 1)
 * @param segments - Number of segments for smoothness (default: 50)
 * @param altitude - Height above surface for the arc (default: 0.1)
 * @returns Array of THREE.Vector3 points forming the arc
 */
export function calculateArcPoints(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  radius: number = 1,
  segments: number = 50,
  altitude: number = 0.1
): THREE.Vector3[] {
  const start = latLngToVector3(startLat, startLng, radius);
  const end = latLngToVector3(endLat, endLng, radius);
  const points: THREE.Vector3[] = [];

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;

    // Spherical linear interpolation (slerp) for great circle
    const angle = start.angleTo(end);
    const point = new THREE.Vector3();

    if (angle === 0) {
      // Points are the same
      point.copy(start);
    } else {
      // Slerp formula
      const sinAngle = Math.sin(angle);
      const a = Math.sin((1 - t) * angle) / sinAngle;
      const b = Math.sin(t * angle) / sinAngle;

      point.x = a * start.x + b * end.x;
      point.y = a * start.y + b * end.y;
      point.z = a * start.z + b * end.z;
    }

    // Normalize to sphere surface
    point.normalize();

    // Add altitude (arc rises above surface)
    const arcAltitude = radius + altitude * Math.sin(t * Math.PI);
    point.multiplyScalar(arcAltitude);

    points.push(point);
  }

  return points;
}

/**
 * Convert a vector on sphere to lat/lng coordinates
 * Useful for debugging or reverse calculations
 * @param vector - THREE.Vector3 position
 * @returns Object with lat and lng in degrees
 */
export function vector3ToLatLng(vector: THREE.Vector3): { lat: number; lng: number } {
  const normalized = vector.clone().normalize();

  const lat = 90 - (Math.acos(normalized.y) * 180) / Math.PI;
  const lng = ((Math.atan2(normalized.z, -normalized.x) * 180) / Math.PI) - 180;

  return { lat, lng };
}

