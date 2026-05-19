import prisma from '@/lib/prisma';
import { Layers, Plus, Tag, Trash2, FolderEdit } from 'lucide-react';
import Link from 'next/link';

import { DeleteCategoryButton } from '@/components/Admin/DeleteCategoryButton';

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <div>
          <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-[10px] mb-2 block">Organization System</span>
          <h1 className="text-5xl font-black tracking-tight text-slate-900">Categories</h1>
        </div>
        <Link href="/admin/categories/new" className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">
          <Plus size={18} />
          <span>New Category</span>
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-blue-100 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100 p-2">
                <img src={cat.icon} alt="" className="w-full h-full object-contain" />
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link href={`/admin/categories/${cat.id}/edit`} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-all">
                  <FolderEdit size={16} />
                </Link>
                <DeleteCategoryButton id={cat.id} name={cat.name} />
              </div>
            </div>
            
            <h3 className="text-xl font-black text-slate-900 mb-1">{cat.name}</h3>
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{cat.slug}</span>
                <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{cat._count.products} Products</span>
            </div>
          </div>
        ))}
        
        {/* Placeholder for adding new */}
        <Link href="/admin/categories/new" className="border-2 border-dashed border-slate-100 p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-300 hover:border-blue-200 hover:text-blue-400 transition-all gap-4 min-h-[200px]">
            <Plus size={40} strokeWidth={1} />
            <span className="font-bold text-sm uppercase tracking-widest">Create Category</span>
        </Link>
      </div>
    </div>
  );
}
