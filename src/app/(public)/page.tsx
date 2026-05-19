import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Award, Sparkles, BookOpen } from "lucide-react";
import {
  getAllCategories,
  getTrendingProducts,
  getLatestPosts,
  getDealOfTheWeekProducts
} from "@/lib/db";

import { Icons } from "@/components/Icons";
import ProductCard from "@/components/Product/ProductCard";

export default async function HomePage() {
  const categories = await getAllCategories();
  const deals = await getDealOfTheWeekProducts();
  const trending = await getTrendingProducts();
  const posts = await getLatestPosts();

  const renderIcon = (iconName: string, className?: string) => {
    const Icon = Icons[iconName as keyof typeof Icons] || Icons.HomeOffice;
    return <div className={className}><Icon /></div>;
  };

  return (
    <div className="min-h-screen">

      {/* --- SECTION 2: HERO SECTION (Action-Oriented) --- */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center overflow-hidden bg-slate-900">
        {/* Real Hero Image from Third Party */}
        <div className="absolute inset-0">
          <Image
            src={"https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070&auto=format&fit=crop".trim()}
            alt="Budget Tech Setup"
            fill
            unoptimized
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
        </div>

        <div className="container relative z-10">
          <div className="max-w-3xl text-center lg:text-left mx-auto lg:mx-0">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest mb-6 border border-blue-500/30">
              Limited Time Deals
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white mb-8 leading-tight">
              Must-Have Tech <br />
              <span className="text-amber-500 italic underline">Under ₹499.</span>
            </h1>
            <p className="text-xl text-slate-300 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Don&apos;t overpay for quality. Discover trending desk upgrades and mobile accessories that won&apos;t break the bank.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Link href="/shop" className="bg-amber-500 text-black px-8 py-4 rounded-full font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_4px_14px_rgba(245,158,11,0.4)] text-center">
                Shop Deals Now
              </Link>
              <Link href="/deals" className="px-8 py-4 rounded-full border border-white/20 text-white font-bold hover:bg-white/10 transition-all text-center">
                View Weekly Drops
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 3: 4 CORE CATEGORIES --- */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-slate-900">
              Shop by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Category</span>
            </h2>
            <p className="text-slate-500 font-medium max-w-xl mx-auto">
              Curated selections for every part of your professional and personal life.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <Link 
                key={cat.id}
                href={`/shop/${cat.slug}`}
                className="group relative h-64 rounded-[2.5rem] overflow-hidden flex flex-col items-center justify-center text-center p-8 transition-all duration-500 hover:-translate-y-2"
              >
                {/* Background Gradient & Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-5 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="absolute inset-0 bg-slate-50 group-hover:bg-transparent transition-colors duration-500" />
                
                {/* Proper Image Icon Container */}
                <div className="relative z-10 mb-6 transition-all duration-500 group-hover:scale-110 w-12 h-12">
                  <Image src={cat.icon.trim()} alt="" width={48} height={48} unoptimized className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all" />
                </div>

                {/* Text Content */}
                <div className="relative z-10">
                  <h3 className="text-lg font-black tracking-tight text-slate-900 group-hover:text-white transition-colors duration-500">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] mt-2 text-slate-400 group-hover:text-white/70 transition-colors duration-500">
                    Explore Deals
                  </p>
                </div>

                {/* Subtle Border */}
                <div className="absolute inset-0 border border-slate-100 rounded-[2.5rem] group-hover:border-transparent transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECTION 4: DEALS OF THE WEEK (Sale Booster) --- */}
      <section className="py-24 bg-slate-50">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter mb-4">
                Trending <span className="text-amber-500">Deals</span>
              </h2>
              <p className="text-slate-500 text-lg">Fast-moving products with massive discounts.</p>
            </div>
            <Link href="/deals" className="text-sm font-black uppercase tracking-widest text-blue-600 border-b-2 border-blue-600 pb-1">
              View All Deals
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trending.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </section>
      {/* --- TRUST BADGES SECTION (Why Choose Us) --- */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-30" />

        <div className="container relative z-10">
          <div className="text-center mb-16">
            <span className="text-xs font-black uppercase tracking-[0.22em] text-blue-600 mb-3 block">
              Built For Smart Shoppers
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900">
              Why Shop With <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Us?</span>
            </h2>
            <p className="text-slate-500 font-medium max-w-xl mx-auto mt-3">
              We do the hard work of searching, testing, and comparing deals so you don&apos;t have to.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <div className="group bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <Award size={26} />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">100% Handpicked</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Every deal is manually verified by our team to guarantee real ratings and genuine value.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                <Sparkles size={26} />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">Lowest Prices</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                We compare prices across Amazon, Flipkart, Myntra, and Meesho to find the absolute best deal.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
                <ShieldCheck size={26} />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">100% Verified Links</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Direct redirection to official, secured platforms for checkout. No hidden charges or scams.
              </p>
            </div>

            {/* Card 4 */}
            <div className="group bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                <BookOpen size={26} />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">Expert Guides</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                In-depth buying guides and setup recommendations to help you buy with total confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 5: DEAL OF THE WEEK (Authority Building) --- */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container">
          {deals.length > 0 ? (
            <div className="bg-slate-900 rounded-[3rem] p-12 lg:p-20 relative flex flex-col lg:flex-row items-center gap-16 overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <Image
                  src={(Array.isArray(deals[0].images) ? deals[0].images[0] : '').trim()}
                  alt=""
                  fill
                  unoptimized
                  className="w-full h-full object-cover blur-sm"
                />
              </div>
              <div className="flex-1 text-center lg:text-left text-white relative z-10">
                <span className="text-amber-500 font-black uppercase tracking-[0.3em] text-xs mb-6 block">Deal of the Week</span>
                <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-8 leading-tight">
                  {deals[0].slug.replace(/-/g, ' ')}
                </h2>
                <p className="text-slate-400 text-lg mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  {deals[0].description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-md mx-auto lg:mx-0 mb-12">
                  {deals[0].features?.slice(0, 4).map((item: any) => (
                    <div key={item} className="flex items-center gap-3 text-sm font-bold">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-[10px]">✓</span>
                      {item}
                    </div>
                  ))}
                </div>
                <Link href={`/product/${deals[0].slug}`} className="inline-block bg-amber-500 text-black px-10 py-4 rounded-full font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_4px_14px_rgba(245,158,11,0.4)]">
                  Grab This Deal
                </Link>
              </div>
              <div className="flex-1 w-full aspect-square relative z-10">
                <Image
                  src={(Array.isArray(deals[0].images) ? deals[0].images[0] : '').trim()}
                  alt=""
                  width={600}
                  height={600}
                  unoptimized
                  className="w-full h-full object-contain rounded-3xl"
                />
                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-2xl text-black">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Special Price</div>
                  <div className="text-3xl font-black">₹{deals[0].price.toLocaleString('en-IN')}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 rounded-[3rem] p-20 text-center text-white">
              <h2 className="text-3xl font-black">Stay tuned for next week&apos;s deal!</h2>
            </div>
          )}
        </div>
      </section>

      {/* --- SECTION 6: BLOG / BUYING GUIDES TEASER --- */}
      <section className="py-24 bg-slate-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter mb-4">
              Read Before <span className="text-blue-600">You Buy</span>
            </h2>
            <p className="text-slate-500 text-lg">Expert reviews and guides to help you shop smarter.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {posts.map((post: any) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group bg-white rounded-[2rem] p-8 border border-slate-200 hover:border-blue-600 hover:shadow-2xl hover:shadow-blue-600/5 transition-all duration-500">
                <div className="aspect-video rounded-2xl bg-slate-50 mb-6 overflow-hidden relative">
                  <Image
                    src={post.image.trim()}
                    alt={post.title}
                    fill
                    unoptimized
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-3 block">
                  Buying Guide • {post.date}
                </span>
                <h3 className="text-2xl font-black tracking-tight mb-4 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  {post.excerpt}
                </p>
                <span className="text-xs font-black uppercase tracking-widest border-b-2 border-blue-600 pb-1">
                  Read Full Guide →
                </span>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-3 bg-white border border-slate-200 px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:border-blue-600 hover:text-blue-600 transition-all active:scale-95 shadow-sm"
            >
              View All Articles
              <span className="text-xl">→</span>
            </Link>
          </div>

        </div>
      </section>

      {/* --- NEWSLETTER SECTION (Trust & Authority) --- */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
        </div>
        <div className="container relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-6 text-white">
              Don&apos;t Miss Any <span className="text-blue-600">Secret Deals</span>
            </h2>
            <p className="text-slate-400 text-lg mb-12 max-w-md">
              Join our community of 50,000+ smart shoppers and get the best budget tech deals in your inbox.
            </p>

            <form className="flex-1 w-full max-w-lg bg-white rounded-full p-2 flex items-center shadow-2xl border border-white/20">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 bg-transparent px-8 py-3 outline-none font-medium text-slate-600 placeholder:text-slate-400"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-10 py-3 rounded-full font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-lg whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>

  );
}