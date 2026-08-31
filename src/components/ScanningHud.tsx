import React from 'react';
import { Cpu, Crosshair, Binary, Activity } from 'lucide-react';

export const ScanningHud: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden animate-in fade-in duration-150">
      <div className="absolute inset-0 vit-micro-mesh opacity-70" />
      <div className="absolute inset-0 vit-patch-grid opacity-85" />
      <div className="absolute inset-0 vit-sector-grid opacity-60" />

      <div className="absolute top-20 left-24 text-[9px] font-mono text-cyan-400/80 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-400/30">
        [SEC_A-04]
      </div>
      <div className="absolute top-20 right-28 text-[9px] font-mono text-cyan-400/80 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-400/30">
        [SEC_B-12]
      </div>
      <div className="absolute bottom-24 left-24 text-[9px] font-mono text-cyan-400/80 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-400/30">
        [SEC_E-07]
      </div>
      <div className="absolute bottom-24 right-28 text-[9px] font-mono text-cyan-400/80 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-400/30">
        [SEC_F-19]
      </div>

      <div className="absolute inset-0 grid grid-cols-8 sm:grid-cols-16 grid-rows-8 sm:grid-rows-12 p-4 gap-3 opacity-95">
        <div
          className="col-start-3 col-span-4 row-start-4 row-span-3 rounded-lg border-2 border-cyan-400/80 bg-cyan-400/10 backdrop-blur-[1px] animate-patch-shimmer relative p-2 flex flex-col justify-between shadow-[0_0_25px_rgba(0,229,255,0.35)]"
          style={{ animationDelay: '0.1s' }}
        >
          <div className="flex items-center justify-between text-[8px] font-mono text-cyan-300">
            <span className="bg-cyan-500/30 px-1 py-0.5 rounded font-bold">AOI_PRIMARY // SCAN</span>
            <span>CONF: 0.94</span>
          </div>
          <div className="text-[9px] font-mono text-cyan-200 font-semibold tracking-wider self-center">
            [HIGH_DENSITY_CLUSTER]
          </div>
          <div className="flex items-center justify-between text-[7px] font-mono text-cyan-400/70">
            <span>X: 41.534°N</span>
            <span>Y: 93.663°W</span>
          </div>
        </div>

        <div
          className="col-start-11 col-span-3 row-start-2 row-span-2 rounded-md border-2 border-cyan-400 bg-cyan-400/20 animate-patch-shimmer relative p-1.5 flex flex-col justify-between shadow-[0_0_16px_rgba(0,229,255,0.4)]"
          style={{ animationDelay: '0.5s' }}
        >
          <div className="text-[8px] font-mono text-cyan-300 font-bold flex items-center justify-between">
            <span>TARGET_B</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-ping" />
          </div>
          <div className="text-[7px] font-mono text-cyan-300/80">SCORE: 0.91</div>
        </div>

        <div
          className="col-start-10 col-span-4 row-start-9 row-span-2 rounded-md border border-dashed border-cyan-300 bg-cyan-500/15 animate-patch-shimmer relative p-1.5 flex items-center justify-between shadow-[0_0_12px_rgba(0,229,255,0.3)]"
          style={{ animationDelay: '0.3s' }}
        >
          <span className="text-[8px] font-mono text-cyan-300 font-semibold">APRON_ZONE_03</span>
          <span className="text-[8px] font-mono text-cyan-400 bg-black/40 px-1 rounded">MATCH</span>
        </div>

        <div
          className="col-start-1 col-span-2 row-start-6 row-span-3 rounded-md border-2 border-cyan-400/90 bg-cyan-400/20 animate-patch-shimmer relative p-1 flex flex-col justify-between shadow-[0_0_14px_rgba(0,229,255,0.35)]"
          style={{ animationDelay: '0.7s' }}
        >
          <span className="text-[7px] font-mono text-cyan-300 font-bold">STRUCT_01</span>
          <span className="text-[7px] font-mono text-cyan-400/80 self-end">0.88</span>
        </div>

        <div
          className="col-start-2 col-span-2 row-start-2 row-span-2 rounded-md border border-cyan-400 bg-cyan-400/25 animate-patch-shimmer relative p-1 shadow-[0_0_10px_rgba(0,229,255,0.4)]"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="text-[7px] font-mono text-cyan-300">TGT_04</div>
        </div>

        <div
          className="col-start-8 col-span-1 row-start-2 row-span-1 rounded-sm border-2 border-cyan-300 bg-cyan-300/30 animate-patch-shimmer shadow-[0_0_8px_#00e5ff]"
          style={{ animationDelay: '0.4s' }}
        />
        <div
          className="col-start-15 col-span-1 row-start-4 row-span-1 rounded-sm border-2 border-cyan-300 bg-cyan-300/30 animate-patch-shimmer shadow-[0_0_8px_#00e5ff]"
          style={{ animationDelay: '0.8s' }}
        />
        <div
          className="col-start-8 col-span-1 row-start-8 row-span-1 rounded-sm border-2 border-cyan-300 bg-cyan-300/30 animate-patch-shimmer shadow-[0_0_8px_#00e5ff]"
          style={{ animationDelay: '0.15s' }}
        />
        <div
          className="col-start-2 col-span-1 row-start-10 row-span-1 rounded-sm border-2 border-cyan-300 bg-cyan-300/30 animate-patch-shimmer shadow-[0_0_8px_#00e5ff]"
          style={{ animationDelay: '0.65s' }}
        />
        <div
          className="col-start-7 col-span-2 row-start-10 row-span-2 rounded-md border-2 border-cyan-400 bg-cyan-400/20 animate-patch-shimmer p-1 shadow-[0_0_12px_rgba(0,229,255,0.35)]"
          style={{ animationDelay: '0.9s' }}
        >
          <span className="text-[7px] font-mono text-cyan-300">ZONE_08</span>
        </div>
        <div
          className="col-start-15 col-span-1 row-start-10 row-span-1 rounded-sm border-2 border-cyan-300 bg-cyan-300/30 animate-patch-shimmer shadow-[0_0_8px_#00e5ff]"
          style={{ animationDelay: '0.35s' }}
        />
      </div>

      <div className="absolute top-20 left-6 w-14 h-14 border-t-2 border-l-2 border-cyan-400 shadow-[0_0_12px_#00e5ff]" />
      <div className="absolute top-20 right-6 w-14 h-14 border-t-2 border-r-2 border-cyan-400 shadow-[0_0_12px_#00e5ff]" />
      <div className="absolute bottom-14 left-6 w-14 h-14 border-b-2 border-l-2 border-cyan-400 shadow-[0_0_12px_#00e5ff]" />
      <div className="absolute bottom-14 right-6 w-14 h-14 border-b-2 border-r-2 border-cyan-400 shadow-[0_0_12px_#00e5ff]" />

      <div className="absolute top-24 left-8 text-[10px] font-mono text-cyan-400/90 tracking-widest flex items-center gap-2">
        <Cpu className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
        <span>ViT_MATRIX // TOKENS: 1024 // DIMS: 768</span>
      </div>

      <div className="absolute top-24 right-8 text-[10px] font-mono text-cyan-400/90 tracking-widest hidden md:flex items-center gap-2">
        <Binary className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
        <span>CROSS_ATTN: ACTIVE // NMS: PASS</span>
      </div>

      <div className="absolute bottom-16 right-8 text-[10px] font-mono text-cyan-400/90 tracking-widest hidden sm:flex items-center gap-2">
        <Activity className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
        <span>NEURAL_RESOLVE // Q8_WASM // 60FPS</span>
      </div>

      <div className="absolute bottom-16 left-8 text-[10px] font-mono text-cyan-400/90 tracking-widest hidden sm:flex items-center gap-2">
        <Crosshair className="w-3.5 h-3.5 text-cyan-300 animate-spin" style={{ animationDuration: '6s' }} />
        <span>ALIGNMENT: OPTIMAL</span>
      </div>
    </div>
  );
};
