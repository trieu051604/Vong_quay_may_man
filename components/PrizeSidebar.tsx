
// import React from 'react';
// import { Prize } from '../types';

// interface PrizeSidebarProps {
//   prizes: Prize[];
//   selectedPrizeId: string;
//   onSelectPrize: (id: string) => void;
//   isSpinning: boolean;
// }

// const PrizeSidebar: React.FC<PrizeSidebarProps> = ({ prizes, selectedPrizeId, onSelectPrize, isSpinning }) => {
//   return (
//     <aside className="w-80 h-screen bg-white/40 backdrop-blur-xl border-r border-slate-100 z-10 flex flex-col p-8 overflow-y-auto">
//       <div className="mb-10">
//         <h1 className="text-2xl font-black text-blue-900 tracking-tighter mb-1 uppercase">Hệ Thống</h1>
//         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Quản lý danh sách</p>
//       </div>
      
//       <div className="space-y-4">
//         {prizes.length === 0 && <p className="text-slate-400 italic text-sm">Đang tải dữ liệu...</p>}
//         {prizes.sort((a,b) => a.order - b.order).map((prize) => (
//           <div
//             key={prize.prizeId}
//             onClick={() => !isSpinning && onSelectPrize(prize.prizeId)}
//             className={`
//               p-4 rounded-2xl border-2 transition-all cursor-pointer relative group
//               ${selectedPrizeId === prize.prizeId 
//                 ? 'bg-blue-900 border-blue-900 shadow-xl scale-105' 
//                 : 'bg-white/80 border-slate-50 hover:border-blue-200'}
//             `}
//           >
//             <div className="flex items-center gap-4">
//               <div className={`
//                 w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm
//                 ${selectedPrizeId === prize.prizeId ? 'bg-amber-400 text-blue-900' : 'bg-slate-100 text-slate-400'}
//               `}>
//                 {prize.order}
//               </div>
//               <div className="flex-1">
//                 <h3 className={`font-bold text-xs uppercase tracking-tight ${selectedPrizeId === prize.prizeId ? 'text-white' : 'text-slate-800'}`}>
//                   {prize.prizeName}
//                 </h3>
//                 <div className={`text-[10px] mt-1 font-semibold ${selectedPrizeId === prize.prizeId ? 'text-blue-300' : 'text-slate-400'}`}>
//                    {prize.wonCount} lượt đã xong
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="mt-auto pt-10 text-[9px] text-slate-300 font-bold uppercase tracking-[0.3em] text-center">
//         Secured Database
//       </div>
//     </aside>
//   );
// };

// export default PrizeSidebar;
