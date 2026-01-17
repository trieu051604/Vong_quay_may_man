
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Settings, Volume2, VolumeX, RefreshCw, RotateCcw, Cpu, Scan, Info, Lock, Unlock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Participant, Prize, AppSettings } from './types';
import BackgroundEffect from './components/BackgroundEffect';
import DigitSlot from './components/DigitSlot';
import WinnerBanner from './components/WinnerBanner';
import AdminPanel from './components/AdminPanel';
import { fetchParticipants, fetchPrizes, fetchResults, saveResultToSheet } from './services/apiService';

const App: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [targetDigits, setTargetDigits] = useState<string[]>([]);
  const [currentWinner, setCurrentWinner] = useState<Participant | null>(null);
  const [showWinnerBanner, setShowWinnerBanner] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);

  const DEFAULT_API_URL = "https://script.google.com/macros/s/AKfycbyJYyoHK-PeoK2CRJ6tr2z6BUkSA9XnD30BgtQa8v3C9otLeeA0-SIwkEhOvGm7C-Dn/exec";

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('lucky_draw_settings');
    const parsed = saved ? JSON.parse(saved) : null;
    return {
      apiBaseUrl: parsed?.apiBaseUrl || DEFAULT_API_URL,
      allowMultipleWins: parsed?.allowMultipleWins ?? false
    };
  });

  const tickAudio = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'));
  const winAudio = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3'));
  const spinAudio = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2014/2014-preview.mp3'));

  useEffect(() => {
    const unlockAudio = () => {
      if (isAudioUnlocked) return;
      [tickAudio.current, winAudio.current, spinAudio.current].forEach(a => {
        a.play().then(() => { a.pause(); a.currentTime = 0; }).catch(() => {});
      });
      setIsAudioUnlocked(true);
    };
    window.addEventListener('click', unlockAudio);
    return () => window.removeEventListener('click', unlockAudio);
  }, [isAudioUnlocked]);

  const loadData = useCallback(async () => {
    if (!settings.apiBaseUrl) return;
    setIsLoading(true);
    try {
      const [pData, rData] = await Promise.all([
        fetchParticipants(settings.apiBaseUrl),
        fetchResults(settings.apiBaseUrl)
      ]);
      
      // Chuyển tất cả ID thắng cuộc thành chuỗi để so sánh chính xác
      const wonIds = rData.map(r => String(r.participantId).trim());
      
      const updatedParticipants = pData.map(p => ({
        ...p,
        hasWon: wonIds.includes(String(p.id).trim())
      }));
      
      setParticipants(updatedParticipants);
      
      const maxIdLen = pData.length > 0 ? pData.reduce((max, p) => Math.max(max, String(p.id).length), 6) : 6;
      if (targetDigits.length === 0) {
        setTargetDigits(Array(maxIdLen).fill('0'));
      }
    } catch (error) { console.error("Error loading data:", error); } finally { setIsLoading(false); }
  }, [settings.apiBaseUrl]);

  useEffect(() => { loadData(); }, [loadData]);

  // LOGIC QUAN TRỌNG: Ngăn chặn trúng giải lần 2
  const eligibleParticipants = useMemo(() => 
    participants.filter(p => {
      const isEligible = String(p.eligible).toLowerCase() === 'true';
      const winCondition = settings.allowMultipleWins || !p.hasWon;
      return isEligible && winCondition;
    }),
    [participants, settings.allowMultipleWins]
  );

  const isButtonEnabled = useMemo(() => 
    !isSpinning && !isSaving && !!settings.apiBaseUrl && 
    eligibleParticipants.length > 0,
    [isSpinning, isSaving, settings.apiBaseUrl, eligibleParticipants]
  );

  const startSpin = () => {
    if (!isButtonEnabled) return;
    setShowWinnerBanner(false);
    
    const winner = eligibleParticipants[Math.floor(Math.random() * eligibleParticipants.length)];
    setCurrentWinner(winner);

    const winnerIdStr = String(winner.id).padStart(targetDigits.length, '0');
    setTargetDigits(winnerIdStr.split(''));

    if (isSoundOn) { spinAudio.current.currentTime = 0; spinAudio.current.play().catch(() => {}); }
    setIsSpinning(true);

    setTimeout(() => {
      setIsSpinning(false); 
      const stopInterval = 400; 
      const totalAnimationTime = targetDigits.length * stopInterval + 2000;
      setTimeout(() => handleFinishSpin(winner), totalAnimationTime);
    }, 2500); 
  };

  const handleFinishSpin = async (winner: Participant) => {
    if (isSoundOn) { spinAudio.current.pause(); winAudio.current.play().catch(() => {}); }
    confetti({ 
      particleCount: 150, 
      spread: 70, 
      origin: { y: 0.6 }, 
      colors: ['#06b6d4', '#3b82f6', '#f59e0b', '#ffffff'] 
    });
    setShowWinnerBanner(true);

    setIsSaving(true);
    try {
      await saveResultToSheet(settings.apiBaseUrl, {
        prizeId: 'TECH_DRAW',
        prizeName: 'Vòng quay công nghệ',
        participantId: winner.id,
        name: winner.name,
        team: winner.team,
        time: new Date().toISOString()
      });
      // Tải lại dữ liệu ngay lập tức để cập nhật trạng thái 'đã trúng'
      await loadData();
    } catch (e) { console.error("Error saving result:", e); } finally { setIsSaving(false); }
  };

  const playTick = () => {
    if (isSoundOn) {
      const t = tickAudio.current.cloneNode() as HTMLAudioElement;
      t.volume = 0.1;
      t.play().catch(() => {});
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden flex flex-col bg-[#020617] text-slate-200">
      <BackgroundEffect />

      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-6">
        {/* Header Tech Style */}
        <header className="absolute top-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Scan className="text-cyan-400 animate-pulse" size={20} />
            <span className="text-cyan-400 font-mono tracking-[0.5em] text-[10px] font-bold">SYSTEM SCANNING</span>
          </div>
          <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 uppercase tracking-[0.2em] drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
             LUCKY DRAW CORE
          </h2>
          
          <div className="mt-4 flex items-center justify-center gap-6 text-slate-500 font-mono text-[10px]">
            <span className="flex items-center gap-1.5"><Cpu size={12}/> DB: ONLINE</span>
            <span className="flex items-center gap-1.5"><Info size={12}/> ACTIVE_POOL: {eligibleParticipants.length}</span>
            
            {/* Winner Lock Status Indicator */}
            <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded border ${!settings.allowMultipleWins ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5' : 'text-amber-400 border-amber-500/30 bg-amber-500/5'}`}>
              {!settings.allowMultipleWins ? <Lock size={10}/> : <Unlock size={10}/>}
              {!settings.allowMultipleWins ? 'UNIQUE_WINNER: ON' : 'MULTI_WINNER: ON'}
            </span>
          </div>
        </header>

        {/* Slot Machine Display */}
        <div className="relative group">
          <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-cyan-500/50"></div>
          <div className="absolute -top-4 -right-4 w-12 h-12 border-t-2 border-r-2 border-cyan-500/50"></div>
          <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-2 border-l-2 border-cyan-500/50"></div>
          <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-cyan-500/50"></div>

          <div className="bg-slate-950/40 backdrop-blur-2xl p-10 rounded-2xl shadow-[0_0_80px_rgba(6,182,212,0.15)] border border-white/5 ring-1 ring-white/10">
            <div className="flex gap-4 items-center justify-center">
              {targetDigits.map((char, idx) => (
                <DigitSlot 
                  key={`${idx}-${isSpinning}`}
                  targetChar={char}
                  isSpinning={isSpinning}
                  delay={idx * 300} 
                  onTick={playTick}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Control Button */}
        <div className="mt-20 flex flex-col items-center gap-8">
          {!showWinnerBanner && (
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={startSpin}
                disabled={!isButtonEnabled}
                className={`
                  group relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500
                  ${!isButtonEnabled 
                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-50' 
                    : 'bg-transparent text-cyan-400 hover:scale-110 active:scale-95'}
                `}
              >
                <div className={`absolute inset-0 rounded-full border-2 ${isButtonEnabled ? 'border-cyan-500/50 group-hover:border-cyan-400 animate-[spin_4s_linear_infinite]' : 'border-slate-700'}`}></div>
                <div className={`absolute inset-2 rounded-full border border-dashed ${isButtonEnabled ? 'border-cyan-500/30 group-hover:border-cyan-400 animate-[spin_8s_linear_infinite_reverse]' : 'border-slate-700'}`}></div>
                <span className="font-mono font-black text-xl tracking-tighter">
                  {isSpinning || isSaving ? '...' : 'INIT'}
                </span>
              </button>
              {!isButtonEnabled && eligibleParticipants.length === 0 && participants.length > 0 && (
                <p className="text-amber-500 font-mono text-[10px] uppercase animate-pulse">All participants have won</p>
              )}
            </div>
          )}

          {showWinnerBanner && (
            <button
              onClick={() => { setShowWinnerBanner(false); setCurrentWinner(null); }}
              className="px-12 py-3 bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 font-mono font-bold rounded-lg hover:bg-cyan-500/20 flex items-center gap-3 transition-all shadow-[0_0_20px_rgba(6,182,212,0.1)]"
              disabled={isSaving}
            >
              <RotateCcw size={18} /> NEXT_ROUND
            </button>
          )}
        </div>

        <footer className="absolute bottom-10 w-full px-12 flex justify-between items-end">
          <div className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">
            Protocol: TechDraw_v3.0 // Security: High
          </div>
          <div className="flex gap-4">
            <button onClick={() => setIsSoundOn(!isSoundOn)} className="w-10 h-10 flex items-center justify-center bg-slate-900/50 rounded-lg border border-white/5 hover:border-cyan-500/50 text-slate-400 transition-colors">
              {isSoundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
            <button onClick={() => setShowAdmin(true)} className="w-10 h-10 flex items-center justify-center bg-slate-900/50 rounded-lg border border-white/5 hover:border-cyan-500/50 text-slate-400 transition-colors">
              <Settings size={18} />
            </button>
            <button onClick={loadData} className="w-10 h-10 flex items-center justify-center bg-slate-900/50 rounded-lg border border-white/5 hover:border-cyan-500/50 text-slate-400 transition-colors">
              <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
            </button>
          </div>
        </footer>
      </main>

      {showWinnerBanner && currentWinner && (
        <WinnerBanner winner={currentWinner} onClose={() => { if(!isSaving) { setShowWinnerBanner(false); setCurrentWinner(null); } }} />
      )}

      {showAdmin && (
        <AdminPanel 
          settings={settings} 
          onSave={(newSettings) => {
            setSettings(newSettings);
            localStorage.setItem('lucky_draw_settings', JSON.stringify(newSettings));
          }} 
          onClose={() => setShowAdmin(false)} 
          onResetResults={async () => {
            if (confirm("Xác nhận reset toàn bộ kết quả? Thao tác này sẽ cho phép mọi người quay lại từ đầu.")) {
              try {
                const res = await fetch(`${settings.apiBaseUrl}?action=resetResults`, { method: 'POST' });
                if (res.ok) await loadData();
              } catch (e) { console.error(e); }
            }
          }} 
        />
      )}
    </div>
  );
};

export default App;
