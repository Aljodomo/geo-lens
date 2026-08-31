import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { Map as MapLibreMap } from 'maplibre-gl';
import { SatelliteMap } from './components/SatelliteMap';
import { HeaderNav } from './components/HeaderNav';
import { ScanningHud } from './components/ScanningHud';
import { runViewportTextScan } from './services/viewportScanPipeline';
import { renderMapFeatures } from './services/mapOverlay';
import { zeroShotDetector } from './services/zeroShotDetector';
import { DEFAULT_MAP_CENTER } from './config/mapConfig';
import type { Coordinates } from './types';

export const App: React.FC = () => {
  const mapInstanceRef = useRef<MapLibreMap | null>(null);

  const [mapCenter, setMapCenter] = useState<Coordinates>(DEFAULT_MAP_CENTER);
  const [liveCoords, setLiveCoords] = useState<Coordinates>(DEFAULT_MAP_CENTER);

  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<string | null>(null);

  useEffect(() => {
    zeroShotDetector.load().catch((err) => console.warn('Background detector load:', err));
  }, []);

  const handleMapReady = useCallback((map: MapLibreMap) => {
    mapInstanceRef.current = map;

    map.on('move', () => {
      const center = map.getCenter();
      setLiveCoords({
        lat: center.lat,
        lng: center.lng,
        zoom: map.getZoom(),
      });
    });
  }, []);

  const handleLocationSelect = useCallback((lat: number, lng: number, zoom = 15) => {
    setMapCenter({ lat, lng, zoom });
  }, []);

  const handleScanViewport = useCallback(async (query: string) => {
    if (!mapInstanceRef.current) return;

    try {
      setIsScanning(true);
      setScanStatus(`Scanning viewport for "${query}"...`);

      const result = await runViewportTextScan(mapInstanceRef.current, query);

      renderMapFeatures(mapInstanceRef.current, result.features);

      if (result.count > 0) {
        setScanStatus(
          `✓ Found ${result.count} "${query}" in ${(result.durationMs / 1000).toFixed(1)}s`
        );
      } else {
        setScanStatus(
          `No distinct "${query}" detected in current viewport. Try zooming in or searching another target.`
        );
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Detection failed';
      console.error('Scan error:', err);
      setScanStatus(`Scan error: ${errorMessage}`);
    } finally {
      setIsScanning(false);
      setTimeout(() => {
        setScanStatus((prev) => (prev?.startsWith('✓') || prev?.startsWith('No') ? prev : null));
      }, 8000);
    }
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#121212] text-[#e3e2e6] font-sans select-none">
      <HeaderNav
        onLocationSelect={handleLocationSelect}
        onScanViewport={handleScanViewport}
        currentCenter={liveCoords}
        isScanning={isScanning}
        scanStatus={scanStatus}
      />

      <SatelliteMap onMapReady={handleMapReady} mapCenter={mapCenter} />

      {isScanning && <ScanningHud />}

      <div className="absolute bottom-4 left-4 z-20 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full md-surface-container text-xs font-mono text-neutral-400">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        <span>ESRI WORLD IMAGERY</span>
      </div>
    </div>
  );
};

export default App;
