import prisma from '@/lib/prisma';
import { Flame, Star, Package } from 'lucide-react';
import DealToggle from '@/components/Admin/DealToggle';

export default async function DealsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: { createdAt: 'desc' }
  });
  
  return (
    <div className="space-y-12">
      <header>
        <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-[10px] mb-2 block">Marketing Controls</span>
        <h1 className="text-5xl font-black tracking-tight text-slate-900">Trending & Deals</h1>
        <p className="text-slate-400 mt-4 max-w-2xl font-medium">Promote products to the home page "Trending Deals" or "Deal of the Week" sections.</p>
      </header>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <th className="p-[10px_16px]">Product</th>
              <th className="p-[10px_16px]">Category</th>
              <th className="p-[10px_16px] text-center">Status</th>
              <th className="p-[10px_16px] text-right">Marketing Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => {
              const images = Array.isArray(product.images) ? product.images : JSON.parse(product.images as string);
              const firstImage = images.length > 0 ? images[0] : null;

              return (
                <tr key={product.id} className="group hover:bg-slate-50 transition-colors">
                  <td className="p-[10px_16px]">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center">
                        {firstImage ? (
                          <div 
                            className="w-full h-full"
                            dangerouslySetInnerHTML={{ 
                              __html: `<img src="${firstImage}" alt="" class="w-full h-full object-cover" />` 
                            }} 
                          />
                        ) : (
                          <Package className="text-slate-300" size={20} />
                        )}
                      </div>
                      <div className="max-w-[500px]" >
                        <h4 className="font-bold text-slate-900 text-sm leading-tight truncate">{product.name}</h4>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5 truncate">/{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-[10px_16px]">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{product.category.name}</span>
                  </td>
                  <td className="p-[10px_16px] text-center">
                    <div className="flex justify-center gap-1">
                      {product.isTrending && (
                        <span className="text-[9px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">Trending</span>
                      )}
                      {product.isDealOfTheWeek && (
                        <span className="text-[9px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">Deal</span>
                      )}
                      {!product.isTrending && !product.isDealOfTheWeek && (
                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-300 bg-slate-50 px-2 py-0.5 rounded-md">Regular</span>
                      )}
                    </div>
                  </td>
                  <td className="p-[10px_16px]">
                    <div className="flex justify-end">
                      <DealToggle 
                        id={product.id} 
                        isTrending={Boolean(product.isTrending)} 
                        isDealOfTheWeek={Boolean(product.isDealOfTheWeek)} 
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}