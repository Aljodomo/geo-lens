import React from 'react';
import { Cpu, Crosshair, Binary, Activity } from 'lucide-react';

export const ScanningHud: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden animate-in fade-in duration-150">
      {/* Dynamic Background Grids */}
      <div className="absolute inset-0 vit-micro-mesh opacity-60 sm:opacity-70" />
      <div className="absolute inset-0 vit-patch-grid opacity-75 sm:opacity-85" />
      <div className="absolute inset-0 vit-sector-grid opacity-50 sm:opacity-60" />

      {/* Sector Indicators */}
      <div className="absolute top-24 sm:top-28 md:top-24 left-6 sm:left-20 md:left-24 text-[8px] sm:text-[9px] font-mono text-cyan-400/80 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-400/30 backdrop-blur-xs">
        [SEC_A-04]
      </div>
      <div className="absolute top-24 sm:top-28 md:top-24 right-6 sm:right-20 md:right-28 text-[8px] sm:text-[9px] font-mono text-cyan-400/80 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-400/30 backdrop-blur-xs">
        [SEC_B-12]
      </div>
      <div className="absolute bottom-20 sm:bottom-24 left-6 sm:left-20 md:left-24 text-[8px] sm:text-[9px] font-mono text-cyan-400/80 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-400/30 backdrop-blur-xs">
        [SEC_E-07]
      </div>
      <div className="absolute bottom-20 sm:bottom-24 right-6 sm:right-20 md:right-28 text-[8px] sm:text-[9px] font-mono text-cyan-400/80 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-400/30 backdrop-blur-xs">
        [SEC_F-19]
      </div>

      {/* Responsive Neural Detection Grid Simulation */}
      <div className="absolute inset-0 grid grid-cols-8 sm:grid-cols-12 md:grid-cols-16 grid-rows-8 sm:grid-rows-12 p-3 sm:p-4 gap-2 sm:gap-3 opacity-95">
        {/* Primary AOI Cluster */}
        <div
          className="col-start-2 sm:col-start-3 md:col-start-3 col-span-6 sm:col-span-6 md:col-span-4 row-start-4 row-span-3 rounded-lg border-2 border-cyan-400/80 bg-cyan-400/10 backdrop-blur-[1px] animate-patch-shimmer relative p-2 flex flex-col justify-between shadow-[0_0_25px_rgba(0,229,255,0.35)]"
          style={{ animationDelay: '0.1s' }}
        >
          <div className="flex items-center justify-between text-[7px] sm:text-[8px] font-mono text-cyan-300">
            <span className="bg-cyan-500/30 px-1 py-0.5 rounded font-bold truncate">AOI_PRIMARY // SCAN</span>
            <span className="shrink-0">CONF: 0.94</span>
          </div>
          <div className="text-[8px] sm:text-[9px] font-mono text-cyan-200 font-semibold tracking-wider self-center text-center">
            [HIGH_DENSITY_CLUSTER]
          </div>
          <div className="flex items-center justify-between text-[6px] sm:text-[7px] font-mono text-cyan-400/70">
            <span>X: 41.534°N</span>
            <span>Y: 93.663°W</span>
          </div>
        </div>

        {/* Target B */}
        <div
          className="col-start-5 sm:col-start-8 md:col-start-11 col-span-3 sm:col-span-3 md:col-span-3 row-start-2 row-span-2 rounded-md border-2 border-cyan-400 bg-cyan-400/20 animate-patch-shimmer relative p-1 sm:p-1.5 flex flex-col justify-between shadow-[0_0_16px_rgba(0,229,255,0.4)]"
          style={{ animationDelay: '0.5s' }}
        >
          <div className="text-[7px] sm:text-[8px] font-mono text-cyan-300 font-bold flex items-center justify-between">
            <span>TARGET_B</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-ping" />
          </div>
          <div className="text-[6px] sm:text-[7px] font-mono text-cyan-300/80">SCORE: 0.91</div>
        </div>

        {/* Apron Zone */}
        <div
          className="col-start-4 sm:col-start-7 md:col-start-10 col-span-4 sm:col-span-4 md:col-span-4 row-start-8 sm:row-start-9 row-span-2 rounded-md border border-dashed border-cyan-300 bg-cyan-500/15 animate-patch-shimmer relative p-1 sm:p-1.5 flex items-center justify-between shadow-[0_0_12px_rgba(0,229,255,0.3)]"
          style={{ animationDelay: '0.3s' }}
        >
          <span className="text-[7px] sm:text-[8px] font-mono text-cyan-300 font-semibold truncate">APRON_ZONE_03</span>
          <span className="text-[7px] sm:text-[8px] font-mono text-cyan-400 bg-black/40 px-1 rounded shrink-0">MATCH</span>
        </div>

        {/* Structure 01 */}
        <div
          className="col-start-1 col-span-2 sm:col-span-2 row-start-6 row-span-2 sm:row-span-3 rounded-md border-2 border-cyan-400/90 bg-cyan-400/20 animate-patch-shimmer relative p-1 flex flex-col justify-between shadow-[0_0_14px_rgba(0,229,255,0.35)]"
          style={{ animationDelay: '0.7s' }}
        >
          <span className="text-[6px] sm:text-[7px] font-mono text-cyan-300 font-bold">STRUCT_01</span>
          <span className="text-[6px] sm:text-[7px] font-mono text-cyan-400/80 self-end">0.88</span>
        </div>

        {/* Target 04 */}
        <div
          className="col-start-2 col-span-2 row-start-2 row-span-2 rounded-md border border-cyan-400 bg-cyan-400/25 animate-patch-shimmer relative p-1 shadow-[0_0_10px_rgba(0,229,255,0.4)]"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="text-[6px] sm:text-[7px] font-mono text-cyan-300">TGT_04</div>
        </div>

        {/* Shimmer Pointers */}
        <div
          className="hidden sm:block col-start-8 col-span-1 row-start-2 row-span-1 rounded-sm border-2 border-cyan-300 bg-cyan-300/30 animate-patch-shimmer shadow-[0_0_8px_#00e5ff]"
          style={{ animationDelay: '0.4s' }}
        />
        <div
          className="hidden md:block col-start-15 col-span-1 row-start-4 row-span-1 rounded-sm border-2 border-cyan-300 bg-cyan-300/30 animate-patch-shimmer shadow-[0_0_8px_#00e5ff]"
          style={{ animationDelay: '0.8s' }}
        />
        <div
          className="hidden sm:block col-start-6 md:col-start-8 col-span-1 row-start-7 sm:row-start-8 row-span-1 rounded-sm border-2 border-cyan-300 bg-cyan-300/30 animate-patch-shimmer shadow-[0_0_8px_#00e5ff]"
          style={{ animationDelay: '0.15s' }}
        />
      </div>

      {/* Sci-Fi Corner Brackets */}
      <div className="absolute top-20 sm:top-24 left-2 sm:left-6 w-8 sm:w-12 md:w-14 h-8 sm:h-12 md:h-14 border-t-2 border-l-2 border-cyan-400 shadow-[0_0_12px_#00e5ff]" />
      <div className="absolute top-20 sm:top-24 right-2 sm:right-6 w-8 sm:w-12 md:w-14 h-8 sm:h-12 md:h-14 border-t-2 border-r-2 border-cyan-400 shadow-[0_0_12px_#00e5ff]" />
      <div className="absolute bottom-16 sm:bottom-14 left-2 sm:left-6 w-8 sm:w-12 md:w-14 h-8 sm:h-12 md:h-14 border-b-2 border-l-2 border-cyan-400 shadow-[0_0_12px_#00e5ff]" />
      <div className="absolute bottom-16 sm:bottom-14 right-2 sm:right-6 w-8 sm:w-12 md:w-14 h-8 sm:h-12 md:h-14 border-b-2 border-r-2 border-cyan-400 shadow-[0_0_12px_#00e5ff]" />

      {/* Telemetry Strings */}
      <div className="absolute top-28 sm:top-32 md:top-28 left-4 sm:left-8 text-[8px] sm:text-[10px] font-mono text-cyan-400/90 tracking-widest flex items-center gap-1.5 sm:gap-2">
        <Cpu className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-300 animate-pulse shrink-0" />
        <span className="truncate">ViT_MATRIX // DIMS: 768</span>
      </div>

      <div className="absolute top-28 left-auto right-4 sm:right-8 text-[8px] sm:text-[10px] font-mono text-cyan-400/90 tracking-widest hidden md:flex items-center gap-2">
        <Binary className="w-3.5 h-3.5 text-cyan-300 animate-pulse shrink-0" />
        <span>CROSS_ATTN: ACTIVE</span>
      </div>

      <div className="absolute bottom-20 sm:bottom-16 right-4 sm:right-8 text-[8px] sm:text-[10px] font-mono text-cyan-400/90 tracking-widest hidden sm:flex items-center gap-2">
        <Activity className="w-3.5 h-3.5 text-cyan-300 animate-pulse shrink-0" />
        <span>NEURAL_RESOLVE // Q8</span>
      </div>

      <div className="absolute bottom-20 sm:bottom-16 left-4 sm:left-8 text-[8px] sm:text-[10px] font-mono text-cyan-400/90 tracking-widest hidden md:flex items-center gap-2">
        <Crosshair className="w-3.5 h-3.5 text-cyan-300 animate-spin shrink-0" style={{ animationDuration: '6s' }} />
        <span>ALIGNMENT: OPTIMAL</span>
      </div>
    </div>
  );
};
