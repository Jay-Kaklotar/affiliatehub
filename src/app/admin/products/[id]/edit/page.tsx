import prisma from '@/lib/prisma';
import ProductForm from '@/components/Admin/ProductForm';
import { notFound } from 'next/navigation';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = parseInt(id);

  const products: any[] = await prisma.$queryRaw`SELECT * FROM Product WHERE id = ${productId} LIMIT 1`;
  const product = products[0];

  if (!product) notFound();

  // Manual fetch offers and category since using raw SQL
  product.offers = await prisma.offer.findMany({ where: { productId: product.id } });
  product.images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
  product.features = typeof product.features === 'string' ? JSON.parse(product.features) : product.features;

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
        <h1 className="text-5xl font-black tracking-tight text-slate-900">Edit Product</h1>
        <p className="text-slate-400 mt-4 max-w-2xl">Updating: <span className="text-slate-900 font-bold">{product.name}</span></p>
      </header>
 
      <ProductForm initialData={product} categories={categories} platforms={platforms} />

    </div>
  );
}
