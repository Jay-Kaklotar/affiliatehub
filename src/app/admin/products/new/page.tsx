import prisma from '@/lib/prisma';
import ProductForm from '@/components/Admin/ProductForm';

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });

  const platforms = await prisma.platform.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="space-y-12">
      <header>
        <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-[10px] mb-2 block">Catalog</span>
        <h1 className="text-5xl font-black tracking-tight text-slate-900">New Product</h1>
        <p className="text-slate-400 mt-4 max-w-2xl">Fill in the details below to publish a new affiliate product. Make sure to add at least one offer link.</p>
      </header>
 
      <ProductForm categories={categories} platforms={platforms} />

    </div>
  );
}
