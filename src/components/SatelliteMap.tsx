import React, { useEffect, useRef } from 'react';
import { Map as MapLibreMap, NavigationControl, ScaleControl } from 'maplibre-gl';
import { ensureOverlayLayers } from '../services/mapOverlay';
import { SATELLITE_MAP_STYLE, MAX_MAP_ZOOM } from '../config/mapConfig';
import type { Coordinates } from '../types';

interface SatelliteMapProps {
  onMapReady: (map: MapLibreMap) => void;
  mapCenter: Coordinates;
}

export const SatelliteMap: React.FC<SatelliteMapProps> = ({ onMapReady, mapCenter }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const onMapReadyRef = useRef(onMapReady);

  useEffect(() => {
    onMapReadyRef.current = onMapReady;
  }, [onMapReady]);

  const initialCenterRef = useRef(mapCenter);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const initial = initialCenterRef.current;
    const map = new MapLibreMap({
      container: mapContainerRef.current,
      style: SATELLITE_MAP_STYLE,
      center: [initial.lng, initial.lat],
      zoom: Math.min(initial.zoom, MAX_MAP_ZOOM),
      maxZoom: MAX_MAP_ZOOM,
      attributionControl: false,
      canvasContextAttributes: { preserveDrawingBuffer: true },
    });

    mapRef.current = map;

    map.addControl(new NavigationControl({ showCompass: true, showZoom: true }), 'bottom-right');
    map.addControl(new ScaleControl({ maxWidth: 120, unit: 'metric' }), 'bottom-left');

    map.on('load', () => {
      ensureOverlayLayers(map);
      onMapReadyRef.current(map);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: [mapCenter.lng, mapCenter.lat],
      zoom: Math.min(mapCenter.zoom, MAX_MAP_ZOOM),
      speed: 1.2,
      essential: true,
    });
  }, [mapCenter.lng, mapCenter.lat, mapCenter.zoom]);

  return <div ref={mapContainerRef} className="w-full h-full" />;
};
