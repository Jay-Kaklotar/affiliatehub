'use client';

import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteProduct } from '@/actions/productActions';
import toast from 'react-hot-toast';

export function DeleteProductButton({ id }: { id: number }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product? All affiliate links will be removed too.')) return;
    
    setLoading(true);
    const res = await deleteProduct(id);
    if (res.success) {
      toast.success('Product removed');
    } else {
      toast.error('Failed to delete');
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all disabled:opacity-50"
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
    </button>
  );
}
