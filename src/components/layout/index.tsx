"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Icons } from "@/components/Icons";
import { getSearchSuggestions } from "@/actions/searchActions";


export function Navbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [suggestions, setSuggestions] = useState<{ type: "product" | "category" | "blog" | "search"; text: string; slug?: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Sync input with URL changes
  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  // Suggestions logic with debouncing
  useEffect(() => {
    const timer = setTimeout(async () => {
      const query = searchQuery.trim();
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }
      
      const results = await getSearchSuggestions(query);
      
      // Add a default "Search for..." option at the end
      const finalSuggestions = [
        ...results,
        { type: "search" as const, text: `Search for "${query}"` }
      ];
      
      setSuggestions(finalSuggestions);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e?: React.FormEvent, directQuery?: string) => {
    if (e) e.preventDefault();
    const query = directQuery || searchQuery.trim();
    if (query) {
      router.push(`/shop?q=${encodeURIComponent(query)}`);
      setShowSuggestions(false);
    } else {
      router.push("/shop");
    }
  };

  const handleSuggestionClick = (suggestion: typeof suggestions[0]) => {
    if (suggestion.type === "category") {
      router.push(`/shop/${suggestion.slug}`);
    } else if (suggestion.type === "product") {
      router.push(`/product/${suggestion.slug}`);
    } else if (suggestion.type === "blog") {
      router.push(`/blog/${suggestion.slug}`);
    } else {
      handleSearch(undefined, suggestion.text);
    }
    setShowSuggestions(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-border shadow-sm">
      <div className="container h-20 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-xl font-black text-xl">
            A
          </div>
          <span className="text-2xl font-black tracking-tighter hidden sm:block">
            AffiliateHub<span className="text-blue-600">.</span>
          </span>
        </Link>

        {/* Search Bar with Suggestions */}
        <div className="flex-1 max-w-xl relative group" ref={searchRef}>
          <form onSubmit={handleSearch} className="relative">
            <input 
              type="text" 
              placeholder="Search gadgets, home setup..."
              className="w-full bg-muted border border-transparent focus:border-primary focus:bg-white rounded-full px-6 py-2.5 outline-none transition-all text-sm font-medium pr-12"
              value={searchQuery}
              onFocus={() => setShowSuggestions(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
            />
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary z-10">
              <Icons.Search />
            </button>
          </form>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-white border border-slate-100 shadow-2xl rounded-3xl mt-2 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-6 py-4 hover:bg-slate-50 transition-colors flex items-center gap-4 group cursor-pointer"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      suggestion.type === 'category' ? 'bg-amber-50 text-amber-600' : 
                      suggestion.type === 'blog' ? 'bg-emerald-50 text-emerald-600' :
                      'bg-blue-50 text-blue-600'
                    }`}>
                      {suggestion.type === 'category' ? <Icons.Star className="w-4 h-4" /> : 
                       suggestion.type === 'blog' ? <Icons.Blog className="w-4 h-4" /> :
                       <Icons.Search className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-bold text-slate-900 truncate">{suggestion.text}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-600 transition-colors">
                        {suggestion.type === 'category' ? 'Category' : suggestion.type === 'blog' ? 'Buying Guide' : 'Product'}
                      </p>
                    </div>
                    <span className="text-slate-300 group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                ))}
              </div>
              <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-between items-center">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Search Results</span>
                <button onClick={() => handleSearch()} className="text-[9px] font-black uppercase tracking-widest text-blue-600 hover:underline">View All</button>
              </div>
            </div>
          )}
        </div>


        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-bold uppercase tracking-wider text-slate-500">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <Link href="/shop" className="hover:text-blue-600 transition-colors">Categories</Link>
          <Link href="/deals" className="text-amber-500 hover:opacity-80 transition-opacity">Deals</Link>
          <Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
        </nav>

        {/* Mobile Toggle Placeholder */}
        <button className="lg:hidden text-2xl">☰</button>
      </div>
    </header>
  );
}


export function Footer() {
  return (
    <footer className="bg-slate-50 pt-20 pb-10 border-t border-slate-200">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center rounded-lg font-black text-lg">
                A
              </div>
              <span className="text-xl font-black tracking-tighter">
                AffiliateHub<span className="text-blue-600">.</span>
              </span>
            </Link>
            <p className="text-slate-500 max-w-sm leading-relaxed mb-6">
              Expertly curated tech, home, and lifestyle recommendations. We help you find the best value for your money.
            </p>
            {/* Affiliate Disclosure (Amazon Compliance) */}
            <div className="p-6 bg-white border border-slate-200 rounded-2xl text-[9px] text-slate-400 font-bold leading-loose uppercase tracking-[0.15em]">
              <span className="text-slate-900 block mb-3 border-b border-slate-100 pb-2">Compliance & Disclaimer</span>
              As an Amazon Associate, I earn from qualifying purchases. Prices and availability are accurate as of May 2026 and are subject to change. Any price and availability information displayed on the vendor site at the time of purchase will apply to the purchase of this product.
            </div>
          </div>
          
          <div>
            <h4 className="font-black uppercase text-[10px] tracking-widest mb-6 text-slate-900">Explore</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-500">
              <li><Link href="/" className="hover:text-blue-600 transition-colors">Home</Link></li>
              <li><Link href="/shop" className="hover:text-blue-600 transition-colors">Shop Categories</Link></li>
              <li><Link href="/deals" className="hover:text-blue-600 transition-colors">Hot Deals</Link></li>
              <li><Link href="/blog" className="hover:text-blue-600 transition-colors">Buying Guides</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black uppercase text-[10px] tracking-widest mb-6 text-slate-900">Legal</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-500">
              <li><Link href="/contact" className="hover:text-blue-600 transition-colors">Contact Us</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/disclaimer" className="hover:text-blue-600 transition-colors">Affiliate Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        <div className="text-center pt-10 border-t border-slate-200 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          &copy; {new Date().getFullYear()} AffiliateHub Global. Curated with precision.
        </div>
      </div>
    </footer>
  );
}