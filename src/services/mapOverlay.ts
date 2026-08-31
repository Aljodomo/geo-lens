import type { Map as MapLibreMap, GeoJSONSource } from 'maplibre-gl';
import type { GeoJsonPolygonFeature } from '../types';

export const DEFAULT_OVERLAY_SOURCE_ID = 'selected-polygon';

export function ensureOverlayLayers(
  map: MapLibreMap,
  sourceId = DEFAULT_OVERLAY_SOURCE_ID,
  color = '#00E5FF'
): void {
  if (!map.getSource(sourceId)) {
    map.addSource(sourceId, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });
  }

  const fillLayerId = `${sourceId}-fill`;
  if (!map.getLayer(fillLayerId)) {
    map.addLayer({
      id: fillLayerId,
      type: 'fill',
      source: sourceId,
      paint: {
        'fill-color': color,
        'fill-opacity': 0.35,
      },
    });
  }

  const outlineLayerId = `${sourceId}-outline`;
  if (!map.getLayer(outlineLayerId)) {
    map.addLayer({
      id: outlineLayerId,
      type: 'line',
      source: sourceId,
      paint: {
        'line-color': color,
        'line-width': 3,
        'line-opacity': 1,
      },
    });
  }
}

export function renderMapFeatures(
  map: MapLibreMap,
  features: GeoJsonPolygonFeature | GeoJsonPolygonFeature[],
  sourceId = DEFAULT_OVERLAY_SOURCE_ID
): void {
  const featureList = Array.isArray(features) ? features : [features];
  const source = map.getSource(sourceId) as GeoJSONSource | undefined;

  if (source) {
    source.setData({
      type: 'FeatureCollection',
      features: featureList,
    });
  }
}

export function clearMapFeatures(
  map: MapLibreMap,
  sourceId = DEFAULT_OVERLAY_SOURCE_ID
): void {
  const source = map.getSource(sourceId) as GeoJSONSource | undefined;
  if (source) {
    source.setData({
      type: 'FeatureCollection',
      features: [],
    });
  }
}
