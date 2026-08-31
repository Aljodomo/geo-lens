import type { GeoBounds, GeoJsonPolygonFeature } from '../types';

export function pixelRingToGeoJSON(
  pixelRing: Array<[number, number]>,
  bounds: GeoBounds,
  imageWidth: number,
  imageHeight: number,
  confidence = 1.0
): GeoJsonPolygonFeature | null {
  if (pixelRing.length < 4) return null;

  const lngSpan = bounds.east - bounds.west;
  const latSpan = bounds.north - bounds.south;

  const geoCoordinates: number[][] = pixelRing.map(([px, py]) => {
    const lng = bounds.west + (px / imageWidth) * lngSpan;
    const lat = bounds.north - (py / imageHeight) * latSpan;
    return [lng, lat];
  });

  const first = geoCoordinates[0];
  const last = geoCoordinates[geoCoordinates.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) {
    geoCoordinates.push([first[0], first[1]]);
  }

  let sumLng = 0;
  let sumLat = 0;
  for (let i = 0; i < geoCoordinates.length - 1; i++) {
    sumLng += geoCoordinates[i][0];
    sumLat += geoCoordinates[i][1];
  }
  const count = geoCoordinates.length - 1;
  const centerLng = count > 0 ? sumLng / count : first[0];
  const centerLat = count > 0 ? sumLat / count : first[1];

  return {
    type: 'Feature',
    properties: {
      confidence,
      centerLat,
      centerLng,
    },
    geometry: {
      type: 'Polygon',
      coordinates: [geoCoordinates],
    },
  };
}
