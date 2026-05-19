'use client';

import { useState, useEffect } from 'react';
import { getPlatforms, createPlatform, updatePlatform, updatePlatformVisibility, deletePlatform, syncPlatforms } from '@/actions/platformActions';
import toast from 'react-hot-toast';
import { Plus, Trash2, Loader2, CheckCircle2, XCircle, RefreshCw, Edit2, X, Save, Globe } from 'lucide-react';

export default function PlatformsPage() {
  const [platforms, setPlatforms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', logo: '', defaultLink: '' });

  useEffect(() => {
    fetchPlatforms();
  }, []);

  const fetchPlatforms = async () => {
    setLoading(true);
    const data = await getPlatforms();
    setPlatforms(data || []);
    setLoading(false);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: '', logo: '', defaultLink: '' });
  };

  const handleAutoLogo = () => {
    if (!formData.defaultLink.trim()) return toast.error('Enter Platform Link first');
    try {
      const url = new URL(formData.defaultLink);
      const faviconUrl = `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=128`;
      setFormData({ ...formData, logo: faviconUrl });
      toast.success('Logo fetched!');
    } catch (e) {
      toast.error('Invalid link format');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    setSubmitting(true);
    const res = editingId 
      ? await updatePlatform(editingId, { ...formData, name: formData.name.trim() })
      : await createPlatform({ ...formData, name: formData.name.trim() });

    if (res.success) {
      toast.success(editingId ? 'Updated!' : 'Added!');
      resetForm();
      fetchPlatforms();
    } else {
      toast.error(res.error || 'Failed to save');
    }
    setSubmitting(false);
  };

  const handleSync = async () => {
    setSubmitting(true);
    const res = await syncPlatforms();
    if (res.success) {
      toast.success(`Sync complete! Registered ${res.addedCount} platforms.`);
      fetchPlatforms();
    } else {
      toast.error(res.error || 'Sync failed');
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-10 py-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Platform Management</h1>
          <p className="text-slate-500 font-medium text-sm">Control visibility, logos, and links for affiliate platforms.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleSync} disabled={submitting} className="flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-blue-100 disabled:opacity-50">
            <RefreshCw size={14} className={submitting ? 'animate-spin' : ''} /> Sync from Products
          </button>
          <button onClick={fetchPlatforms} className="p-3 text-slate-400 border border-slate-100 rounded-2xl hover:bg-slate-50">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Clean Form Design */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">
            {editingId ? 'Modify Platform' : 'Configure New Platform'}
          </h2>
          {editingId && (
            <button onClick={resetForm} className="text-red-500 text-xs font-bold flex items-center gap-1">
              <X size={14} /> Cancel
            </button>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Platform Name</label>
              <input type="text" placeholder="e.g. Amazon" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 outline-none focus:bg-white focus:border-blue-500 font-bold text-slate-900" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Platform Link</label>
              <input type="url" placeholder="https://amazon.in" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 outline-none focus:bg-white focus:border-blue-500 font-bold text-slate-900" value={formData.defaultLink} onChange={(e) => setFormData({ ...formData, defaultLink: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Logo URL</label>
              <div className="flex gap-2 items-center relative">
                <div className="relative flex-1">
                  <input type="text" placeholder="/logo.png" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 pl-12 outline-none focus:bg-white focus:border-blue-500 font-bold text-slate-900 text-sm" value={formData.logo} onChange={(e) => setFormData({ ...formData, logo: e.target.value })} />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white border border-slate-200 overflow-hidden flex items-center justify-center p-1">
                    <img src={formData.logo || '/placeholder-logo-vectors.svg'} alt="L" className="w-full h-full object-contain" onError={(e) => (e.currentTarget.src = '/placeholder-logo-vectors.svg')} />
                  </div>
                </div>
                <button type="button" onClick={handleAutoLogo} className="px-5 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest">Auto</button>
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" disabled={submitting} className={`px-12 py-4 rounded-xl font-black uppercase tracking-widest text-xs text-white shadow-lg ${editingId ? 'bg-amber-500' : 'bg-slate-900'} disabled:opacity-50 flex items-center gap-2`}>
              {submitting ? <Loader2 size={16} className="animate-spin" /> : editingId ? <Save size={16} /> : <Plus size={16} />}
              {editingId ? 'Update Platform' : 'Publish Platform'}
            </button>
          </div>
        </form>
      </div>

      {/* Stable Grid (No Animations) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? Array(3).fill(0).map((_, i) => <div key={i} className="bg-slate-50 h-40 rounded-3xl border border-slate-100" />) : platforms.map((p) => (
          <div key={p.id} className={`bg-white p-6 rounded-3xl border ${p.isVisible ? 'border-slate-100 shadow-sm' : 'border-slate-100 opacity-60 grayscale'}`}>
            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center border border-slate-100 bg-white overflow-hidden p-2">
                <img src={p.logo || '/placeholder-logo-vectors.svg'} alt={p.name} className="w-full h-full object-contain" onError={(e) => (e.currentTarget.src = '/placeholder-logo-vectors.svg')} />
              </div>
              <div className="flex gap-1">
                <button onClick={() => { setEditingId(p.id); setFormData({ name: p.name, logo: p.logo || '', defaultLink: p.defaultLink || '' }); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="p-3 text-slate-300 hover:text-blue-600 rounded-xl hover:bg-blue-50 transition-colors"><Edit2 size={18} /></button>
                <button onClick={async () => { await updatePlatformVisibility(p.id, !p.isVisible); fetchPlatforms(); }} className={`p-3 rounded-xl transition-colors ${p.isVisible ? 'text-green-500 hover:bg-green-50' : 'text-slate-300 hover:bg-slate-100'}`}>{p.isVisible ? <CheckCircle2 size={20} /> : <XCircle size={20} />}</button>
                <button onClick={async () => { if(confirm('Remove this platform?')) { await deletePlatform(p.id); fetchPlatforms(); } }} className="p-3 text-slate-200 hover:text-red-500 rounded-xl hover:bg-red-50 transition-colors"><Trash2 size={18} /></button>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-1">{p.name}</h3>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{p.productCount} Products Found</span>
                {p.defaultLink && (
                  <a href={p.defaultLink} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 font-semibold flex items-center gap-1 hover:underline"><Globe size={14} /> Visit</a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
