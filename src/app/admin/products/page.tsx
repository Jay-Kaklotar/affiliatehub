import prisma from '@/lib/prisma';
import { Package, Plus, Search, Edit3, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { DeleteProductButton } from '@/components/Admin/DeleteProductButton';

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      offers: true,
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <div>
          <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-[10px] mb-2 block">Inventory Management</span>
          <h1 className="text-5xl font-black tracking-tight text-slate-900">Products</h1>
        </div>
        <Link href="/admin/products/new" className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">
          <Plus size={18} />
          <span>Add Product</span>
        </Link>
      </header>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <th className="p-[10px_16px]">Product Details</th>
              <th className="p-[10px_16px]">Category</th>
              <th className="p-[10px_16px]">Offers</th>
              <th className="p-[10px_16px]">Min Price</th>
              <th className="p-[10px_16px]">Rating</th>
              <th className="p-[10px_16px]">Stock</th>
              <th className="p-[10px_16px]">Status</th>
              <th className="p-[10px_16px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => {
              const images = Array.isArray(product.images) ? product.images : JSON.parse(product.images as string);
              const firstImage = images.length > 0 ? images[0] : null;
              const isInStock = product.offers.some(o => o.isAvailable);
              
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
                      <div className="max-w-[200px]">
                        <h3 className="font-bold text-slate-900 text-sm truncate">{product.name}</h3>
                        <p className="text-[10px] text-slate-400 font-medium">/{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-[10px_16px]">
                    <span className="text-xs font-bold text-slate-600">{product.category.name}</span>
                  </td>
                  <td className="p-[10px_16px]">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{product.offers.length}</span>
                        <div className="flex -space-x-1.5">
                            {product.offers.slice(0, 3).map((offer, i) => (
                                <div key={i} className="w-4 h-4 rounded-full border border-white bg-slate-50 overflow-hidden">
                                    <img src={offer.logo} alt="" className="w-full h-full object-contain" />
                                </div>
                            ))}
                        </div>
                    </div>
                  </td>
                  <td className="p-[10px_16px]">
                    <span className="text-sm font-black text-slate-900">₹{product.price.toLocaleString('en-IN')}</span>
                  </td>
                  <td className="p-[10px_16px]">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-amber-500">{product.rating}</span>
                      <span className="text-[10px] text-amber-400 font-bold">★</span>
                    </div>
                  </td>
                  <td className="p-[10px_16px]">
                    {isInStock ? (
                      <span className="text-[9px] font-black uppercase tracking-wider text-green-600 bg-green-50 px-2 py-0.5 rounded-md w-fit">In Stock</span>
                    ) : (
                      <span className="text-[9px] font-black uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded-md w-fit">Out of Stock</span>
                    )}
                  </td>
                  <td className="p-[10px_16px]">
                    <div className="flex flex-wrap gap-1 max-w-[120px]">
                      {product.isTrending && (
                        <span className="text-[9px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md w-fit">Trending</span>
                      )}
                      {product.isDealOfTheWeek && (
                        <span className="text-[9px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md w-fit">Deal</span>
                      )}
                      {!product.isTrending && !product.isDealOfTheWeek && (
                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-300 bg-slate-50 px-2 py-0.5 rounded-md w-fit">Standard</span>
                      )}
                    </div>
                  </td>
                  <td className="p-[10px_16px]">
                    <div className="flex justify-end gap-2">
                      <Link 
                        href={`/admin/products/${product.id}/edit`}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Edit3 size={16} />
                      </Link>
                      <DeleteProductButton id={product.id} />
                    </div>
                  </td>
                </tr>
              );
            })}

            {products.length === 0 && (
              <tr>
                <td colSpan={8} className="p-20 text-center">
                  <Package size={48} className="mx-auto text-slate-200 mb-4" />
                  <p className="text-slate-400 font-bold">No products found.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
