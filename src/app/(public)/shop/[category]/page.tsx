import Link from "next/link";
import { getProductsByCategory, getAllCategories } from "@/lib/db";

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((cat) => ({
    category: cat.slug,
  }));
}
import { notFound } from "next/navigation";
import { Icons } from "@/components/Icons";
import { Metadata } from "next";
import ProductCard from "@/components/Product/ProductCard";

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const categories = await getAllCategories();
  const currentCategory = categories.find(c => c.slug === category);
  if (!currentCategory) return { title: "Category Not Found" };

  return {
    title: `Best ${currentCategory.name} Deals & Recommendations | AffiliateHub`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const allCategories = await getAllCategories();
  const currentCategory = allCategories.find((cat) => cat.slug === category);

  if (!currentCategory) notFound();

  const products = await getProductsByCategory(category);

  const renderIcon = (iconName: string) => {
    const Icon = Icons[iconName as keyof typeof Icons] || Icons.HomeOffice;
    return <Icon aria-hidden="true" />;
  };

  return (
    <div className="min-h-screen py-24 bg-white">
      <div className="container">
        {/* SEO-Friendly Header with Professional Breadcrumbs */}
        <header className="mb-16">
          <nav aria-label="Breadcrumb" className="mb-12 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/shop" className="hover:text-blue-600 transition-colors">Shop</Link>
            <span aria-hidden="true">/</span>
            <span className="text-slate-900">{currentCategory.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
            <div className="w-16 h-16 md:w-24 md:h-24 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center text-3xl md:text-5xl shadow-sm">
              {renderIcon(currentCategory.icon)}
            </div>
            <div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-slate-900">
                Top Rated <span className="text-blue-600">{currentCategory.name}</span>
              </h1>
            </div>
          </div>
        </header>

        {/* Semantic Product List */}
        <section aria-label={`${currentCategory.name} products grid`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
