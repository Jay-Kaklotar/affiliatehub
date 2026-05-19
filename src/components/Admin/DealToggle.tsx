'use client';

import { useState } from 'react';
import { toggleTrending, toggleDealOfTheWeek } from '@/actions/productActions';
import toast from 'react-hot-toast';

interface DealToggleProps {
  id: number;
  isTrending: boolean;
  isDealOfTheWeek: boolean;
}

export default function DealToggle({ id, isTrending: initialTrending, isDealOfTheWeek: initialDeal }: DealToggleProps) {
  const [trending, setTrending] = useState(initialTrending);
  const [deal, setDeal] = useState(initialDeal);
  const [loading, setLoading] = useState(false);

  const handleTrendingToggle = async () => {
    setLoading(true);
    const newStatus = !trending;
    const res = await toggleTrending(id, newStatus);
    if (res.success) {
      setTrending(newStatus);
      toast.success(newStatus ? 'Added to Trending' : 'Removed from Trending');
    } else {
      toast.error('Failed to update status');
    }
    setLoading(false);
  };

  const handleDealToggle = async () => {
    setLoading(true);
    const newStatus = !deal;
    const res = await toggleDealOfTheWeek(id, newStatus);
    if (res.success) {
      setDeal(newStatus);
      toast.success(newStatus ? 'Set as Deal of the Week' : 'Removed from Deals');
    } else {
      toast.error('Failed to update status');
    }
    setLoading(false);
  };

  return (
    <div className="flex gap-2">
      <button
        disabled={loading}
        onClick={handleTrendingToggle}
        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border ${
          trending 
            ? 'bg-amber-600 border-amber-600 text-white shadow-sm' 
            : 'bg-white border-slate-200 text-slate-400 hover:border-amber-600 hover:text-amber-600'
        }`}
      >
        Trending
      </button>
      <button
        disabled={loading}
        onClick={handleDealToggle}
        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border ${
          deal 
            ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
            : 'bg-white border-slate-200 text-slate-400 hover:border-blue-600 hover:text-blue-600'
        }`}
      >
        Deal of Week
      </button>
    </div>
  );
}
