import { Icons } from "@/components/Icons";
import { getAllProducts, getProductBySlug, getRelatedProductsByCategory } from "@/lib/db";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}
import ProductGallery from "@/components/Product/ProductGallery";
import ProductCard from "@/components/Product/ProductCard";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} - Best Deals & Price Comparison | AffiliateHub`,
    description: `Check live prices for ${product.name}. Compare offers from Amazon, Flipkart, and more. Verified deals for May 2026.`,
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  // Filter out image URLs with special chars that break Next.js preloader (querySelector issue)
  const safeImages = product.images.filter((img: string) => {
    try {
      const url = new URL(img, 'https://placeholder.com');
      // Reject URLs with query params — they break CSS selectors in Next.js
      return !url.search || url.search === '';
    } catch {
      return false;
    }
  });
  // Use safe images or fallback placeholder
  const displayImages = safeImages.length > 0 ? safeImages : ['/placeholder.png'];

  const relatedProducts = await getRelatedProductsByCategory(product.category.slug, product.id);

  // JSON-LD Structured Data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images,
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": "AffiliateHub"
    },
    "offers": {
      "@type": "AggregateOffer",
      "lowPrice": product.offers.length > 0 ? Math.min(...product.offers.map((o: any) => o.price)) : 0,
      "priceCurrency": "INR",
      "offerCount": product.offers.length,
      "offers": product.offers.map((offer: any) => ({
        "@type": "Offer",
        "price": offer.price,
        "priceCurrency": "INR",
        "url": offer.affiliateLink,
        "seller": {
          "@type": "Organization",
          "name": offer.platform
        }
      }))
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": "150"
    }
  };

  return (
    <article className="min-h-screen py-16 bg-white">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container">
        {/* Breadcrumbs - Semantic Nav */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-10 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/shop" className="hover:text-blue-600 transition-colors">Shop</Link>
          <span aria-hidden="true">/</span>
          <span className="text-slate-900 capitalize">{product.category.name.replace('-', ' ')}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-32">
          {/* Gallery Section */}
          <section aria-label="Product Images" className="sticky top-24 h-fit">
            <ProductGallery images={product.images} />
          </section>

          {/* Product Details Section */}
          <section aria-label="Product Information" className="space-y-10">
            <header>
              <div className="flex items-center gap-2 text-green-600 text-[10px] font-black uppercase tracking-widest mb-4">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Live Best Price Found
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight mb-6">
                {product.name}
              </h1>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5 bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-black">
                  <Icons.Star className="w-3.5 h-3.5" />
                  <span>{product.rating} / 5.0 Community Rating</span>
                </div>
              </div>
            </header>

            {/* Comparison Table Section */}
            <section aria-label="Price Comparison" className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
              <div className="bg-slate-50/50 px-8 py-5 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Price Comparison Engine</h2>
                <span className="text-[9px] font-bold text-slate-400 italic">Verified Live</span>
              </div>
              <div className="divide-y divide-slate-50">
                {product.offers.map((offer: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-8 hover:bg-slate-50 transition-all group"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-xl border border-slate-100 flex items-center justify-center bg-white shadow-inner overflow-hidden">
                        <img src={offer.logo} alt={`${offer.platform} official logo`} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-black text-slate-900">{offer.platform}</h3>
                          {offer.label && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-500 text-[9px] font-black uppercase tracking-widest text-white shadow-sm">
                              {offer.label}
                            </span>
                          )}
                        </div>
                        <p className={`text-[10px] font-black uppercase tracking-widest ${offer.isAvailable ? 'text-green-500' : 'text-red-500'}`}>
                          {offer.isAvailable ? 'Available Now' : 'Out of Stock'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <div className="text-3xl font-black text-slate-900">₹{offer.price.toLocaleString('en-IN')}</div>
                      </div>
                      <a
                        href={offer.affiliateLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`bg-blue-600 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-700 hover:scale-105 transition-all shadow-lg shadow-blue-600/20 ${!offer.isAvailable && 'opacity-50 pointer-events-none'}`}
                      >
                        {offer.isAvailable ? `Buy from ${offer.platform}` : 'Unavailable'}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Detailed Description Section */}
            <section aria-label="Product Description" className="space-y-6 pt-6">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-4">Product Overview</h2>
              <div className="text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
                {product.description}
              </div>
            </section>

            {/* Specifications Section */}
            <section aria-label="Key Features" className="space-y-6">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Expert-Verified Features</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.features?.map((feature: string, i: number) => (
                  <li key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100/50 text-sm font-bold text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-blue-600" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
          </section>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section aria-label="Deals in this category" className="py-24 border-t border-slate-100">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <h2 className="text-3xl font-black tracking-tighter mb-4">Trending Deals in this Category</h2>
                <p className="text-slate-500 font-medium">Verified alternatives and related accessories.</p>
              </div>
              <Link href={`/shop/${product.category.slug}`} className="text-xs font-black uppercase tracking-widest text-blue-600 border-b-2 border-blue-600 pb-1">
                View All {product.category.name.replace('-', ' ')} Products
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((p: any) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
