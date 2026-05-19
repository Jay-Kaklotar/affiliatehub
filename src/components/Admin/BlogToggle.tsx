'use client';

import { useState } from 'react';
import { toggleBlogFeatured } from '@/actions/blogActions';
import toast from 'react-hot-toast';
import { Star } from 'lucide-react';

interface BlogToggleProps {
  id: number;
  isFeatured: boolean;
}

export default function BlogToggle({ id, isFeatured: initialFeatured }: BlogToggleProps) {
  const [featured, setFeatured] = useState(initialFeatured);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    const newStatus = !featured;
    const res = await toggleBlogFeatured(id, newStatus);
    if (res.success) {
      setFeatured(newStatus);
      toast.success(newStatus ? 'Set as Featured Article' : 'Removed from Featured');
    } else {
      toast.error('Failed to update status');
    }
    setLoading(false);
  };

  return (
    <button
      disabled={loading}
      onClick={handleToggle}
      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border flex items-center gap-2 ${
        featured 
          ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
          : 'bg-white border-slate-200 text-slate-400 hover:border-blue-600 hover:text-blue-600'
      }`}
    >
      <Star size={12} fill={featured ? 'currentColor' : 'none'} />
      <span>{featured ? 'Featured' : 'Regular'}</span>
    </button>
  );
}
