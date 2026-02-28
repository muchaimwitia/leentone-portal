'use client';

import { useState, useEffect } from 'react';
import { Currency, Property } from '@/types/investment';

export const useInvestmentJourney = () => {
  const [step, setStep] = useState<number>(1);
  const [currency, setCurrency] = useState<Currency>('KES');
  const [exchangeRate, setExchangeRate] = useState<number>(0.0077);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/KES')
      .then(res => res.json())
      .then(data => { if (data.result === 'success' && data.rates?.USD) setExchangeRate(data.rates.USD); })
      .catch(() => {});
  }, []);

  const formatPrice = (kes: number) => {
    if (currency === 'KES') return kes >= 1e6 ? `KES ${(kes / 1e6).toFixed(0)}M` : `KES ${kes.toLocaleString()}`;
    const usd = kes * exchangeRate;
    return usd >= 1e6 ? `$${(usd / 1e6).toFixed(2)}M` : `$${usd.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  const triggerHaptic = (pattern: number | number[]) => {
    try { if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(pattern); } catch (e) {}
  };

  const goToStep = (target: number) => {
    if (target < 1 || target > 5) return;
    setStep(target);
    triggerHaptic([10, 40, 10]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return { step, goToStep, currency, setCurrency, formatPrice, selectedProperty, setSelectedProperty, triggerHaptic };
};