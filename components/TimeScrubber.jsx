import React from "react";

export default function TimeScrubber({ activeYear, onSetYear }) {
  const minYear = 2000;
  const maxYear = 2026;
  
  return (
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
      <div className="pointer-events-auto glass-strong rounded-2xl px-6 py-3 flex flex-col items-center gap-3 border-accent/20 w-[360px]">
        <div className="w-full flex justify-between items-end">
          <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Historical Playback</span>
          <span className="text-xl font-black text-accent bg-accent/10 px-3 py-0.5 rounded-lg border border-accent/20 shadow-glow">{activeYear}</span>
        </div>
        
        <div className="w-full flex items-center gap-4">
          <input 
            type="range"
            min={minYear}
            max={maxYear}
            value={activeYear}
            onChange={(e) => onSetYear(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-accent"
          />
        </div>
        <div className="w-full flex justify-between text-[10px] font-medium text-slate-500 font-mono">
          <span>{minYear}</span>
          <span>{maxYear}</span>
        </div>
      </div>
    </div>
  );
}
