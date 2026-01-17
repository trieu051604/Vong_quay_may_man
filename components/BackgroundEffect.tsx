
import React from 'react';

const BackgroundEffect: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#020617]">
      {/* Digital Grid */}
      <div 
        className="absolute inset-0 opacity-[0.05]" 
        style={{ 
          backgroundImage: `
            linear-gradient(to right, #334155 1px, transparent 1px),
            linear-gradient(to bottom, #334155 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      ></div>
      
      {/* Tech Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[150px] rounded-full"></div>

      {/* Vertical Scanning Line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-500/5 shadow-[0_0_15px_rgba(6,182,212,0.5)] animate-[scan_8s_linear_infinite]"></div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { transform: translateY(-100px); }
          100% { transform: translateY(110vh); }
        }
      `}} />
    </div>
  );
};

export default BackgroundEffect;
