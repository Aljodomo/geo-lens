import type { Map as MapLibreMap } from 'maplibre-gl';
import { captureMapViewport } from './mapCapture';
import { zeroShotDetector } from './zeroShotDetector';
import { pixelRingToGeoJSON } from './geoReference';
import type { GeoJsonPolygonFeature, ViewportScanResult } from '../types';

export async function runViewportTextScan(
  map: MapLibreMap,
  query: string,
  threshold = 0.32
): Promise<ViewportScanResult> {
  const startTime = performance.now();

  const viewport = captureMapViewport(map);
  if (!viewport) {
    throw new Error('Failed to capture active map viewport');
  }

  const detections = await zeroShotDetector.detectBoundingBoxes(viewport.canvas, query, threshold);
  const features: GeoJsonPolygonFeature[] = [];

  for (const det of detections) {
    const [xmin, ymin, xmax, ymax] = det.box;

    const boxPolygonRing: Array<[number, number]> = [
      [xmin, ymin],
      [xmax, ymin],
      [xmax, ymax],
      [xmin, ymax],
      [xmin, ymin],
    ];

    const feature = pixelRingToGeoJSON(
      boxPolygonRing,
      viewport.viewportBounds,
      viewport.width,
      viewport.height,
      det.score
    );

    if (feature) {
      features.push(feature);
    }
  }

  const durationMs = Math.round(performance.now() - startTime);

  return {
    features,
    count: features.length,
    query,
    durationMs,
  };
}
