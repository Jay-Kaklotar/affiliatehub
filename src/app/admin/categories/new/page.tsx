import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import CategoryForm from '@/components/Admin/CategoryForm';

export default function NewCategoryPage() {
  return (
    <div className="space-y-12">
      <header className="flex items-center gap-6">
        <Link 
          href="/admin/categories" 
          className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-[10px] mb-1 block">Organization</span>
          <h1 className="text-5xl font-black tracking-tight text-slate-900">New Category</h1>
        </div>
      </header>

      <CategoryForm />
    </div>
  );
}
