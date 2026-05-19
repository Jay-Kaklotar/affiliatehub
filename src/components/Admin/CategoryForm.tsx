'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createCategory, updateCategory } from '@/actions/categoryActions';
import { Save, Loader2, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface CategoryFormProps {
  initialData?: {
    id: number;
    name: string;
    slug: string;
    icon: string;
  };
}

export default function CategoryForm({ initialData }: CategoryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [preview, setPreview] = useState(initialData?.icon || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSlug(generateSlug(value));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    
    const res = initialData 
      ? await updateCategory(initialData.id, formData)
      : await createCategory(formData);

    if (res.success) {
      toast.success(initialData ? 'Category updated!' : 'Category created!');
      // router.push('/admin/categories'); 
      router.refresh();
      setLoading(false); // Reset loading state for both new and edit
    } else {
      toast.error(res.error || 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/30 space-y-10">
      <div className="space-y-8">
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Category Name</label>
          <input 
            name="name"
            required
            type="text" 
            defaultValue={initialData?.name}
            onChange={handleNameChange}
            placeholder="e.g. Home Office & Desk Setup"
            className="w-full p-5 bg-slate-50 border border-transparent rounded-2xl font-bold text-slate-900 focus:bg-white focus:border-blue-500 transition-all outline-none"
          />
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Slug (URL friendly)</label>
          <input 
            name="slug"
            required
            type="text" 
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. health-fitness"
            className="w-full p-5 bg-slate-50 border border-transparent rounded-2xl font-bold text-slate-900 focus:bg-white focus:border-blue-500 transition-all outline-none"
          />
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Upload Icon Image</label>
          <div className="flex flex-col md:flex-row items-center gap-8 p-8 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 group hover:border-blue-200 transition-all">
            <div className="w-24 h-24 bg-white rounded-[1.5rem] overflow-hidden border border-slate-100 flex items-center justify-center shrink-0 shadow-sm shadow-slate-200/50">
              {preview ? (
                <img src={preview} alt="Icon Preview" className="w-full h-full object-contain p-3" />
              ) : (
                <div className="flex flex-col items-center gap-1 text-slate-200 font-black">
                  <ImageIcon size={32} />
                  <span className="text-[8px] uppercase tracking-tighter">No Icon</span>
                </div>
              )}
            </div>
            
            <div className="flex-1 space-y-4 text-center md:text-left">
              <input 
                ref={fileInputRef}
                name="icon"
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 active:scale-95"
              >
                Choose Icon File
              </button>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                Recommended: Transparent PNG or SVG (512x512)
              </p>
            </div>
          </div>
        </div>
      </div>

      <button 
        disabled={loading}
        type="submit" 
        className="w-full bg-slate-900 text-white p-7 rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs shadow-2xl shadow-slate-900/10 hover:bg-slate-800 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
      >
        {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
        {loading ? 'Saving Changes...' : initialData ? 'Save Changes' : 'Publish Category'}
      </button>
    </form>
  );
}

