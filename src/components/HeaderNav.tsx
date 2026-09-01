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
  <div className="pointer-events-auto h-11 sm:h-14 px-3 sm:px-4 md:px-5 rounded-full md-surface-container flex items-center gap-2 sm:gap-3 shrink-0 shadow-lg border border-white/5 backdrop-blur-md transition-all">
    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center shrink-0">
      <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-300" />
    </div>
    <div className="flex flex-col">
      <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-white uppercase font-mono">
        GeoLens<span className="hidden xs:inline text-cyan-400"> AI</span>
      </span>
      <span className="hidden md:inline text-[9px] sm:text-[10px] text-cyan-400 font-mono tracking-tight leading-tight">
        AI Viewport Scanner
      </span>
    </div>
  </div>
);

const TelemetryBadge: React.FC<{ coords: Coordinates }> = ({ coords }) => (
  <div className="pointer-events-auto hidden lg:flex items-center h-11 sm:h-14 px-3.5 sm:px-5 rounded-full md-surface-container text-[11px] sm:text-xs font-mono text-neutral-300 tracking-wide gap-2 sm:gap-3 shrink-0 shadow-lg border border-white/5 backdrop-blur-md">
    <span className="hidden xl:inline">
      {Math.abs(coords.lat).toFixed(4)}°{coords.lat >= 0 ? 'N' : 'S'},{' '}
      {Math.abs(coords.lng).toFixed(4)}°{coords.lng >= 0 ? 'E' : 'W'}
    </span>
    <span className="xl:hidden">
      {coords.lat.toFixed(2)}°, {coords.lng.toFixed(2)}°
    </span>
    <span className="w-1 h-1 rounded-full bg-neutral-500" />
    <span className="text-white font-medium">Z{coords.zoom.toFixed(1)}</span>
  </div>
);

const StatusBanner: React.FC<{ message: string; isScanning: boolean }> = ({
  message,
  isScanning,
}) => (
  <div className="pointer-events-auto self-center max-w-[95vw] sm:max-w-lg md:max-w-2xl px-3.5 sm:px-4 py-1.5 rounded-full md-surface-container-high border border-cyan-500/40 text-[11px] sm:text-xs font-mono text-cyan-300 flex items-center justify-center gap-2 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200 text-center">
    <span
      className={`w-2 h-2 rounded-full shrink-0 ${
        isScanning ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400'
      }`}
    />
    <span className="truncate sm:whitespace-normal">{message}</span>
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
    <header className="absolute top-2.5 sm:top-4 inset-x-2.5 sm:inset-x-4 z-30 flex flex-col gap-2 pointer-events-none pt-[env(safe-area-inset-top,0px)]">
      <div className="flex items-center justify-between gap-2 sm:gap-3 w-full">
        <BrandBadge />

        <div
          ref={searchRef}
          className="pointer-events-auto relative w-full max-w-2xl mx-auto flex flex-col items-center min-w-0"
        >
          <div className="w-full h-11 sm:h-14 px-1.5 sm:px-2.5 rounded-full md-surface-container hover:md-surface-container-high transition-colors flex items-center gap-1.5 sm:gap-2 shadow-xl border border-white/10 backdrop-blur-md">
            {/* Mode Switcher */}
            <div className="flex items-center bg-black/40 p-0.5 sm:p-1 rounded-full border border-white/5 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('scanner')}
                className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-medium transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer touch-manipulation ${
                  activeTab === 'scanner'
                    ? 'bg-cyan-500 text-black font-semibold shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="AI Viewport Scanner"
              >
                <Scan className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                <span className="hidden xs:inline">Scan</span>
                <span className="hidden sm:inline">AI</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('location')}
                className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-medium transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer touch-manipulation ${
                  activeTab === 'location'
                    ? 'bg-white/20 text-white font-semibold shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="Fly to Location"
              >
                <Compass className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                <span className="hidden xs:inline">Fly</span>
                <span className="hidden sm:inline">To</span>
              </button>
            </div>

            {/* Input Form & Buttons */}
            {activeTab === 'scanner' ? (
              <div className="flex items-center w-full gap-1.5 sm:gap-2 pl-1 sm:pl-2 min-w-0">
                <input
                  ref={inputRef}
                  type="text"
                  value={scanQuery}
                  onChange={(e) => setScanQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleTriggerScan()}
                  placeholder="Target (e.g. airplane, ship)..."
                  className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-neutral-400 focus:outline-none font-sans min-w-0"
                  disabled={isScanning}
                />

                <button
                  type="button"
                  onClick={() => handleTriggerScan()}
                  disabled={isScanning || !scanQuery.trim()}
                  className="h-8 sm:h-10 px-3 sm:px-4 md:px-5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-black font-semibold text-[11px] sm:text-xs font-mono tracking-wide flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg transition-all active:scale-95 shrink-0 cursor-pointer touch-manipulation"
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin shrink-0" />
                      <span className="hidden md:inline">Scanning...</span>
                    </>
                  ) : (
                    <>
                      <Scan className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                      <span className="hidden md:inline">Scan Viewport</span>
                      <span className="md:hidden">Scan</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="flex items-center w-full gap-1.5 sm:gap-2 pl-1 sm:pl-2 min-w-0">
                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-400 shrink-0" />
                <input
                  type="text"
                  value={geoQuery}
                  onChange={(e) => setGeoQuery(e.target.value)}
                  onFocus={() => geoQuery.length >= 2 && setIsGeoOpen(true)}
                  placeholder="City, airport, or coords..."
                  className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-neutral-400 focus:outline-none font-sans min-w-0"
                />
                {geoLoading && (
                  <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-400 animate-spin shrink-0" />
                )}
                {geoQuery.length > 0 && (
                  <button
                    type="button"
                    onClick={clearGeo}
                    className="w-6 h-6 rounded-full hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white cursor-pointer shrink-0 touch-manipulation"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>


          {/* Location Autocomplete Dropdown */}
          {activeTab === 'location' && isGeoOpen && geoResults.length > 0 && (
            <div className="absolute top-13 sm:top-16 inset-x-0 rounded-2xl md-surface-container-high overflow-hidden z-50 p-1.5 sm:p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150 border border-white/10 shadow-2xl max-h-[60vh] sm:max-h-80 overflow-y-auto backdrop-blur-xl">
              {geoResults.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleGeoSelect(r)}
                  className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors flex items-start gap-2.5 sm:gap-3.5 group cursor-pointer touch-manipulation"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-white/10 transition-colors">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-300 group-hover:text-white" />
                  </div>
                  <div className="truncate flex-1 min-w-0">
                    <div className="text-xs sm:text-sm font-medium text-white truncate">{r.name}</div>
                    {r.country && (
                      <div className="text-[10px] sm:text-xs text-neutral-400 truncate">{r.country}</div>
                    )}
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
