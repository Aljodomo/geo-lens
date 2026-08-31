import type { Map as MapLibreMap } from 'maplibre-gl';
import type { GeoBounds } from '../types';

export interface MapViewportResult {
  canvas: HTMLCanvasElement;
  imageData: ImageData;
  viewportBounds: GeoBounds;
  width: number;
  height: number;
}

export function captureMapViewport(map: MapLibreMap): MapViewportResult | null {
  const mapCanvas = map.getCanvas();
  if (!mapCanvas) return null;

  const width = mapCanvas.width;
  const height = mapCanvas.height;

  const viewportCanvas = document.createElement('canvas');
  viewportCanvas.width = width;
  viewportCanvas.height = height;
  const ctx = viewportCanvas.getContext('2d');
  if (!ctx) return null;

  ctx.drawImage(mapCanvas, 0, 0, width, height);
  const imageData = ctx.getImageData(0, 0, width, height);

  const bounds = map.getBounds();
  const viewportBounds: GeoBounds = {
    west: bounds.getWest(),
    south: bounds.getSouth(),
    east: bounds.getEast(),
    north: bounds.getNorth(),
  };

  return {
    canvas: viewportCanvas,
    imageData,
    viewportBounds,
    width,
    height,
  };
}
