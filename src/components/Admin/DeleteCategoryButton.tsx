'use client';

import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteCategory } from '@/actions/categoryActions';
import toast from 'react-hot-toast';

export function DeleteCategoryButton({ id, name }: { id: number, name: string }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return;
    
    setLoading(true);
    const res = await deleteCategory(id);
    if (res.success) {
      toast.success('Category deleted successfully');
    } else {
      toast.error(res.error || 'Failed to delete category');
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      className={`p-2 rounded-lg transition-all ${
        loading ? 'text-slate-200' : 'text-slate-400 hover:text-red-500 hover:bg-red-50'
      }`}
      title="Delete Category"
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
    </button>
  );
}
