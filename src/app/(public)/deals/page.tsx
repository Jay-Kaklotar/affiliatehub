import Link from "next/link";
import { getTrendingProducts, getDealOfTheWeekProducts, getAllCategories } from "@/lib/db";
import { Icons } from "@/components/Icons";
import { Metadata } from "next";
import ProductCard from "@/components/Product/ProductCard";

export const metadata: Metadata = {
  title: "Live Hot Deals & Price Drops | AffiliateHub",
  description: "Real-time price drops on tech, home office, and lifestyle gear. Compare verified deals from major retailers in India.",
};

export default async function DealsPage() {
  const trending = await getTrendingProducts();
  const dealOfWeek = await getDealOfTheWeekProducts();
  const categories = await getAllCategories();

  // Combine and deduplicate
  const allDeals = Array.from(new Set([...trending, ...dealOfWeek].map(p => p.id)))
    .map(id => [...trending, ...dealOfWeek].find(p => p.id === id)!);

  return (
    <div className="min-h-screen py-24 bg-white">
      <div className="container">
        {/* Semantic Header */}
        <header className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-blue-600 font-black uppercase tracking-[0.4em] text-[10px] mb-6 block">Limited Time Flash Offers</span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-tight text-slate-900">
            The <span className="italic text-slate-400">Golden</span> <span className="text-blue-600">List.</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl leading-relaxed font-medium">
            We track thousands of price points to bring you the most significant drops across Amazon, Flipkart, and Meesho. Updated live.
          </p>
        </header>

        {/* Quick Category Filters for SEO and UX */}
        <nav aria-label="Quick category deals" className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop/${cat.slug}`}
              className="px-6 py-2.5 rounded-full border border-slate-100 text-[10px] font-black uppercase tracking-widest hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm"
            >
              {cat.name}
            </Link>
          ))}
        </nav>

        {/* Deals Grid */}
        <section aria-label="Active deals grid">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {allDeals.map((prod) => (
              <ProductCard 
                key={prod.id} 
                product={prod} 
                badgeType="hot" 
                badgeText="Hot Drop" 
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
