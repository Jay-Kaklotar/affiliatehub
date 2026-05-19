import Link from "next/link";
import { getAllCategories, getAllProducts, getAllPlatforms } from "@/lib/db";
import { Metadata } from "next";
import FilterableShop from "@/components/Shop/FilterableShop";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Shop All Products | Verified Affiliate Deals | AffiliateHub",
  description: "Browse our complete catalog of curated tech, home, and lifestyle products with advanced filtering. Best prices from Amazon, Flipkart, and more.",
};

export default async function ShopPage() {
  const categories = await getAllCategories();
  const products = await getAllProducts();
  const platforms = await getAllPlatforms();

  return (

    <div className="min-h-screen py-24 bg-white">
      <div className="container">
        {/* Semantic Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-12">
          <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">
            Home
          </Link>
          <span className="mx-2 text-slate-200" aria-hidden="true">/</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">
            Shop All
          </span>
        </nav>

        <header className="mb-20">
          <span className="text-blue-600 font-black uppercase tracking-[0.4em] text-[10px] mb-6 block">Premium Curation</span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-tight text-slate-900">
            BuyBetter <span className="text-blue-600 italic">Verified</span> <span className="text-blue-600">Deals.</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl leading-relaxed max-w-2xl font-medium">
            Deals that passed our quality check. Use our advanced filters to find the best value for your setup upgrade.
          </p>
        </header>

        {/* Semantic Section for the Shop UI */}
        <section aria-label="Product listings with filters">
          <Suspense fallback={<div className="py-20 text-center font-black uppercase tracking-widest text-slate-400">Loading shop...</div>}>
            <FilterableShop products={products} categories={categories} platforms={platforms} />
          </Suspense>
        </section>
      </div>
    </div>
  );
}
