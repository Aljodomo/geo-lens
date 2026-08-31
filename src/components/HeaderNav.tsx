import React, { useState, useRef } from 'react';
import { Search, MapPin, Loader2, X, Sparkles, Scan, Compass } from 'lucide-react';
import { useGeocoding } from '../hooks/useGeocoding';
import type { Coordinates, GeocodeResult } from '../types';

interface HeaderNavProps {
  onLocationSelect: (lat: number, lng: number, zoom?: number) => void;
  onScanViewport: (query: string) => Promise<void>;
  currentCenter: Coordinates;
  isScanning: boolean;
  scanStatus: string | null;
}

const BrandBadge: React.FC = () => (
  <div className="pointer-events-auto h-14 px-5 rounded-full md-surface-container flex items-center gap-3 shrink-0 shadow-lg border border-white/5">
    <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center">
      <Sparkles className="w-4 h-4 text-cyan-300" />
    </div>
    <div className="flex flex-col">
      <span className="text-xs font-semibold tracking-wider text-white uppercase font-mono">
        GeoLens AI
      </span>
      <span className="text-[10px] text-cyan-400 font-mono tracking-tight">
        AI Viewport Scanner
      </span>
    </div>
  </div>
);

const TelemetryBadge: React.FC<{ coords: Coordinates }> = ({ coords }) => (
  <div className="pointer-events-auto hidden xl:flex items-center h-14 px-5 rounded-full md-surface-container text-xs font-mono text-neutral-300 tracking-wide gap-3 shrink-0 shadow-lg border border-white/5">
    <span>
      {Math.abs(coords.lat).toFixed(4)}°{coords.lat >= 0 ? 'N' : 'S'},{' '}
      {Math.abs(coords.lng).toFixed(4)}°{coords.lng >= 0 ? 'E' : 'W'}
    </span>
    <span className="w-1 h-1 rounded-full bg-neutral-500" />
    <span className="text-white font-medium">Zoom {coords.zoom.toFixed(1)}</span>
  </div>
);

const StatusBanner: React.FC<{ message: string; isScanning: boolean }> = ({
  message,
  isScanning,
}) => (
  <div className="pointer-events-auto self-center mt-1 px-4 py-1.5 rounded-full md-surface-container-high border border-cyan-500/40 text-xs font-mono text-cyan-300 flex items-center gap-2 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
    <span className={`w-2 h-2 rounded-full ${isScanning ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400'}`} />
    <span>{message}</span>
  </div>
);

export const HeaderNav: React.FC<HeaderNavProps> = ({
  onLocationSelect,
  onScanViewport,
  currentCenter,
  isScanning,
  scanStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'scanner' | 'location'>('scanner');
  const [scanQuery, setScanQuery] = useState('airplane');
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    query: geoQuery,
    setQuery: setGeoQuery,
    results: geoResults,
    isLoading: geoLoading,
    isOpen: isGeoOpen,
    setIsOpen: setIsGeoOpen,
    containerRef: searchRef,
    clear: clearGeo,
  } = useGeocoding({ enabled: activeTab === 'location' });

  const handleGeoSelect = (item: GeocodeResult) => {
    onLocationSelect(item.lat, item.lng, 15);
    setGeoQuery(item.name);
    setIsGeoOpen(false);
  };

  const handleTriggerScan = (queryToScan = scanQuery) => {
    const trimmed = queryToScan.trim();
    if (!trimmed || isScanning) return;
    onScanViewport(trimmed);
  };

  return (
    <header className="absolute top-4 inset-x-4 z-30 flex flex-col gap-2 pointer-events-none">
      <div className="flex items-center justify-between gap-3 w-full">
        <BrandBadge />

        <div ref={searchRef} className="pointer-events-auto relative w-full max-w-2xl mx-auto flex flex-col items-center">
          <div className="w-full h-14 px-2.5 rounded-full md-surface-container hover:md-surface-container-high transition-colors flex items-center gap-2 shadow-xl border border-white/10">
            <div className="flex items-center bg-black/30 p-1 rounded-full border border-white/5 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('scanner')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'scanner'
                    ? 'bg-cyan-500 text-black font-semibold shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Scan className="w-3.5 h-3.5" />
                <span>AI Scan</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('location')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'location'
                    ? 'bg-white/20 text-white font-semibold shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Fly To</span>
              </button>
            </div>

            {activeTab === 'scanner' ? (
              <div className="flex items-center w-full gap-2 pl-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={scanQuery}
                  onChange={(e) => setScanQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleTriggerScan()}
                  placeholder="Type any target to locate (e.g. airplane, swimming pool, solar panel)..."
                  className="w-full bg-transparent text-sm text-white placeholder-neutral-400 focus:outline-none font-sans"
                  disabled={isScanning}
                />

                <button
                  type="button"
                  onClick={() => handleTriggerScan()}
                  disabled={isScanning || !scanQuery.trim()}
                  className="h-10 px-5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-black font-semibold text-xs font-mono tracking-wide flex items-center gap-2 shadow-lg transition-all active:scale-95 shrink-0 cursor-pointer"
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Scanning...</span>
                    </>
                  ) : (
                    <>
                      <Scan className="w-3.5 h-3.5" />
                      <span>Scan Viewport</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="flex items-center w-full gap-2 pl-2">
                <Search className="w-4 h-4 text-neutral-400 shrink-0" />
                <input
                  type="text"
                  value={geoQuery}
                  onChange={(e) => setGeoQuery(e.target.value)}
                  onFocus={() => geoQuery.length >= 2 && setIsGeoOpen(true)}
                  placeholder="Fly to city, airport, or coordinates (e.g. Zurich, JFK Airport)..."
                  className="w-full bg-transparent text-sm text-white placeholder-neutral-400 focus:outline-none font-sans"
                />
                {geoLoading && <Loader2 className="w-4 h-4 text-neutral-400 animate-spin shrink-0" />}
                {geoQuery.length > 0 && (
                  <button
                    type="button"
                    onClick={clearGeo}
                    className="w-6 h-6 rounded-full hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>

          {activeTab === 'location' && isGeoOpen && geoResults.length > 0 && (
            <div className="absolute top-16 inset-x-0 rounded-2xl md-surface-container-high overflow-hidden z-50 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150 border border-white/10 shadow-2xl">
              {geoResults.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleGeoSelect(r)}
                  className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors flex items-start gap-3.5 group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-white/10 transition-colors">
                    <MapPin className="w-4 h-4 text-neutral-300 group-hover:text-white" />
                  </div>
                  <div className="truncate">
                    <div className="text-sm font-medium text-white truncate">{r.name}</div>
                    {r.country && <div className="text-xs text-neutral-400">{r.country}</div>}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <TelemetryBadge coords={currentCenter} />
      </div>

      {scanStatus && <StatusBanner message={scanStatus} isScanning={isScanning} />}
    </header>
  );
};
