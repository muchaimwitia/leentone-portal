'use client';

import { motion } from 'framer-motion';

const TICKER_DATA = [
  { pair: 'USD/KES', val: '128.50', chg: '+0.12%', up: true },
  { pair: 'GBP/KES', val: '162.10', chg: '-0.05%', up: false },
  { pair: 'EUR/KES', val: '138.90', chg: '+0.22%', up: true },
  { pair: 'NSE 20 INDEX', val: '1,542.10', chg: '+1.14%', up: true },
  { pair: 'XRP/USD', val: '1.24', chg: '+4.52%', up: true },
  { pair: 'GOLD (OUNC)', val: '2,042.50', chg: '-0.10%', up: false },
];

export default function LiveTicker() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[1000] bg-[#03060C] border-t border-[#1E293B] h-[32px] md:h-[40px] flex items-center overflow-hidden">
      {/* "LIVE" Indicator */}
      <div className="absolute left-0 top-0 bottom-0 bg-[#03060C] z-10 px-4 flex items-center gap-2 border-r border-[#1E293B]">
        <span className="w-1.5 h-1.5 bg-[#B89B5E] rounded-full animate-pulse"></span>
        <span className="font-mono text-[8px] md:text-[9px] tracking-[0.2em] text-[#FDFBF7] uppercase">Market_Live</span>
      </div>

      {/* Infinite Scrolling Track */}
      <div className="flex whitespace-nowrap animate-ticker pl-[120px]">
        {[...TICKER_DATA, ...TICKER_DATA].map((item, i) => (
          <div key={i} className="flex items-center gap-6 px-8 border-r border-[#1E293B]/30 h-full">
            <span className="font-mono text-[9px] text-[#94A3B8] tracking-widest uppercase">{item.pair}</span>
            <span className="font-serif text-[11px] text-[#FDFBF7]">{item.val}</span>
            <span className={`font-mono text-[8px] ${item.up ? 'text-[#1A6A45]' : 'text-[#8A2525]'}`}>
              {item.up ? '▲' : '▼'} {item.chg}
            </span>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 40s linear infinite;
        }
      `}</style>
    </div>
  );
}