
import React from 'react';
import { Participant } from '../types';
import { X, ShieldCheck, Zap } from 'lucide-react';

interface WinnerBannerProps {
  winner: Participant;
  onClose: () => void;
}

const WinnerBanner: React.FC<WinnerBannerProps> = ({ winner, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="relative bg-slate-900 border border-cyan-500/30 p-12 rounded-2xl shadow-[0_0_100px_rgba(6,182,212,0.2)] text-center animate-in zoom-in duration-500 max-w-2xl w-full overflow-hidden">
        
        {/* Decorative Tech BG */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/micro-carbon.png')` }}></div>

        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-slate-500 hover:text-cyan-400 transition-colors pointer-events-auto"
        >
          <X size={24} />
        </button>

        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500 blur-2xl opacity-20 animate-pulse"></div>
            <ShieldCheck size={64} className="text-cyan-400 relative z-10" />
          </div>
        </div>
        
        <div className="font-mono text-cyan-500 text-xs tracking-[0.4em] mb-4 uppercase">Target Identified</div>
        
        <div className="space-y-4 mb-10">
          <h2 className="text-6xl font-lucky font-black text-white leading-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            {winner.name.toUpperCase()}
          </h2>
          
          <div className="flex items-center justify-center gap-6 mt-10">
            <div className="group relative">
               <div className="absolute -inset-1 bg-cyan-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
               <div className="relative px-10 py-4 bg-black rounded-lg border border-cyan-500/50 flex flex-col items-center">
                 <span className="text-[10px] font-mono text-cyan-600 mb-1">MÃ DỰ THƯỞNG</span>
                 <span className="text-4xl font-lucky font-black text-cyan-400 tracking-wider">#{winner.id}</span>
               </div>
            </div>

            <div className="px-8 py-4 bg-slate-800/50 rounded-lg border border-white/5 flex flex-col items-center">
               <span className="text-[10px] font-mono text-slate-500 mb-1">TRƯỜNG</span>
               <span className="text-xl font-bold text-slate-300">{winner.team}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-12 flex justify-center">
          <button
            onClick={onClose}
            className="group relative px-16 py-4 bg-cyan-500 text-black font-black rounded-sm hover:bg-cyan-400 transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)] overflow-hidden"
          >
            <div href="/" className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover:left-[100%] transition-all duration-700 ease-in-out"></div>
            XÁC NHẬN KẾT QUẢ
          </button>
        </div>
        
        <div className="mt-8 flex items-center justify-center gap-2 text-slate-600 font-mono text-[10px] uppercase tracking-tighter">
          <Zap size={10}/> Data_Entry_Logged_Successfully
        </div>
      </div>
    </div>
  );
};

export default WinnerBanner;
