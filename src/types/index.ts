export interface Coordinates {
  lat: number;
  lng: number;
  zoom: number;
}

export interface GeoBounds {
  west: number;
  south: number;
  east: number;
  north: number;
}

export interface DetectedBoundingBox {
  box: [number, number, number, number];
  score: number;
  label: string;
}

export interface GeocodeResult {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  extent?: [number, number, number, number];
}

export interface GeoJsonPolygonFeature {
  type: 'Feature';
  properties: {
    confidence?: number;
    areaM2?: number;
    centerLat?: number;
    centerLng?: number;
    [key: string]: unknown;
  };
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
}

export interface ViewportScanResult {
  features: GeoJsonPolygonFeature[];
  count: number;
  query: string;
  durationMs: number;
}

export type WorkerRequest =
  | { type: 'init' }
  | {
      type: 'detect';
      id: string;
      query: string;
      threshold: number;
      width: number;
      height: number;
      rawRgba: Uint8Array;
    };

export type WorkerResponse =
  | { type: 'init_done' }
  | {
      type: 'detect_result';
      id: string;
      detections: DetectedBoundingBox[];
    }
  | {
      type: 'detect_error';
      id: string;
      error: string;
    };
