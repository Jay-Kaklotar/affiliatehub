"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Product, Category } from "@/types";
import { Icons } from "@/components/Icons";
import ProductCard from "@/components/Product/ProductCard";

import { useSearchParams } from "next/navigation";

interface FilterableShopProps {
  products: Product[];
  categories: Category[];
  platforms: any[];
}

export default function FilterableShop({ products, categories, platforms }: FilterableShopProps) {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  
  // Dynamically get all platforms from products, but only if they are marked as visible in the management panel
  const visiblePlatforms = useMemo(() => {
    // Get unique platforms from products data
    const platformsInProducts = new Set<string>();
    products.forEach(p => {
      p.offers?.forEach(o => {
        if (o.platform) platformsInProducts.add(o.platform.toLowerCase());
      });
    });

    // Filter management list to only include those that are visible AND exist in products
    // OR if management list is empty, just show what's in products (fallback)
    if (platforms.length === 0) {
      return Array.from(platformsInProducts).map(p => ({ 
        name: p.charAt(0).toUpperCase() + p.slice(1), 
        isVisible: true 
      }));
    }

    return platforms.filter(p => 
      p.isVisible && platformsInProducts.has(p.name.toLowerCase())
    );
  }, [products, platforms]);

  // Dynamically get max price for the range slider
  const maxPriceInData = useMemo(() => {
    if (products.length === 0) return 150000;
    return Math.max(...products.map(p => p.price || 0), 10000);
  }, [products]);

  const [search, setSearch] = useState(q);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPlatform, setSelectedPlatform] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(maxPriceInData);
  const [sortBy, setSortBy] = useState<string>("popularity");


  // Sync price range if products load later or change
  useEffect(() => {
    setPriceRange(maxPriceInData);
  }, [maxPriceInData]);


  // Sync search state with URL parameter changes from Navbar
  useEffect(() => {
    setSearch(q);
  }, [q]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const searchLower = search.toLowerCase();
        const searchTerms = searchLower.split(/\s+/).filter(Boolean);
        
        const matchesSearch = searchTerms.length === 0 || searchTerms.every(term => 
          p.description.toLowerCase().includes(term) ||
          (p.features || []).some(f => f.toLowerCase().includes(term)) ||
          p.category?.name.toLowerCase().includes(term) ||
          p.slug.toLowerCase().includes(term)
        );

        const matchesCategory = selectedCategory === "all" || p.category?.slug === selectedCategory;

        // Fix: Check if any offer platform matches the selected platforms
        const productPlatforms = p.offers.map(o => o.platform);
        const matchesPlatform = selectedPlatform.length === 0 ||
          selectedPlatform.some(sp => productPlatforms.includes(sp));

        const matchesPrice = p.price <= priceRange;
        return matchesSearch && matchesCategory && matchesPlatform && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return 0;
      });
  }, [products, search, selectedCategory, selectedPlatform, priceRange, sortBy]);


  const togglePlatform = (platform: string) => {
    setSelectedPlatform(prev =>
      prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]
    );
  };

  const removeFilter = (type: string, value?: string) => {
    switch (type) {
      case "search": setSearch(""); break;
      case "category": setSelectedCategory("all"); break;
      case "platform": setSelectedPlatform(prev => prev.filter(p => p !== value)); break;
      case "price": setPriceRange(maxPriceInData); break;
    }
  };

  const activeFilterCount = (search ? 1 : 0) + (selectedCategory !== "all" ? 1 : 0) + selectedPlatform.length + (priceRange < maxPriceInData ? 1 : 0);

  return (
    <div className="flex flex-col lg:flex-row gap-12">
      {/* Sidebar Filters */}
      <aside className="w-full lg:w-72 space-y-10 sticky top-32 h-fit">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="space-y-10">
            {/* Category Filter */}
            <section>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Categories</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`flex items-center justify-between w-full text-sm font-bold transition-all group ${selectedCategory === "all" ? "text-blue-600" : "text-slate-500 hover:text-slate-900"}`}
                >
                  <span className="flex items-center gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full ${selectedCategory === "all" ? "bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.5)]" : "bg-slate-200"}`} />
                    All Products
                  </span>
                  <span className="text-[10px] opacity-40 font-black tracking-widest">{products.length}</span>
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`flex items-center justify-between w-full text-sm font-bold transition-all group ${selectedCategory === cat.slug ? "text-blue-600" : "text-slate-500 hover:text-slate-900"}`}
                  >
                    <span className="flex items-center gap-3 leading-tight">
                      <div className={`w-1.5 h-1.5 rounded-full  ${selectedCategory === cat.slug ? "bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.5)]" : "bg-slate-200"}`} />
                      {cat.name}
                    </span>
                    <span className="text-[10px] opacity-40 font-black tracking-widest">
                      {products.filter(p => p.category?.slug === cat.slug).length}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* Platform Filter */}
            <section>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Platform</h3>
              <div className="grid grid-cols-1 gap-3">
                {visiblePlatforms.length > 0 ? (
                  visiblePlatforms.map(p => (
                    <label key={p.name} className={`flex items-center gap-4 cursor-pointer p-3 rounded-xl border transition-all ${selectedPlatform.includes(p.name) ? "bg-blue-50 border-blue-100 text-blue-600" : "bg-slate-50 border-transparent hover:bg-slate-100 text-slate-600"}`}>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={selectedPlatform.includes(p.name)}
                        onChange={() => togglePlatform(p.name)}
                      />
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${selectedPlatform.includes(p.name) ? "bg-blue-600 border-blue-600" : "bg-white border-slate-200"}`}>
                        {selectedPlatform.includes(p.name) && <span className="text-[10px] text-white">✓</span>}
                      </div>
                      <span className="text-sm font-bold">{p.name}</span>
                    </label>
                  ))
                ) : (
                  <p className="text-[10px] text-slate-400 font-bold italic">No active platforms</p>
                )}
              </div>
            </section>

            {/* Price Filter */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Budget</h3>
                <span className="text-xs font-black text-blue-600">₹{priceRange.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="0"
                max={maxPriceInData}
                step={maxPriceInData > 10000 ? 1000 : 100}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
              />
              <div className="flex justify-between mt-4 text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">
                <span>Min</span>
                <span>₹{maxPriceInData.toLocaleString()}+</span>
              </div>
            </section>
          </div>
        </div>
      </aside>


      {/* Main Content */}
      <div className="flex-1">
        {/* Top Controls: Elegant & Compact */}
        <div className="bg-white rounded-[2.5rem] p-4 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center mb-10">
          <div className="relative flex-1 group w-full">
            <Icons.Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
            <input
              type="text"
              placeholder="Search specific features or products..."
              className="w-full pl-16 pr-8 py-5 bg-slate-50/50 rounded-[1.8rem] outline-none border border-transparent focus:bg-white focus:border-blue-100 transition-all font-medium text-slate-900 placeholder:text-slate-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-6 px-6 h-full border-l border-slate-100">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 whitespace-nowrap">Sort</span>
            <select
              className="bg-transparent border-none py-2 font-black text-sm text-slate-900 outline-none cursor-pointer hover:text-blue-600 transition-colors"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="popularity">Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>

          </div>
        </div>

        {/* Active Filter Pills: The "Pils" System */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-3 mb-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-2">Active:</span>

            {search && (
              <button onClick={() => removeFilter("search")} className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-xs font-bold hover:bg-blue-100 transition-colors">
                &quot;{search}&quot; <span className="opacity-40">✕</span>
              </button>
            )}

            {selectedCategory !== "all" && (
              <button onClick={() => removeFilter("category")} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-slate-800 transition-colors">
                {categories.find(c => c.slug === selectedCategory)?.name} <span className="opacity-40">✕</span>
              </button>
            )}

            {selectedPlatform.map(p => (
              <button key={p} onClick={() => removeFilter("platform", p)} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-full text-xs font-bold hover:border-slate-300 transition-colors">
                {p} <span className="opacity-40">✕</span>
              </button>
            ))}

            {priceRange < maxPriceInData && (
              <button onClick={() => removeFilter("price")} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-full text-xs font-bold hover:border-slate-300 transition-colors">
                Under ₹{priceRange.toLocaleString()} <span className="opacity-40">✕</span>
              </button>
            )}

            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("all");
                setSelectedPlatform([]);
                setPriceRange(maxPriceInData);
              }}
              className="text-[10px] font-black uppercase tracking-widest text-blue-600 ml-4 hover:opacity-70 transition-opacity"
            >
              Reset All
            </button>
          </div>
        )}

        {/* Results Header */}
        <div className="flex justify-between items-center mb-8 px-2">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">
              Showing <span className="text-blue-600">{filteredProducts.length}</span> Results
            </h2>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredProducts.map((prod) => (
            <ProductCard 
              key={prod.id} 
              product={prod} 
              badgeType={prod.discount > 0 ? "discount" : "none"}
              showViewPlatformDeal={true}
              preferredPlatforms={selectedPlatform}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-40 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
            <div className="text-7xl mb-8 animate-bounce">🔍</div>
            <h3 className="text-3xl font-black tracking-tighter mb-4 text-slate-900">Zero matches found</h3>
            <p className="text-slate-500 max-w-sm mx-auto font-medium">Try removing some filters or searching for something else to find your perfect deal.</p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("all");
                setSelectedPlatform([]);
                setPriceRange(150000);
              }}
              className="mt-10 text-xs font-black uppercase tracking-widest text-blue-600 border-b-2 border-blue-600 pb-1"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
