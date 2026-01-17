
import React, { useState } from 'react';
import { AppSettings } from '../types';
import { X, Save, ShieldCheck, Trash2, ShieldAlert } from 'lucide-react';

interface AdminPanelProps {
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
  onClose: () => void;
  onResetResults: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ settings, onSave, onClose, onResetResults }) => {
  const [formData, setFormData] = useState<AppSettings>(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-cyan-500/20 w-full max-w-lg rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
          <h2 className="text-xl font-mono font-bold flex items-center gap-2 text-cyan-400">
            <ShieldCheck size={20} /> SYSTEM_CONFIG
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          <div className="space-y-3">
            <label className="text-xs font-mono font-semibold text-slate-500 block uppercase tracking-widest">
              API_ENDPOINT (Google Apps Script)
            </label>
            <input
              type="text"
              required
              placeholder="https://script.google.com/macros/s/.../exec"
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-cyan-100 font-mono text-sm focus:border-cyan-500/50 outline-none transition-all"
              value={formData.apiBaseUrl}
              onChange={e => setFormData({ ...formData, apiBaseUrl: e.target.value })}
            />
          </div>

          <div className="group relative p-5 bg-cyan-500/5 border border-cyan-500/20 rounded-xl transition-all hover:bg-cyan-500/10">
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <input
                  type="checkbox"
                  id="multipleWins"
                  className="w-5 h-5 rounded border-cyan-500/50 bg-black text-cyan-500 focus:ring-cyan-500 cursor-pointer"
                  checked={formData.allowMultipleWins}
                  onChange={e => setFormData({ ...formData, allowMultipleWins: e.target.checked })}
                />
              </div>
              <div>
                <label htmlFor="multipleWins" className="text-sm text-cyan-100 font-bold cursor-pointer block">
                  ALLOW_MULTI_WINS
                </label>
                <p className="text-[11px] text-slate-500 mt-1 font-mono leading-relaxed">
                  {formData.allowMultipleWins 
                    ? "Hệ thống đang cho phép một mã dự thưởng có thể trúng giải nhiều lần." 
                    : "Hệ thống sẽ tự động loại bỏ những mã đã trúng giải khỏi danh sách quay tiếp theo."}
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 border border-red-900/20 bg-red-900/5 rounded-xl space-y-4">
             <div className="flex items-center gap-2 text-red-400">
               <ShieldAlert size={16} />
               <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest">Danger Zone</h4>
             </div>
             <button
              type="button"
              onClick={onResetResults}
              className="w-full px-4 py-3 rounded-lg bg-red-950/20 hover:bg-red-900/40 border border-red-900/50 text-red-200 font-mono text-xs flex items-center justify-center gap-2 transition-all"
             >
              <Trash2 size={14} /> RESET_ALL_DATABASE_RESULTS
             </button>
          </div>

          <div className="flex gap-4 pt-4">
             <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg border border-white/5 text-slate-500 font-mono text-xs hover:text-white hover:bg-white/5 transition-all"
             >
              CANCEL
             </button>
             <button
              type="submit"
              className="flex-1 px-4 py-3 rounded-lg bg-cyan-600 text-black font-black font-mono text-xs hover:bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-2"
             >
              <Save size={16} /> COMMIT_CHANGES
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPanel;
