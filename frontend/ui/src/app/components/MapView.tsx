import React from 'react';
import { motion } from 'motion/react';
import { MapPin } from 'lucide-react';

interface Marker {
  id: number;
  name: string;
  score: number;
  x: number;
  y: number;
  status: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface MapViewProps {
  markers: Marker[];
  onMarkerClick: (id: number) => void;
  selectedId: number | null;
}

export const MapView: React.FC<MapViewProps> = ({ markers, onMarkerClick, selectedId }) => {
  return (
    <div className="relative w-full h-[600px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm">
      {/* Map Background - Manhattan style */}
      <div className="absolute inset-0 opacity-20 dark:opacity-30">
        <svg width="100%" height="100%" viewBox="0 0 800 600" fill="none" className="text-slate-400 dark:text-slate-300">
          {/* Streets */}
          <path d="M0 150L800 150" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M0 300L800 300" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M0 450L800 450" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M200 0L200 600" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M400 0L400 600" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M600 0L600 600" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
          
          {/* Water (Providence has rivers) */}
          <path d="M100 0 Q150 100 100 200 T100 400 T100 600" stroke="#3B82F6" strokeWidth="3" fill="none" opacity="0.2" />
        </svg>
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.05) 1px, transparent 0)', 
          backgroundSize: '24px 24px' 
        }} 
      />

      {/* Markers */}
      {markers.map((marker, index) => {
        const isSelected = selectedId === marker.id;
        const colors = {
          HIGH: { bg: 'bg-[#10B981]', border: 'border-[#10B981]', text: 'text-[#10B981]', glow: 'shadow-[#10B981]/30' },
          MEDIUM: { bg: 'bg-yellow-500', border: 'border-yellow-500', text: 'text-yellow-600', glow: 'shadow-yellow-500/30' },
          LOW: { bg: 'bg-orange-500', border: 'border-orange-500', text: 'text-orange-600', glow: 'shadow-orange-500/30' }
        };
        const color = colors[marker.status];

        return (
          <button
            key={marker.id}
            className="absolute z-20 group -translate-x-1/2 -translate-y-1/2 hover:scale-110 active:scale-95 transition-transform"
            style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
            onClick={() => onMarkerClick(marker.id)}
          >
            <div className="relative">
              {/* Pulse animation */}
              {!isSelected && (
                <div className={`absolute -inset-4 rounded-full ${color.bg} opacity-30 blur-md animate-pulse`} />
              )}
              
              {/* Marker */}
              <div className={`relative px-3 py-2 rounded-xl border-2 flex items-center gap-2 backdrop-blur-sm transition-all max-w-[200px] ${
                isSelected
                  ? `${color.bg} text-white border-white shadow-2xl ${color.glow} scale-110`
                  : `bg-white dark:bg-slate-800 ${color.border} ${color.text} shadow-lg hover:shadow-xl`
              }`}>
                <div className={`w-7 h-7 rounded-lg ${isSelected ? 'bg-white/20' : color.bg} flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}>
                  {index + 1}
                </div>
                <div className="flex flex-col items-start min-w-0 flex-1 overflow-hidden">
                  <span className="text-xs font-bold leading-none truncate w-full">{marker.name}</span>
                  <span className="text-[10px] font-medium opacity-80 whitespace-nowrap">{marker.score}/100</span>
                </div>
                <MapPin className={`w-3 h-3 flex-shrink-0 ${isSelected ? 'text-white' : color.text}`} />
              </div>
            </div>
          </button>
        );
      })}

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-30">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-slate-800/95 backdrop-blur-sm border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg shadow-lg flex items-center gap-4 flex-wrap"
        >
          <div className="flex items-center gap-2 whitespace-nowrap">
            <div className="w-3 h-3 rounded-full bg-[#10B981] flex-shrink-0" />
            <span className="text-xs font-medium text-slate-900 dark:text-slate-200">High Score</span>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <div className="w-3 h-3 rounded-full bg-yellow-500 flex-shrink-0" />
            <span className="text-xs font-medium text-slate-900 dark:text-slate-200">Medium</span>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <div className="w-3 h-3 rounded-full bg-orange-500 flex-shrink-0" />
            <span className="text-xs font-medium text-slate-900 dark:text-slate-200">Low</span>
          </div>
        </motion.div>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-30 bg-white dark:bg-slate-800/95 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-2 rounded-lg shadow-lg flex flex-col gap-2">
        <motion.button 
          onClick={() => console.log('Zoom in')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors text-slate-700 dark:text-slate-200 font-bold cursor-pointer"
        >
          +
        </motion.button>
        <motion.button 
          onClick={() => console.log('Zoom out')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors text-slate-700 dark:text-slate-200 font-bold cursor-pointer"
        >
          −
        </motion.button>
      </div>
    </div>
  );
};
