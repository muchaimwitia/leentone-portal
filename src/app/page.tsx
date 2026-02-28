'use client';

import { useState } from 'react';
import { useInvestmentJourney } from '@/hooks/useInvestmentJourney';
import PropertyCard from '@/components/luxury/PropertyCard';
import InquiryForm from '@/components/luxury/InquiryForm';
import MagneticButton from '@/components/luxury/MagneticButton';
import { motion, AnimatePresence } from 'framer-motion';
import { Property, PurchaseMode } from '@/types/investment';
import Image from 'next/image';

const PROPS: Property[] = [
  { id: 'p1', name: 'The Westlands Sky Residence', loc: 'Westlands, Nairobi', kes: 65e6, seg: 'pent', beds: 4, baths: 4, sqm: 420, v: true, ref: 'NRB-WL-0871', off: false, feats: ['Full-floor layout', 'Smart home', '4 parking bays'], em: '', g: '#121A2F, #1E293B' },
  { id: 'p2', name: 'Parklands Crown Penthouse', loc: 'Parklands / Westlands', kes: 85e6, seg: 'pent', beds: 5, baths: 5, sqm: 580, v: true, ref: 'NRB-PK-0043', off: true, feats: ['Duplex layout', 'Private pool deck', 'Wine room'], em: '', g: '#1E293B, #0B1325' },
  { id: 'p3', name: 'Westlands Garden Penthouse', loc: 'Westlands, Nairobi', kes: 35e6, seg: 'pent', beds: 3, baths: 3, sqm: 240, v: false, ref: null, off: false, feats: ['Wraparound garden', 'Central A/C'], em: '', g: '#080D19, #121A2F' },
  { id: 'p4', name: 'Karen Estate Manor', loc: 'Karen, Nairobi', kes: 150e6, seg: 'vil', beds: 6, baths: 7, sqm: 920, v: true, ref: 'NRB-KA-1194', off: true, feats: ['1.2 acre plot', '8-car garage', 'Heated pool'], em: '', g: '#0B1325, #1E293B' },
];

const luxuryTransition = { type: "spring", stiffness: 80, damping: 20, mass: 1.2 } as const;

export default function InvestmentPortal() {
  const { step, goToStep, currency, setCurrency, formatPrice, selectedProperty, setSelectedProperty, triggerHaptic } = useInvestmentJourney();
  const [mode, setMode] = useState<PurchaseMode>('cash');
  const [horizon, setHorizon] = useState<5|10|15>(10);
  const [dlState, setDlState] = useState<'idle'|'compiling'|'watermarking'|'ready'>('idle');
  const [activeStepHover, setActiveStepHover] = useState<number | null>(null);

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

  return (
    <div className="min-h-screen pb-[100px] bg-[#080D19] text-[#FDFBF7]">
      
      {/* FOOLPROOF CENTERED HEADER */}
      <header className="fixed top-0 left-0 right-0 w-full z-[500] glass-header border-b border-[#1E293B] py-[24px] md:py-[32px]">
        
        {/* ABSOLUTE CURRENCY TOGGLE (Completely removed from document flow) */}
        <div className="absolute right-[20px] md:right-[40px] top-[24px] md:top-[32px] hidden sm:flex items-center z-[510]">
          <div onClick={() => { setCurrency(currency === 'KES' ? 'USD' : 'KES'); triggerHaptic(8); }} className="flex items-center gap-[8px] px-[12px] py-[6px] rounded-full border border-[#1E293B] cursor-pointer text-[9px] font-mono select-none hover:bg-[#121A2F] transition-all">
            <span className={currency === 'KES' ? 'text-[#B89B5E] font-bold' : 'text-[#94A3B8]'}>KES</span>
            <span className="text-[#94A3B8]">/</span>
            <span className={currency === 'USD' ? 'text-[#B89B5E] font-bold' : 'text-[#94A3B8]'}>USD</span>
          </div>
        </div>

        {/* PERFECTLY CENTERED MAIN COLUMN */}
        <div className="flex flex-col items-center justify-center w-full max-w-[1440px] mx-auto relative z-[505]">
          
          {/* Brand Identity */}
          <div className="flex flex-col items-center justify-center cursor-pointer mb-[24px] md:mb-[32px]" onClick={() => goToStep(1)}>
            <div className="font-serif text-[24px] md:text-[32px] tracking-[0.02em] text-[#FDFBF7] leading-none mb-2 text-center">
              Leentone Solutions
            </div>
            <div className="font-mono text-[7px] md:text-[8px] tracking-[0.4em] uppercase text-[#B89B5E] text-center">
              NAIROBI
            </div>
          </div>

          {/* Roman Numerals Navigation */}
          <div className="flex justify-center items-center gap-[30px] md:gap-[80px]">
            {[{s:1,l:'Context',r:'I'},{s:2,l:'Portfolio',r:'II'},{s:3,l:'Analysis',r:'III'},{s:4,l:'Inquiry',r:'IV'},{s:5,l:'Private',r:'V'}].map((item) => (
              <button key={item.s} onClick={() => goToStep(item.s)} className="group flex flex-col items-center gap-[4px] md:gap-[6px] relative">
                <span className={`font-serif text-[16px] md:text-[20px] transition-colors ${step === item.s ? 'text-[#B89B5E] font-medium' : 'text-[#94A3B8] group-hover:text-[#FDFBF7]'}`}>{item.r}</span>
                <span className={`font-mono text-[7px] md:text-[8px] tracking-[0.05em] md:tracking-[0.15em] transition-colors uppercase ${step === item.s ? 'text-[#FDFBF7]' : 'text-[#94A3B8]'}`}>{item.l}</span>
                
                {/* Active Gold Line */}
                {step === item.s && <motion.div layoutId="navActive" className="absolute -bottom-[16px] md:-bottom-[20px] h-[1px] w-[140%] bg-[#B89B5E]" />}
              </button>
            ))}
          </div>

        </div>
      </header>

      {/* Main Content (Padding updated to clear the taller header) */}
      <main className="pt-[160px] md:pt-[220px]">
        <AnimatePresence mode="wait">
          
         {step === 1 && (
            <motion.section key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              
             {/* CINEMATIC HERO SECTION (FORCED STACKING) */}
              <div className="relative w-full min-h-[70vh] flex items-center justify-center pt-[60px] pb-[80px] mb-[80px] md:mb-[120px] -mt-[40px] overflow-hidden bg-[#080D19]">
                
                {/* LAYER 1: THE IMAGE (The Base) */}
                <div className="absolute inset-0 z-[1] pointer-events-none">
                  <motion.div 
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.4 }}
                    transition={{ duration: 2.5, ease: "easeOut" }}
                    className="w-full h-full"
                  >
                    <img 
                      src="/skyline.jpg" 
                      alt="Nairobi Institutional Backdrop" 
                      className="w-full h-full object-cover object-center"
                    />
                  </motion.div>
                </div>

                {/* LAYER 2: THE GRADIENT SHIELDS (The Middle) */}
                {/* This stops the image from looking like a cheap photo and makes it look like 'Atmosphere' */}
                <div className="absolute inset-0 z-[2] pointer-events-none bg-gradient-to-b from-[#080D19] via-transparent to-[#080D19]"></div>
                <div className="absolute inset-0 z-[2] pointer-events-none bg-[#080D19]/30"></div>

                {/* LAYER 3: THE CONTENT (The Top) */}
                <div className="relative z-[10] max-w-[1100px] w-full px-[24px] md:px-[40px] text-center">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 1, delay: 0.5 }}
                  >
                    <p className="font-mono text-[10px] tracking-[0.5em] uppercase text-[#B89B5E] mb-[24px]">
                      Private Institutional Access
                    </p>
                    <h1 className="font-serif text-[clamp(40px,6vw,84px)] font-light leading-[1.1] text-[#FDFBF7] tracking-[-0.02em] mb-[32px]">
                      Real Estate Acquisition: <br/>
                      <span className="italic text-[#94A3B8] opacity-80">The Institutional Path.</span>
                    </h1>
                    <p className="text-[14px] md:text-[16px] text-[#94A3B8] max-w-[750px] mx-auto leading-[1.8] font-light">
                      Purchasing a built property — apartment, penthouse, or villa — involves distinct legal, structural, and management due diligence steps beyond a standard title search.
                    </p>
                  </motion.div>
                </div>

              </div>

              {/* TIGHTER FOCUS-BLUR INDEX */}
              <div className="max-w-[1200px] mx-auto px-[24px] md:px-[40px] mb-[120px]">
                <div className="mb-10 flex justify-between items-end border-b border-[#1E293B] pb-4">
                  <h2 className="font-serif text-[24px] md:text-[32px] text-[#FDFBF7] font-light tracking-tight">The Acquisition Index</h2>
                  <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#B89B5E] hidden md:block">08 Mandatory Steps</p>
                </div>
                
                <div className="relative group/list flex flex-col gap-[4px]">
                  {[
                    { n: '01', t: 'Verify Title via Ardhisasa', d: 'Run a title search on Ardhisasa (Ministry of Lands). For apartments, confirm a registered Sectional Title under the Sectional Properties Act 2020 — not merely an allocation letter. Verify charges and cautions.', tag: 'Sectional Properties Act 2020' },
                    { n: '02', t: 'Engage Conveyancing Advocate', d: 'Appoint an LSK-registered advocate specialising in residential conveyancing. Fees are regulated (typically 1.25%). Never use the developer\'s advocate as your sole representation.', tag: 'Law Society of Kenya' },
                    { n: '03', t: 'Execute Sale Agreement (SPA)', d: 'Review the SPA for unit specifics, parking, and completion clauses. A 10% deposit must be held in the advocate\'s regulated client account, never transferred to the developer\'s operational account.', tag: 'Advocates Accounts Rules' },
                    { n: '04', t: 'Obtain Occupation Certificate (OC)', d: 'Demand the Occupation Certificate issued by the County Government confirming habitability. A property without a valid OC is technically illegal to occupy and a bank will not finance it.', tag: 'Physical Planning Act 2019' },
                    { n: '05', t: 'Structural & Snagging Inspection', d: 'Hire an independent structural engineer and quantity surveyor. Request a snagging report cataloguing defects before final payment. For assets >KES 35M, require an M&E systems audit.', tag: 'Engineers Board of Kenya' },
                    { n: '06', t: 'Review Management & By-Laws', d: 'Audit the management company under the Sectional Properties Act. Review service charge schedules, reserve fund balances, building insurance, and by-laws governing sub-letting and pets.', tag: 'Management Audit' },
                    { n: '07', t: 'Clearance & Stamp Duty', d: 'Obtain Land Rent, Land Rates, and Service Charge Clearance Certificates. Settle Stamp Duty at 4% via KRA iTax based on the Chief Government Valuer\'s assessment.', tag: 'Stamp Duty Act · KRA iTax' },
                    { n: '08', t: 'Lodge Transfer of Title', d: 'Lodge the Transfer Instrument with the original title and clearances. The Registrar issues a new Sectional Title in your name (30–90 days). Cross-check details against the digital record.', tag: 'Land Registration Act 2012' }
                  ].map((item, index) => (
                    <div 
                      key={item.n} 
                      onMouseEnter={() => setActiveStepHover(index)}
                      onMouseLeave={() => setActiveStepHover(null)}
                      className={`relative p-[20px] md:p-[28px] bg-[#121A2F] border border-[#1E293B] flex flex-col md:flex-row gap-[16px] md:gap-[24px] items-start transition-all duration-[600ms] ease-[cubic-bezier(0.33,1,0.68,1)] overflow-hidden rounded-[2px]
                        ${activeStepHover !== null && activeStepHover !== index ? 'opacity-30 blur-[4px] scale-[0.99]' : 'opacity-100 scale-100 luxury-shadow z-10 hover:bg-[#162038] hover:border-[#B89B5E]'}
                      `}
                    >
                      {/* Scaled down watermark */}
                      <div className="absolute left-0 md:left-4 top-1/2 -translate-y-1/2 font-serif text-[80px] md:text-[120px] text-[#FDFBF7] opacity-[0.02] select-none pointer-events-none italic transition-transform duration-1000 group-hover:translate-x-4">
                         {item.n}
                      </div>

                      <div className="md:w-[10%] pt-1 z-10">
                         <span className={`font-serif text-[24px] md:text-[32px] leading-none transition-colors duration-500 ${activeStepHover === index ? 'text-[#B89B5E]' : 'text-[#94A3B8]'}`}>
                           {item.n}
                         </span>
                      </div>
                      <div className="w-full md:w-[65%] z-10">
                         <h4 className="font-serif text-[18px] md:text-[20px] text-[#FDFBF7] mb-2 font-medium tracking-tight">{item.t}</h4>
                         <p className="text-[12px] md:text-[13px] text-[#94A3B8] leading-[1.6] font-light">{item.d}</p>
                      </div>
                      <div className="w-full md:w-[25%] flex justify-start md:justify-end mt-2 md:mt-0 z-10">
                         <span className="font-mono text-[8px] tracking-[0.2em] text-[#B89B5E] uppercase border border-[#1E293B] px-3 py-1.5 rounded-[2px] bg-[#080D19]">
                           {item.tag}
                         </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* COMPACT FORENSIC DOSSIER */}
              <div className="bg-[#03060C] py-[80px] md:py-[100px] px-[24px] md:px-[40px] relative overflow-hidden text-[#FDFBF7] border-y border-[#1E293B]">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#1E293B 1px, transparent 1px), linear-gradient(90deg, #1E293B 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                
                <div className="max-w-[1200px] mx-auto relative z-10">
                  <div className="mb-[60px] md:mb-[80px] flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#1E293B] pb-8 gap-6">
                    <div>
                      <p className="font-mono text-[9px] tracking-[0.4em] uppercase text-[#B89B5E] mb-[16px] flex items-center gap-3">
                        <span className="w-2 h-2 bg-[#8A2525] rounded-full animate-pulse"></span> Classified Advisory
                      </p>
                      <h2 className="font-serif text-[28px] md:text-[40px] text-[#FDFBF7] font-light tracking-tight leading-tight">Immediate Red Flags</h2>
                    </div>
                    <p className="text-[12px] md:text-[13px] text-[#94A3B8] font-mono uppercase tracking-[0.1em] max-w-[300px] text-left md:text-right">
                      Identification of these warrants an immediate halt to capital deployment.
                    </p>
                  </div>

                  <div className="columns-1 md:columns-2 gap-[24px] space-y-[24px]">
                    {[
                      { t: 'Allotment Letters Only', d: 'Agreements for sale or allotment letters do not constitute legal ownership under Kenyan law. Insist on a registered Sectional Title under the Sectional Properties Act 2020.' },
                      { t: 'Missing Occupation Certificate', d: 'A building without a valid OC from the county government is illegal to occupy and unmortgageable. Never release final payment before the OC is in hand.' },
                      { t: 'Undisclosed Service Charges', d: 'Hidden monthly fees (KES 50k–200k+) dramatically alter the true cost of ownership and rental yield calculations. Demand a full written breakdown.' },
                      { t: 'Encumbered Title Record', d: 'If the Ardhisasa search reveals a bank charge or caution, the unit cannot be transferred cleanly. Demand written evidence of discharge from the financier.' },
                      { t: 'No Established Reserve Fund', d: 'A luxury development without audited accounts and a funded reserve account for future capital repairs is a serious liability, leading to rapid building deterioration.' },
                      { t: 'Plan Deviations & Subdivisions', d: 'Physically measure the unit against the registered floor plan. Discrepancies >5% indicate illegal internal subdivisions or encroachment into common areas.' },
                      { t: 'Identity / Deed Discrepancies', d: 'The registered owner\'s full name and ID on the sectional title must exactly match the seller\'s ID. Any discrepancy indicates potential impersonation or fraud.' },
                      { t: 'Unlicensed Intermediaries', d: 'An unlicensed agent or unregistered developer offers zero regulatory recourse if the deal collapses. Verify EARB and NCA registration before paying any fee.' }
                    ].map((item, i) => (
                      <div key={i} className="break-inside-avoid relative group p-[24px] md:p-[32px] bg-[#080D19] border border-[#1E293B] hover:border-[#8A2525] hover:bg-[#0B0F1A] transition-all duration-500 cursor-crosshair rounded-[2px]">
                        <div className="absolute top-0 left-0 w-0 h-[2px] bg-[#8A2525] group-hover:w-full transition-all duration-[800ms] ease-out shadow-[0_0_10px_#8A2525]"></div>
                        <div className="flex justify-between items-start mb-4">
                          <span className="font-mono text-[9px] text-[#94A3B8] group-hover:text-[#B89B5E] transition-colors"> RED FLAG_{i+1}</span>
                          <span className="text-[#8A2525] opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[9px] tracking-widest uppercase">Critical Risk</span>
                        </div>
                        <h4 className="font-serif text-[18px] md:text-[20px] text-[#FDFBF7] mb-2 font-light leading-tight group-hover:text-[#FDFBF7] transition-colors">{item.t}</h4>
                        <p className="text-[12px] md:text-[13px] text-[#94A3B8] leading-[1.6] font-light transition-colors">{item.d}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-[60px] pb-[40px]">
                 <MagneticButton onClick={() => goToStep(2)} className="w-full md:w-auto px-[50px] py-[20px] bg-[#FDFBF7] text-[#080D19] rounded-[2px] font-mono text-[10px] tracking-[0.4em] uppercase hover:bg-[#B89B5E] hover:text-[#FDFBF7] transition-colors duration-500 shadow-xl">
                   Enter Portfolio Collection
                 </MagneticButton>
              </div>

            </motion.section>
          )}

          {/* STEP 2: PORTFOLIO */}
          {step === 2 && (
            <motion.section key="s2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={luxuryTransition} className="max-w-[1400px] mx-auto px-[20px] md:px-[40px]">
              <div className="text-center mb-[60px] md:mb-[80px]">
                <p className="font-mono text-[9px] md:text-[10px] tracking-[0.5em] uppercase text-[#B89B5E] mb-[16px]">Step II — Selection</p>
                <h2 className="font-serif text-[clamp(32px,4.5vw,56px)] font-light text-[#FDFBF7]">The Prime Collection</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px] md:gap-[32px]">
                {PROPS.filter(p => !p.off || (step as number) === 5).map(p => (
                   <PropertyCard key={p.id} property={p} formatPrice={formatPrice} currency={currency} onSelect={(p) => { setSelectedProperty(p); goToStep(3); }} />
                ))}
              </div>
            </motion.section>
          )}
          
          {/* STEP 3: ANALYSIS */}
          {step === 3 && (
             <motion.section key="s3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={luxuryTransition} className="max-w-[800px] mx-auto px-[24px] md:px-[28px]">
               <div className="text-center mb-10">
                 <p className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-[#B89B5E] mb-[10px]">Step III — Analysis</p>
                 <h2 className="font-serif text-[32px] md:text-[36px] font-light text-[#FDFBF7]">Financial Projections</h2>
                 <p className="text-[13px] md:text-[14px] text-[#94A3B8] mt-3 italic font-serif tracking-wide">Analysing {selectedProperty?.name || "Premium Asset"}</p>
               </div>
               
               <div className="flex gap-[4px] p-[4px] rounded-[14px] bg-[#121A2F] border border-[#1E293B] mb-6 max-w-[500px] mx-auto">
                 <button onClick={() => {setMode('cash'); triggerHaptic(10);}} className={`flex-1 py-[12px] rounded-[10px] text-[10px] md:text-[11px] uppercase tracking-widest transition-all ${mode === 'cash' ? 'bg-[#FDFBF7] text-[#080D19] font-bold shadow-sm' : 'text-[#94A3B8]'}`}>Cash Purchase</button>
                 <button onClick={() => {setMode('mortgage'); triggerHaptic(10);}} className={`flex-1 py-[12px] rounded-[10px] text-[10px] md:text-[11px] uppercase tracking-widest transition-all ${mode === 'mortgage' ? 'bg-[#FDFBF7] text-[#080D19] font-bold shadow-sm' : 'text-[#94A3B8]'}`}>Mortgage (Leverage)</button>
               </div>

               <div className="flex gap-[4px] p-[4px] rounded-[10px] bg-[#121A2F] border border-[#1E293B] mb-8 max-w-[300px] mx-auto">
                 {[5, 10, 15].map(yr => (
                   <button 
                     key={yr} 
                     onClick={() => {setHorizon(yr as 5|10|15); triggerHaptic(8);}} 
                     className={`flex-1 py-[8px] rounded-[8px] text-[9px] uppercase tracking-widest transition-all ${horizon === yr ? 'bg-[#1E293B] text-[#FDFBF7] font-bold shadow-sm' : 'text-[#94A3B8]'}`}
                   >
                     {yr} YR
                   </button>
                 ))}
               </div>

               <div className="bg-[#121A2F] border border-[#1E293B] rounded-[2px] luxury-shadow mb-8 overflow-hidden">
                 <div className="p-6 md:p-8 border-b border-[#1E293B]">
                   <div className="flex justify-between items-end mb-6">
                     <div>
                       <p className="font-mono text-[8px] tracking-[0.2em] text-[#94A3B8] uppercase mb-1">{horizon}-Year Equity Projection</p>
                       <p className="font-serif text-[18px] md:text-[24px] text-[#FDFBF7]">{mode === 'cash' ? 'Linear Yield Growth' : 'Leveraged Appreciation'}</p>
                     </div>
                     <div className="text-right">
                       <p className="font-mono text-[8px] tracking-[0.2em] text-[#94A3B8] uppercase mb-1">Est. Net ROI</p>
                       <p className="font-serif text-[18px] md:text-[24px] text-[#B89B5E]">{mode === 'cash' ? '9.2% p.a.' : '18.4% p.a.'}</p>
                     </div>
                   </div>
                   
                   <div className="relative h-[150px] md:h-[180px] w-full border-b border-l border-[#1E293B] pt-4">
                     <div className="absolute -left-2 top-0 text-[8px] font-mono text-[#94A3B8] -translate-x-full">High</div>
                     <div className="absolute -left-2 bottom-0 text-[8px] font-mono text-[#94A3B8] -translate-x-full">Low</div>
                     <svg viewBox="0 0 500 180" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                       <line x1="0" y1="45" x2="500" y2="45" stroke="#1E293B" strokeWidth="1" strokeDasharray="4 4" />
                       <line x1="0" y1="90" x2="500" y2="90" stroke="#1E293B" strokeWidth="1" strokeDasharray="4 4" />
                       <line x1="0" y1="135" x2="500" y2="135" stroke="#1E293B" strokeWidth="1" strokeDasharray="4 4" />
                       
                       <motion.path d={mode === 'cash' ? activeChart.cash : activeChart.mort} fill="none" stroke="#B89B5E" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1, d: mode === 'cash' ? activeChart.cash : activeChart.mort }} transition={{ duration: 1.2, ease: "easeInOut" }} />
                       <motion.circle initial={false} animate={{ cx: 500, cy: mode === 'cash' ? activeChart.cEnd : activeChart.mEnd }} r="4" fill="#FDFBF7" stroke="#B89B5E" strokeWidth="2" transition={{ duration: 1.2, ease: "easeInOut" }} />
                     </svg>
                     <div className="flex justify-between mt-2 text-[8px] font-mono text-[#94A3B8]">
                       <span>Year 1</span><span>Year {Math.ceil(horizon/2)}</span><span>Year {horizon}</span>
                     </div>
                   </div>
                 </div>

                 <div className="p-6 md:p-8 bg-[#080D19]">
                   {mode === 'cash' ? (
                     <div className="space-y-4">
                       <div className="flex justify-between py-2 border-b border-[#1E293B] font-serif text-[16px] md:text-[18px]"><span>Net Annual Yield</span><span className="text-[#B89B5E]">9.2%</span></div>
                       <div className="flex justify-between py-2 border-b border-[#1E293B] font-serif text-[16px] md:text-[18px]"><span>Projected Annual Income</span><span>{formatPrice((selectedProperty?.kes || 65e6) * 0.092)}</span></div>
                       <p className="text-[11px] md:text-[12px] text-[#94A3B8] leading-[1.8] pt-2 font-light italic">"Cash acquisitions in Nairobi maximize recurring income by eliminating 15% debt servicing costs."</p>
                     </div>
                   ) : (
                     <div className="space-y-4">
                       <div className="flex justify-between py-2 border-b border-[#1E293B] font-serif text-[16px] md:text-[18px]"><span>Reference Rate</span><span className="text-[#8A2525]">15.0%</span></div>
                       <div className="flex justify-between py-2 border-b border-[#1E293B] font-serif text-[16px] md:text-[18px]"><span>Equity Required (30%)</span><span>{formatPrice((selectedProperty?.kes || 65e6) * 0.3)}</span></div>
                       <p className="text-[11px] md:text-[12px] text-[#94A3B8] leading-[1.8] pt-2 font-light italic">"Leverage amplifies long-term capital appreciation despite higher entry costs, resulting in exponential equity growth over the selected {horizon}-year cycle."</p>
                     </div>
                   )}
                 </div>
               </div>

               <div className="mb-12">
                 <button 
                   onClick={handleDownload}
                   disabled={dlState !== 'idle'}
                   className={`w-full py-[16px] border border-[#1E293B] rounded-[2px] font-mono text-[9px] md:text-[10px] tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-3 ${dlState === 'idle' ? 'bg-[#121A2F] text-[#FDFBF7] hover:bg-[#1E293B]' : 'bg-[#080D19] text-[#94A3B8]'}`}
                 >
                   {dlState === 'idle' && <>[ PDF ] Generate Investment Memorandum</>}
                   {dlState === 'compiling' && <><span className="animate-spin font-serif text-[14px] leading-none">⚬</span> Compiling Financial Data...</>}
                   {dlState === 'watermarking' && <>[ SECURE ] Applying Leentone Watermark...</>}
                   {dlState === 'ready' && <><span className="text-[#1A6A45] font-serif text-[12px]">✓</span> Memorandum Saved to Device</>}
                 </button>
               </div>

               <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-t border-[#1E293B] pt-8">
                 <button onClick={() => goToStep(2)} className="font-mono text-[10px] tracking-widest uppercase text-[#94A3B8] hover:text-[#B89B5E]">← Back to Collection</button>
                 <button onClick={() => goToStep(4)} className="w-full md:w-auto px-10 py-4 bg-[#B89B5E] text-[#080D19] rounded-[2px] font-mono text-[10px] tracking-widest uppercase shadow-lg hover:bg-[#FDFBF7] transition-colors">Inquire Access</button>
               </div>
             </motion.section>
          )}

          {/* STEP 4: INQUIRY */}
          {step === 4 && (
             <motion.section key="s4" className="max-w-[600px] mx-auto pt-4 md:pt-10 px-[20px]">
                <div className="text-center mb-10">
                  <p className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-[#B89B5E] mb-[10px]">Step IV — Engagement</p>
                  <h2 className="font-serif text-[32px] md:text-[36px] font-light text-[#FDFBF7]">Strategic Consultation</h2>
                </div>
                <InquiryForm onComplete={() => goToStep(5)} triggerHaptic={triggerHaptic} />
             </motion.section>
          )}

          {/* STEP 5: PRIVATE INVENTORY */}
          {step === 5 && (
            <motion.section key="s5" className="max-w-[1400px] mx-auto px-[20px] md:px-[40px]">
               <div className="text-center mb-[60px] md:mb-[80px]">
                <p className="font-mono text-[9px] md:text-[10px] tracking-[0.5em] uppercase text-[#B89B5E] mb-[16px]">Step V — Intelligence</p>
                <h2 className="font-serif text-[clamp(32px,4.5vw,56px)] font-light text-[#FDFBF7]">Off-Market Portfolio</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px] md:gap-[32px]">
                {PROPS.filter(p => p.off).map(p => <PropertyCard key={p.id} property={p} formatPrice={formatPrice} currency={currency} onSelect={() => {}} />)}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}