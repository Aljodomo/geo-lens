import type { StyleSpecification } from 'maplibre-gl';
import type { Coordinates } from '../types';

export const MAX_MAP_ZOOM = 19;

export const DEFAULT_MAP_CENTER: Coordinates = {
  lat: 41.5292,
  lng: -93.6554,
  zoom: 18.1,
};

export const SATELLITE_MAP_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    'esri-satellite': {
      type: 'raster',
      tiles: [
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      ],
      tileSize: 256,
      attribution: 'Tiles &copy; Esri',
      maxzoom: 19,
    },
    'carto-labels': {
      type: 'raster',
      tiles: [
        'https://cartodb-basemaps-a.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      maxzoom: 19,
    },
    'selected-polygon': {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    },
  },
  layers: [
    {
      id: 'esri-satellite-layer',
      type: 'raster',
      source: 'esri-satellite',
      minzoom: 0,
      maxzoom: 20,
    },
    {
      id: 'carto-labels-layer',
      type: 'raster',
      source: 'carto-labels',
      minzoom: 10,
      maxzoom: 20,
      paint: {
        'raster-opacity': 0.7,
      },
    },
    {
      id: 'selected-polygon-fill',
      type: 'fill',
      source: 'selected-polygon',
      paint: {
        'fill-color': '#00E5FF',
        'fill-opacity': 0.35,
      },
    },
    {
      id: 'selected-polygon-outline',
      type: 'line',
      source: 'selected-polygon',
      paint: {
        'line-color': '#00E5FF',
        'line-width': 3,
        'line-opacity': 1,
      },
    },
  ],
};
