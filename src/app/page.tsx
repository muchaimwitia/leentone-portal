'use client';

import { useState, useEffect } from 'react'; 
import { useInvestmentJourney } from '@/hooks/useInvestmentJourney';
import PropertyCard from '@/components/luxury/PropertyCard';
import InquiryForm from '@/components/luxury/InquiryForm';
import MagneticButton from '@/components/luxury/MagneticButton';
import { motion, AnimatePresence } from 'framer-motion';
import { Property, PurchaseMode } from '@/types/investment';
import LiveTicker from '@/components/luxury/LiveTicker';
import PropertyMap from '@/components/luxury/PropertyMap';

const PROPS: Property[] = [
  { id: 'p1', name: 'The Westlands Sky Residence', loc: 'Westlands, Nairobi', kes: 65e6, seg: 'pent', beds: 4, baths: 4, sqm: 420, v: true, ref: 'NRB-WL-0871', off: false, feats: ['Full-floor layout', 'Smart home', '4 parking bays'], em: '', g: '#121A2F, #1E293B' },
  { id: 'p2', name: 'Parklands Crown Penthouse', loc: 'Parklands / Westlands', kes: 85e6, seg: 'pent', beds: 5, baths: 5, sqm: 580, v: true, ref: 'NRB-PK-0043', off: true, feats: ['Duplex layout', 'Private pool deck', 'Wine room'], em: '', g: '#1E293B, #0B1325' },
  { id: 'p3', name: 'Westlands Garden Penthouse', loc: 'Westlands, Nairobi', kes: 35e6, seg: 'pent', beds: 3, baths: 3, sqm: 240, v: false, ref: null, off: false, feats: ['Wraparound garden', 'Central A/C'], em: '', g: '#080D19, #121A2F' },
  { id: 'p4', name: 'Karen Estate Manor', loc: 'Karen, Nairobi', kes: 150e6, seg: 'vil', beds: 6, baths: 7, sqm: 920, v: true, ref: 'NRB-KA-1194', off: true, feats: ['1.2 acre plot', '8-car garage', 'Heated pool'], em: '', g: '#0B1325, #1E293B' },
];

const luxuryTransition = { type: "spring", stiffness: 80, damping: 20, mass: 1.2 } as const;

const NAV_STEPS = [
  { s: 1, l: 'Context' }, { s: 2, l: 'Portfolio' }, { s: 3, l: 'Analysis' },
  { s: 4, l: 'Inquiry' }, { s: 5, l: 'Private' },
];

// ══════════════════════════════════════════
// STEP NAV — forward / back + dot indicator
// ══════════════════════════════════════════
function StepNav({ step, goToStep, triggerHaptic }: {
  step: number;
  goToStep: (s: number) => void;
  triggerHaptic: (p: number | number[]) => void;
}) {
  const prev = NAV_STEPS.find(x => x.s === step - 1);
  const next = NAV_STEPS.find(x => x.s === step + 1);

  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: 'clamp(16px,3vw,28px) clamp(16px,4vw,48px)',
      borderTop: '1px solid #1E293B',
      backgroundColor: '#080D19',
    }}>
      {/* ← Back */}
      <button
        onClick={() => { if (prev) { goToStep(prev.s); triggerHaptic(8); } }}
        disabled={!prev}
        style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          fontFamily: 'monospace', fontSize: 'clamp(8px,1.2vw,10px)',
          letterSpacing: '0.25em', textTransform: 'uppercase',
          color: prev ? '#94A3B8' : '#1E293B',
          background: 'none', border: 'none', cursor: prev ? 'pointer' : 'default',
          transition: 'color 0.3s ease', padding: 0,
        }}
        onMouseEnter={e => { if (prev) e.currentTarget.style.color = '#FDFBF7'; }}
        onMouseLeave={e => { if (prev) e.currentTarget.style.color = '#94A3B8'; }}
      >
        <span style={{
          width: '32px', height: '32px',
          border: `1px solid ${prev ? '#1E293B' : '#0d1220'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: '2px', fontSize: '14px',
          color: prev ? '#B89B5E' : '#1E293B',
          transition: 'border-color 0.3s ease', flexShrink: 0,
        }}>←</span>
        <span style={{ display: 'none' }} className="sm-inline">{prev?.l ?? ''}</span>
      </button>

      {/* Dot indicators */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {NAV_STEPS.map(s => (
          <button
            key={s.s}
            onClick={() => { goToStep(s.s); triggerHaptic(5); }}
            title={s.l}
            style={{
              width: s.s === step ? '20px' : '6px',
              height: '6px', borderRadius: '3px',
              backgroundColor: s.s === step ? '#B89B5E' : '#1E293B',
              border: 'none', cursor: 'pointer', padding: 0,
              transition: 'all 0.4s ease',
            }}
          />
        ))}
      </div>

      {/* → Forward */}
      <button
        onClick={() => { if (next) { goToStep(next.s); triggerHaptic(8); } }}
        disabled={!next}
        style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          fontFamily: 'monospace', fontSize: 'clamp(8px,1.2vw,10px)',
          letterSpacing: '0.25em', textTransform: 'uppercase',
          color: next ? '#94A3B8' : '#1E293B',
          background: 'none', border: 'none', cursor: next ? 'pointer' : 'default',
          transition: 'color 0.3s ease', padding: 0,
        }}
        onMouseEnter={e => { if (next) e.currentTarget.style.color = '#FDFBF7'; }}
        onMouseLeave={e => { if (next) e.currentTarget.style.color = '#94A3B8'; }}
      >
        <span style={{ display: 'none' }} className="sm-inline">{next?.l ?? ''}</span>
        <span style={{
          width: '32px', height: '32px',
          border: `1px solid ${next ? '#1E293B' : '#0d1220'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: '2px', fontSize: '14px',
          color: next ? '#B89B5E' : '#1E293B',
          transition: 'border-color 0.3s ease', flexShrink: 0,
        }}>→</span>
      </button>
    </div>
  );
}

// ══════════════════════════════════════════
// COLLAPSIBLE MAP WRAPPER
// ══════════════════════════════════════════
function CollapsibleMap() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ marginBottom: '40px', border: '1px solid #1E293B', borderRadius: '2px', overflow: 'hidden' }}>
      {/* Toggle bar */}
      <button
        onClick={() => setExpanded(v => !v)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: 'clamp(12px,2vw,16px) clamp(16px,3vw,24px)',
          backgroundColor: expanded ? '#0d1526' : '#0a1020',
          border: 'none', cursor: 'pointer',
          borderBottom: expanded ? '1px solid #1E293B' : 'none',
          transition: 'background-color 0.3s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%',
            backgroundColor: expanded ? '#B89B5E' : '#2a3a5c',
            transition: 'background-color 0.3s ease', flexShrink: 0,
          }} />
          <span style={{
            fontFamily: 'monospace', fontSize: 'clamp(8px,1.2vw,10px)',
            letterSpacing: '0.3em', textTransform: 'uppercase',
            color: expanded ? '#B89B5E' : '#64748B',
            transition: 'color 0.3s ease',
          }}>
            {expanded ? 'Location Map — Active' : 'View Location Map'}
          </span>
        </div>
        <span style={{
          fontFamily: 'monospace', fontSize: '10px',
          color: expanded ? '#B89B5E' : '#64748B',
          transition: 'all 0.3s ease',
          transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          display: 'inline-block',
        }}>▼</span>
      </button>

      {/* Map — only rendered + interactive when expanded */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <PropertyMap />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ══════════════════════════════════════════
// MAIN PORTAL
// ══════════════════════════════════════════
export default function InvestmentPortal() {
  const { step, goToStep, currency, setCurrency, formatPrice, selectedProperty, setSelectedProperty, triggerHaptic } = useInvestmentJourney();
  const [mode, setMode] = useState<PurchaseMode>('cash');
  const [horizon, setHorizon] = useState<5|10|15>(10);
  const [dlState, setDlState] = useState<'idle'|'compiling'|'watermarking'|'ready'>('idle');
  const [activeStepHover, setActiveStepHover] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileMenuOpen(false); }, [step]);

  const handleDownload = () => {
    if (dlState !== 'idle') return;
    triggerHaptic(15);
    setDlState('compiling');
    setTimeout(() => setDlState('watermarking'), 1500);
    setTimeout(() => {
      setDlState('ready');
      triggerHaptic([10, 50, 10]);
      setTimeout(() => setDlState('idle'), 3000);
    }, 2800);
  };

  const chartData = {
    5:  { cash: "M 0 160 Q 250 130 500 100", mort: "M 0 160 Q 300 170 500 120", cEnd: 100, mEnd: 120 },
    10: { cash: "M 0 160 Q 250 100 500 40",  mort: "M 0 160 Q 300 180 500 10",  cEnd: 40,  mEnd: 10 },
    15: { cash: "M 0 160 Q 250 70 500 10",   mort: "M 0 160 Q 350 180 500 -20", cEnd: 10,  mEnd: -20 }
  };
  const activeChart = chartData[horizon];

  const NAV_ITEMS = [{s:1,l:'Context',r:'I'},{s:2,l:'Portfolio',r:'II'},{s:3,l:'Analysis',r:'III'},{s:4,l:'Inquiry',r:'IV'},{s:5,l:'Private',r:'V'}];

  return (
    <div className="min-h-screen pb-[100px] bg-[#080D19] text-[#FDFBF7] overflow-x-hidden" style={{ zoom: '0.8' }}>
      
      <div className={`top-scroll-mask transition-opacity duration-700 ease-in-out ${isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />

      <header className={`glass-header z-[500] flex items-center ${isScrolled ? 'header-scrolled' : 'header-island'}`}>
        <div className={`flex transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] w-full max-w-[1400px] mx-auto px-[24px] md:px-[60px] ${isScrolled ? 'flex-row justify-between items-center' : 'flex-col items-center justify-center h-full'}`}>
          
          <div className={`flex items-center cursor-pointer transition-all duration-700 ${isScrolled ? 'gap-4' : 'flex-col'}`} onClick={() => goToStep(1)}>
            <motion.div className={`border border-[#B89B5E] rounded-full flex items-center justify-center overflow-hidden bg-[#121A2F]/50 transition-all duration-700 ${isScrolled ? 'w-[32px] h-[32px] mb-0' : 'w-[85px] h-[85px] mb-[40px]'}`}>
              <img src="/ls-monogram.png" alt="LS" className="w-[180%] h-[180%] object-contain opacity-90" />
            </motion.div>
            <div className={`flex flex-col transition-all duration-700 ${isScrolled ? 'items-start justify-center' : 'items-center'}`}>
              <div className={`font-serif tracking-[0.05em] text-[#FDFBF7] leading-none transition-all duration-700 text-center w-full ${isScrolled ? 'text-[18px] hidden sm:block' : 'text-[34px]'}`}>
                Leentone Solutions
              </div>
              <div className={`font-mono text-[10px] tracking-[0.8em] uppercase text-[#B89B5E] ml-[0.8em] transition-all duration-[600ms] overflow-hidden ${isScrolled ? 'max-h-0 opacity-0 mt-0' : 'max-h-[40px] opacity-90 mt-[40px]'}`}>
                NAIROBI
              </div>
            </div>
          </div>

          <div className={`hidden md:flex transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden items-center ${isScrolled ? 'max-w-[1000px] opacity-100 ml-auto' : 'max-w-0 opacity-0 ml-0 pointer-events-none'}`}>
            <nav className="flex items-center gap-4 sm:gap-6 md:gap-10 w-max">
              {NAV_ITEMS.map((item) => (
                <button key={item.s} onClick={() => { goToStep(item.s); triggerHaptic(5); }} className="group flex items-center relative flex-row gap-2">
                  <span className={`font-serif leading-none transition-all duration-500 ${step === item.s ? 'text-[#B89B5E]' : 'text-[#94A3B8] group-hover:text-[#FDFBF7]'} text-[18px] md:text-[22px]`}>{item.r}</span>
                  <span className={`font-mono tracking-[0.1em] leading-none uppercase transition-all duration-500 flex ${step === item.s ? 'text-[#FDFBF7]' : 'text-[#94A3B8]'} text-[9px] md:text-[11px]`}>{item.l}</span>
                  {step === item.s && <motion.div layoutId="navActive" className="absolute bg-[#B89B5E] h-[1px] transition-all duration-700 -bottom-[12px] w-full left-0" />}
                </button>
              ))}
            </nav>
            <div className="hidden lg:flex items-center ml-8 pl-8 border-l border-[#1E293B]">
              <div onClick={() => setCurrency(currency === 'KES' ? 'USD' : 'KES')} className="text-[10px] font-mono cursor-pointer opacity-60 hover:opacity-100 px-3 py-1.5 border border-[#1E293B] rounded-[2px] transition-colors">{currency}</div>
            </div>
          </div>

          {isScrolled && (
            <button className="md:hidden ml-auto flex flex-col justify-center items-center gap-[5px] w-[36px] h-[36px] border border-[#1E293B] rounded-[2px] bg-[#080D19] flex-shrink-0" onClick={() => setMobileMenuOpen(v => !v)} aria-label="Toggle menu">
              <motion.span animate={{ rotate: mobileMenuOpen ? 45 : 0, y: mobileMenuOpen ? 7 : 0 }} transition={{ duration: 0.3 }} className="block w-[14px] h-[1px] bg-[#B89B5E] origin-center" />
              <motion.span animate={{ opacity: mobileMenuOpen ? 0 : 1 }} transition={{ duration: 0.2 }} className="block w-[14px] h-[1px] bg-[#B89B5E]" />
              <motion.span animate={{ rotate: mobileMenuOpen ? -45 : 0, y: mobileMenuOpen ? -7 : 0 }} transition={{ duration: 0.3 }} className="block w-[14px] h-[1px] bg-[#B89B5E] origin-center" />
            </button>
          )}
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden fixed top-[60px] left-0 right-0 z-[9998] bg-[#080D19] border-b border-[#1E293B] overflow-y-auto"
            style={{ maxHeight: 'calc(100vh - 60px)' }}
          >
            <nav className="flex flex-col w-full">
              {NAV_ITEMS.map((item, i) => (
                <motion.button key={item.s} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  onClick={() => { goToStep(item.s); triggerHaptic(5); setMobileMenuOpen(false); }}
                  className={`flex items-center gap-4 px-[24px] py-[16px] border-b border-[#1E293B] w-full text-left transition-colors duration-300 ${step === item.s ? 'bg-[#121A2F]' : 'hover:bg-[#0d1526]'}`}
                >
                  <span className={`font-serif text-[20px] leading-none flex-shrink-0 ${step === item.s ? 'text-[#B89B5E]' : 'text-[#2a3a5c]'}`}>{item.r}</span>
                  <span className={`font-mono text-[10px] tracking-[0.3em] uppercase ${step === item.s ? 'text-[#FDFBF7]' : 'text-[#94A3B8]'}`}>{item.l}</span>
                  {step === item.s && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#B89B5E] flex-shrink-0" />}
                </motion.button>
              ))}
              <div className="px-[24px] py-[14px] flex items-center justify-between">
                <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#64748B]">Currency</span>
                <div onClick={() => setCurrency(currency === 'KES' ? 'USD' : 'KES')} className="font-mono text-[10px] cursor-pointer text-[#B89B5E] border border-[#1E293B] px-3 py-1.5 rounded-[2px] hover:border-[#B89B5E] transition-colors">{currency}</div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-[250px] md:pt-[540px]">
        <AnimatePresence mode="wait">

          {/* ══ STEP 1 ══ */}
          {step === 1 && (
            <motion.section key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

              <div style={{ position: 'relative', width: '100%', minHeight: 'clamp(60vh, 80vh, 90vh)', overflow: 'hidden', backgroundColor: '#080D19', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <motion.div initial={{ scale: 1.1, opacity: 0 }} animate={{ scale: 1, opacity: 0.4 }} transition={{ duration: 2.5, ease: "easeOut" }} style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
                  <img src="/skyline.jpg" alt="Nairobi" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center' }} />
                </motion.div>
                <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', background: 'linear-gradient(to bottom, #080D19 0%, transparent 35%, transparent 65%, #080D19 100%)' }} />
                <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', backgroundColor: 'rgba(8,13,25,0.25)' }} />
                <div style={{ position: 'relative', zIndex: 10, padding: 'clamp(32px,6vw,64px) clamp(24px,5vw,80px) 0', textAlign: 'center' }}>
                  <motion.p initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4 }} style={{ fontFamily: 'monospace', fontSize: 'clamp(8px,1.2vw,11px)', letterSpacing: '0.45em', textTransform: 'uppercase', color: '#B89B5E', margin: 0, lineHeight: 1.8 }}>
                    Luxury Real Estate Acquisition With Leentone | End-to-End Private Institutional Path
                  </motion.p>
                </div>
                <div style={{ position: 'relative', zIndex: 10, padding: '0 clamp(24px,5vw,80px) clamp(40px,7vw,72px)', textAlign: 'center' }}>
                  <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.6 }} style={{ fontFamily: 'sans-serif', fontSize: 'clamp(12px,1.5vw,16px)', color: '#94A3B8', maxWidth: '750px', margin: '0 auto', lineHeight: 1.8, fontWeight: 300 }}>
                    Purchasing a built or off-plan property — apartment, penthouse, or villa — involves distinct legal, structural, and management due diligence steps beyond a standard title search.
                  </motion.p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', width: '100%', alignItems: 'stretch' }}>

                <div style={{ backgroundColor: '#0d1526', borderBottom: '1px solid #1E293B', borderRight: '1px solid #1E293B', padding: 'clamp(16px,3vw,32px) clamp(12px,3vw,40px) clamp(12px,2vw,24px)' }}>
                  <p style={{ fontFamily: 'monospace', fontSize: 'clamp(7px,1.5vw,9px)', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#B89B5E', marginBottom: '6px' }}>The Leentone Solutions Legal Protocol</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '8px' }}>
                    <h2 style={{ fontFamily: 'serif', fontSize: 'clamp(13px,2.5vw,28px)', color: '#FDFBF7', fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1.2, margin: 0 }}>08 Mandatory Steps</h2>
                    <span style={{ fontFamily: 'monospace', fontSize: 'clamp(6px,1vw,8px)', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B89B5E', border: '1px solid #1E293B', padding: '3px 6px', borderRadius: '2px', backgroundColor: '#080D19', whiteSpace: 'nowrap' }}>Kenya Law</span>
                  </div>
                </div>

                <div style={{ backgroundColor: '#100808', borderBottom: '1px solid #2a1010', padding: 'clamp(16px,3vw,32px) clamp(12px,3vw,40px) clamp(12px,2vw,24px)' }}>
                  <p style={{ fontFamily: 'monospace', fontSize: 'clamp(7px,1.5vw,9px)', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#8A2525', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '5px', height: '5px', backgroundColor: '#8A2525', borderRadius: '50%', display: 'inline-block', flexShrink: 0 }} />
                    Classified Advisory
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '8px' }}>
                    <h2 style={{ fontFamily: 'serif', fontSize: 'clamp(13px,2.5vw,28px)', color: '#FDFBF7', fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1.2, margin: 0 }}>Immediate Red Flags</h2>
                    <span style={{ fontFamily: 'monospace', fontSize: 'clamp(6px,1vw,8px)', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8A2525', border: '1px solid #2a1010', padding: '3px 6px', borderRadius: '2px', backgroundColor: '#0d0404', whiteSpace: 'nowrap' }}>08 Risks</span>
                  </div>
                </div>

                {[
                  { step: { n: '01', t: 'Verify Title via Ardhisasa', d: 'Run a title search on Ardhisasa (Ministry of Lands). For apartments, confirm a registered Sectional Title under the Sectional Properties Act 2020.', tag: 'Sectional Properties Act 2020' }, flag: { t: 'Title Inaccessibility or Informal Paperwork', d: 'The seller offers only "Letters of Allotment" or "Share Certificates" and cannot produce a verifiable record on the Ardhisasa portal.' } },
                  { step: { n: '02', t: 'Engage Conveyancing Advocate', d: 'Appoint an LSK-registered advocate specialising in residential conveyancing. Fees are regulated (typically 1.25%).', tag: 'Law Society of Kenya' }, flag: { t: 'Unregulated Legal Representation', d: 'The seller insists you use "their" lawyer for "speed," or the advocate provided is not currently practicing according to the LSK portal.' } },
                  { step: { n: '03', t: 'Execute Sale Agreement (SPA)', d: "Review the SPA for unit specifics, parking, and completion clauses. A 10% deposit must be held in the advocate's regulated client account.", tag: 'Advocates Accounts Rules' }, flag: { t: 'Ambiguous or Predatory Contracts', d: 'The SPA lacks a fixed completion date, omits specific parking/storage rights, or demands the deposit be paid directly to the developers business account.' } },
                  { step: { n: '04', t: 'Obtain Occupation Certificate (OC)', d: 'Demand the Occupation Certificate issued by the County Government confirming habitability. Never release final payment without it.', tag: 'Physical Planning Act 2019' }, flag: { t: 'Lack of Habitability Proof', d: 'The building is physically complete but lacks a valid OC, meaning the structure is legally "non-existent" for occupancy or mortgage purposes.' } },
                  { step: { n: '05', t: 'Structural & Snagging Inspection', d: 'Hire an independent structural engineer and quantity surveyor. Request a full snagging report cataloguing all defects before completion.', tag: 'Engineers Board of Kenya' }, flag: { t: 'Restricted Site Access or Hidden Defects', d: 'The developer refuses independent inspections or limits "snagging" to cosmetic issues only, hiding potential structural or MEP (mechanical, electrical, plumbing) failures.' } },
                  { step: { n: '06', t: 'Review Management & By-Laws', d: 'Audit the management company under the Sectional Properties Act. Review service charge schedules, reserve fund balance, and sub-letting rules.', tag: 'Management Audit' }, flag: { t: 'Dysfunctional Management Body', d: 'There is no constituted Management Company or sinking fund, leaving you liable for future major repairs and unpredictable service charge hikes.' } },
                  { step: { n: '07', t: 'Clearance & Stamp Duty', d: 'Obtain Land Rent, Land Rates, and Service Charge Clearance Certificates. Settle Stamp Duty at 4% via KRA iTax. Allow 3–6 weeks for government valuation.', tag: 'Stamp Duty Act · KRA iTax' }, flag: { t: 'Outstanding Statutory Liabilities', d: "The land has unpaid rates or encumbrances (bank charges) that prevent the KRA from issuing a clearance, stalling your ownership indefinitely." } },
                  { step: { n: '08', t: 'Lodge Transfer of Title', d: "Lodge the Transfer Instrument with the original title and clearances. The Registrar cancels the seller's title and issues a new Sectional Title in your name.", tag: 'Land Registration Act 2012' }, flag: { t: 'Identity & Documentation Mismatch', d: 'The names on the Title Deed do not perfectly match the Sellers ID/KRA PIN, or the "original" title is "lost," signaling a high risk of fraudulent double-selling.' } },
                ].map((row, i) => (
                  <>
                    <div key={`step-${i}`} onMouseEnter={() => setActiveStepHover(i)} onMouseLeave={() => setActiveStepHover(null)}
                      style={{ backgroundColor: activeStepHover === i ? '#162038' : '#0f1829', borderBottom: '1px solid #1E293B', borderRight: '1px solid #1E293B', padding: 'clamp(12px,2.5vw,24px) clamp(10px,3vw,40px)', transition: 'background-color 0.4s ease', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', fontFamily: 'serif', fontSize: 'clamp(40px,8vw,80px)', color: '#FDFBF7', opacity: 0.025, userSelect: 'none', pointerEvents: 'none', fontStyle: 'italic', lineHeight: 1 }}>{row.step.n}</div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'clamp(6px,1.5vw,16px)', position: 'relative', zIndex: 1 }}>
                        <span style={{ fontFamily: 'serif', fontSize: 'clamp(16px,3vw,28px)', lineHeight: 1, color: activeStepHover === i ? '#B89B5E' : '#2a3a5c', flexShrink: 0, transition: 'color 0.4s ease', marginTop: '2px' }}>{row.step.n}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '5px' }}>
                            <h4 style={{ fontFamily: 'serif', fontSize: 'clamp(11px,1.8vw,15px)', color: '#FDFBF7', fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1.3, margin: 0 }}>{row.step.t}</h4>
                            <span style={{ fontFamily: 'monospace', fontSize: 'clamp(6px,1vw,7px)', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B89B5E', border: '1px solid #1E293B', padding: '2px 5px', borderRadius: '2px', backgroundColor: '#080D19', alignSelf: 'flex-start', whiteSpace: 'nowrap' }}>{row.step.tag}</span>
                          </div>
                          <p style={{ fontSize: 'clamp(10px,1.4vw,12px)', color: '#64748B', lineHeight: 1.6, fontWeight: 300, margin: 0 }}>{row.step.d}</p>
                        </div>
                      </div>
                    </div>

                    <div key={`flag-${i}`} className="group"
                      style={{ backgroundColor: '#120808', borderBottom: '1px solid #2a1010', padding: 'clamp(12px,2.5vw,24px) clamp(10px,3vw,40px)', position: 'relative', overflow: 'hidden', cursor: 'crosshair', transition: 'background-color 0.4s ease', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1a0b0b')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#120808')}>
                      <div className="absolute top-0 left-0 w-0 h-[1px] bg-gradient-to-r from-[#8A2525] to-transparent group-hover:w-full transition-all duration-700 ease-out" />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontFamily: 'monospace', fontSize: 'clamp(6px,1vw,7px)', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#3d1515' }}>RF_{String(i + 1).padStart(2, '0')}</span>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ fontFamily: 'monospace', fontSize: 'clamp(6px,1vw,7px)', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8A2525' }}>Halt Transaction</span>
                      </div>
                      <h4 style={{ fontFamily: 'serif', fontSize: 'clamp(11px,1.8vw,15px)', color: '#e8d0d0', fontWeight: 300, lineHeight: 1.3, marginBottom: '5px' }}>{row.flag.t}</h4>
                      <p style={{ fontSize: 'clamp(10px,1.4vw,12px)', color: '#6b4040', lineHeight: 1.6, fontWeight: 300, margin: 0 }}>{row.flag.d}</p>
                    </div>
                  </>
                ))}
              </div>

              <div className="flex justify-center pt-[40px] md:pt-[60px] pb-[40px] bg-[#080D19] border-t border-[#1E293B]">
                <MagneticButton onClick={() => goToStep(2)} className="w-full md:w-auto px-[30px] md:px-[50px] py-[16px] md:py-[20px] bg-[#FDFBF7] text-[#080D19] rounded-[2px] font-mono text-[9px] md:text-[10px] tracking-[0.4em] uppercase hover:bg-[#B89B5E] hover:text-[#FDFBF7] transition-colors duration-500 shadow-xl">
                  Enter Portfolio Collection
                </MagneticButton>
              </div>

              <StepNav step={step} goToStep={goToStep} triggerHaptic={triggerHaptic} />
            </motion.section>
          )}

          {/* ══ STEP 2 ══ */}
          {step === 2 && (
            <motion.section key="s2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={luxuryTransition} className="max-w-[1200px] mx-auto px-[24px] md:px-[40px]">
              <div className="text-center mb-[40px] md:mb-[60px]">
                <p className="font-mono text-[9px] md:text-[10px] tracking-[0.5em] uppercase text-[#B89B5E] mb-[16px]">Step II — Selection</p>
                <h2 className="font-serif text-[clamp(28px,4vw,48px)] font-light text-[#FDFBF7]">The Prime Collection</h2>
              </div>

              <CollapsibleMap />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px] md:gap-[40px]">
                {PROPS.filter(p => !p.off || (step as number) === 5).map(p => (
                  <PropertyCard key={p.id} property={p} formatPrice={formatPrice} currency={currency} onSelect={(p) => { setSelectedProperty(p); goToStep(3); triggerHaptic(10); }} />
                ))}
              </div>

              <StepNav step={step} goToStep={goToStep} triggerHaptic={triggerHaptic} />
            </motion.section>
          )}

          {/* ══ STEP 3 ══ */}
          {step === 3 && (
            <motion.section key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={luxuryTransition} className="max-w-[1000px] mx-auto px-[20px] md:px-[24px]">
              <div className="text-center mb-8 md:mb-10">
                <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#B89B5E] mb-[8px] md:mb-[10px]">Step III — Forensic Analysis</p>
                <h2 className="font-serif text-[28px] md:text-[42px] font-light text-[#FDFBF7]">Yield & Equity Projections</h2>
              </div>

              <div className="grid grid-cols-2 gap-[2px] p-[2px] rounded-[2px] bg-[#1E293B] mb-8 max-w-[600px] mx-auto border border-[#1E293B]">
                <button onClick={() => { setMode('cash'); triggerHaptic(10); }} className={`py-[12px] md:py-[14px] text-[9px] md:text-[10px] uppercase tracking-widest transition-all ${mode === 'cash' ? 'bg-[#FDFBF7] text-[#080D19] font-bold' : 'text-[#94A3B8] hover:text-[#FDFBF7]'}`}>Outright Cash</button>
                <button onClick={() => { setMode('mortgage'); triggerHaptic(10); }} className={`py-[12px] md:py-[14px] text-[9px] md:text-[10px] uppercase tracking-widest transition-all ${mode === 'mortgage' ? 'bg-[#FDFBF7] text-[#080D19] font-bold' : 'text-[#94A3B8] hover:text-[#FDFBF7]'}`}>Debt Leverage</button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
                <div className="space-y-4 md:space-y-6">
                  <div className="bg-[#121A2F] border border-[#1E293B] p-5 md:p-6 rounded-[2px]">
                    <span className="font-mono text-[8px] text-[#B89B5E] uppercase tracking-widest block mb-4">Investment Cycle</span>
                    <div className="flex gap-2">
                      {[5, 10, 15].map(yr => (
                        <button key={yr} onClick={() => { setHorizon(yr as 5|10|15); triggerHaptic(8); }} className={`flex-1 py-3 border transition-all text-[10px] font-mono ${horizon === yr ? 'bg-[#B89B5E] border-[#B89B5E] text-[#080D19]' : 'border-[#1E293B] text-[#94A3B8] hover:border-[#B89B5E]'}`}>{yr}Y</button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 bg-[#121A2F] border border-[#1E293B] p-5 md:p-8 rounded-[2px] luxury-shadow">
                  <div className="relative h-[200px] md:h-[250px] w-full border-b border-l border-[#1E293B] pt-4">
                    <svg viewBox="0 0 500 200" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                      {[0.25, 0.5, 0.75].map(v => <line key={v} x1="0" y1={200 * v} x2="500" y2={200 * v} stroke="#1E293B" strokeWidth="1" strokeDasharray="4 4" />)}
                      <motion.path d={mode === 'cash' ? activeChart.cash : activeChart.mort} fill="none" stroke="#B89B5E" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1, d: mode === 'cash' ? activeChart.cash : activeChart.mort }} transition={{ duration: 1.5, ease: "easeInOut" }} />
                    </svg>
                  </div>
                  <div className="mt-8 md:mt-10">
                    <button onClick={handleDownload} disabled={dlState !== 'idle'} className="w-full py-4 md:py-5 border border-[#B89B5E] text-[#B89B5E] font-mono text-[9px] md:text-[10px] tracking-[0.3em] uppercase hover:bg-[#B89B5E] hover:text-[#080D19] transition-all flex items-center justify-center gap-4">
                      {dlState === 'idle' ? '[ DOWNLOAD FORENSIC MEMORANDUM ]' : '[ COMPILING ENCRYPTED DATA... ]'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-10 md:mt-12 border-t border-[#1E293B] pt-8">
                <button onClick={() => goToStep(2)} className="font-mono text-[10px] text-[#94A3B8] uppercase tracking-widest hover:text-[#FDFBF7]">← Portfolio</button>
                <button onClick={() => goToStep(4)} className="w-full md:w-auto px-12 py-4 bg-[#B89B5E] text-[#080D19] font-mono text-[10px] font-bold uppercase tracking-widest shadow-xl">Inquire Access</button>
              </div>

              <StepNav step={step} goToStep={goToStep} triggerHaptic={triggerHaptic} />
            </motion.section>
          )}

          {/* ══ STEP 4 ══ */}
          {step === 4 && (
            <motion.section key="s4" className="max-w-[600px] mx-auto pt-4 md:pt-10 px-[24px]">
              <div className="text-center mb-10">
                <p className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-[#B89B5E] mb-[10px]">Step IV — Engagement</p>
                <h2 className="font-serif text-[28px] md:text-[36px] font-light text-[#FDFBF7]">Strategic Consultation</h2>
              </div>
              <InquiryForm onComplete={() => goToStep(5)} triggerHaptic={triggerHaptic} />
              <StepNav step={step} goToStep={goToStep} triggerHaptic={triggerHaptic} />
            </motion.section>
          )}

          {/* ══ STEP 5 ══ */}
          {step === 5 && (
            <motion.section key="s5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={luxuryTransition} className="max-w-[1200px] mx-auto px-[24px] md:px-[40px]">
              <div className="text-center mb-[40px] md:mb-[60px]">
                <p className="font-mono text-[9px] md:text-[10px] tracking-[0.5em] uppercase text-[#8A2525] mb-[16px] flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#8A2525] rounded-full animate-pulse"></span> Classified Access Granted
                </p>
                <h2 className="font-serif text-[clamp(28px,4vw,48px)] font-light text-[#FDFBF7]">The Private Reserve</h2>
              </div>

              <CollapsibleMap />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px] md:gap-[40px]">
                {PROPS.map(p => (
                  <PropertyCard key={p.id} property={p} formatPrice={formatPrice} currency={currency} onSelect={(p) => { setSelectedProperty(p); goToStep(3); triggerHaptic(10); }} />
                ))}
              </div>

              <StepNav step={step} goToStep={goToStep} triggerHaptic={triggerHaptic} />
            </motion.section>
          )}

        </AnimatePresence>
      </main>
      <LiveTicker />
    </div>
  );
}