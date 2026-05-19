'use client';

import { useState } from 'react';
import { Trash2, RefreshCcw } from 'lucide-react';
import { deleteProduct } from '@/actions/productActions';
import toast from 'react-hot-toast';

export function DeleteProductButton({ id }: { id: number }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    setLoading(true);
    const res = await deleteProduct(id);
    if (res.success) {
      toast.success('Product deleted successfully');
    } else {
      toast.error(res.error || 'Failed to delete product');
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      className={`p-3 rounded-xl transition-all ${
        loading ? 'bg-slate-100 text-slate-300' : 'hover:bg-red-50 text-slate-400 hover:text-red-500'
      }`}
      title="Delete Product"
    >
      {loading ? <RefreshCcw size={18} className="animate-spin" /> : <Trash2 size={18} />}
    </button>
  );
}
