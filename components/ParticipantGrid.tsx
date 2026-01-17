
import React from 'react';
import { Participant } from '../types';

interface ParticipantGridProps {
  participants: Participant[];
  highlightedIndex: number | null;
  isSpinning: boolean;
}

const ParticipantGrid: React.FC<ParticipantGridProps> = ({ participants, highlightedIndex, isSpinning }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
      {participants.map((p, idx) => {
        const isHighlighted = highlightedIndex === idx;
        const hasWon = p.hasWon;

        return (
          <div
            key={p.id}
            className={`
              relative p-2 rounded-lg border flex flex-col items-center justify-center text-center transition-all duration-150
              aspect-square h-20 w-full overflow-hidden
              ${isHighlighted 
                ? 'bg-orange-500 border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.8)] scale-110 z-20' 
                : hasWon
                  ? 'bg-slate-900 border-slate-800 opacity-40 grayscale'
                  : 'bg-teal-900/20 border-teal-800/50 hover:border-teal-400/50'}
            `}
          >
            <span className={`text-[10px] font-bold uppercase truncate w-full ${isHighlighted ? 'text-white' : 'text-slate-400'}`}>
              {p.team}
            </span>
            <span className={`text-xs font-semibold leading-tight line-clamp-2 ${isHighlighted ? 'text-white' : 'text-slate-200'}`}>
              {p.name}
            </span>
            
            {hasWon && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <span className="text-[10px] font-bold bg-red-600 text-white px-1 rounded transform -rotate-12">ĐÃ TRÚNG</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ParticipantGrid;
