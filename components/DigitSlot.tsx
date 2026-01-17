
import React, { useState, useEffect, useRef } from 'react';

interface DigitSlotProps {
  targetChar: string;
  isSpinning: boolean;
  delay: number;
  onTick: () => void;
}

const DigitSlot: React.FC<DigitSlotProps> = ({ targetChar, isSpinning, delay, onTick }) => {
  const [isDone, setIsDone] = useState(false);
  const [offset, setOffset] = useState(0);
  const [blur, setBlur] = useState(0);
  
  const charList = "0123456789".split("");
  const fullList = [...charList, ...charList, ...charList, ...charList];
  
  const animationRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);

  const CHAR_HEIGHT = 120; 

  useEffect(() => {
    if (isSpinning) {
      setIsDone(false);
      setBlur(6);
      startInfiniteSpin();
    } else {
      const timer = setTimeout(() => {
        stopAtTarget();
      }, delay);
      return () => clearTimeout(timer);
    }
    
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isSpinning, delay, targetChar]);

  const startInfiniteSpin = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    
    let currentPos = offset;
    const speed = 55; 

    const animate = (time: number) => {
      currentPos -= speed;
      const limit = charList.length * CHAR_HEIGHT;
      if (Math.abs(currentPos) >= limit) {
        currentPos += limit;
      }
      setOffset(currentPos);
      if (time - lastTickRef.current > 50) {
        onTick();
        lastTickRef.current = time;
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
  };

  const stopAtTarget = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    
    let targetIdx = charList.indexOf(targetChar);
    if (targetIdx === -1) targetIdx = 0;
    const finalTargetPos = -(charList.length + targetIdx) * CHAR_HEIGHT;
    
    let currentPos = offset;
    let velocity = 45;
    const friction = 0.96; 

    const animateStop = () => {
      velocity *= friction;
      currentPos -= velocity;
      setBlur(Math.max(0, velocity / 15));

      if (velocity < 0.6) {
        setOffset(finalTargetPos);
        setBlur(0);
        setIsDone(true);
        onTick();
        return;
      }
      setOffset(currentPos);
      if (Math.abs(currentPos % CHAR_HEIGHT) < velocity) {
        onTick();
      }
      animationRef.current = requestAnimationFrame(animateStop);
    };
    animationRef.current = requestAnimationFrame(animateStop);
  };

  return (
    <div 
      className={`
        relative w-24 h-[120px] bg-black rounded-lg overflow-hidden transition-all duration-500
        border border-white/5
        ${isDone ? 'ring-2 ring-cyan-500 shadow-[0_0_25px_rgba(6,182,212,0.4)] scale-105' : 'shadow-[inset_0_4px_20px_rgba(0,0,0,0.8)]'}
      `}
    >
      <div 
        className="absolute top-0 left-0 w-full"
        style={{ 
          transform: `translateY(${offset}px)`,
          filter: `blur(${blur}px)`,
          willChange: 'transform, filter'
        }}
      >
        {fullList.map((char, i) => (
          <div 
            key={i} 
            className={`w-full flex items-center justify-center text-7xl font-lucky font-black select-none ${isDone ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]' : 'text-slate-200'}`}
            style={{ 
              height: `${CHAR_HEIGHT}px`, 
              minHeight: `${CHAR_HEIGHT}px`,
              lineHeight: 1
            }}
          >
            {char}
          </div>
        ))}
      </div>
      
      {/* Tech Overlays */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black via-transparent to-black opacity-80"></div>
      <div className="absolute top-0 left-0 w-full h-[1px] bg-white/10"></div>
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/10"></div>
    </div>
  );
};

export default DigitSlot;
