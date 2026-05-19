import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { Icons } from "@/components/Icons";

interface ProductCardProps {
  product: Product;
  badgeText?: string;
  badgeType?: "discount" | "hot" | "none";
  showViewPlatformDeal?: boolean;
  preferredPlatforms?: string[]; // New prop to handle active filters
}

export default function ProductCard({ 
  product, 
  badgeText, 
  badgeType = "none",
  showViewPlatformDeal = false,
  preferredPlatforms = [] // Default to empty array
}: ProductCardProps) {
  // Find the offer that matches the preferred platforms if provided, otherwise find lowest price
  const getActiveOffer = () => {
    if (!product.offers || product.offers.length === 0) return null;
    
    // If we have filters, try to find an offer that matches one of the selected platforms
    if (preferredPlatforms.length > 0) {
      const filteredOffer = product.offers.find(o => 
        preferredPlatforms.some(p => p.toLowerCase() === o.platform.toLowerCase())
      );
      if (filteredOffer) return filteredOffer;
    }
    
    // Fallback: Default to lowest price
    return [...product.offers].sort((a, b) => a.price - b.price)[0];
  };

  const activeOffer = getActiveOffer();
    
  const price = activeOffer?.price || product.price || 0;
  const platformName = activeOffer?.platform || "Store";
  const platformLogo = activeOffer?.logo || "/placeholder-logo-vectors.svg";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm flex flex-col h-full relative hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-600/10 hover:border-blue-600 transition-all duration-500"
    >
      {/* Badge Logic */}
      {badgeType === "discount" && product.discount > 0 && (
        <div className="absolute top-6 left-6 z-10 bg-green-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg shadow-green-500/20">
          {product.discount}% OFF
        </div>
      )}
      
      {badgeType === "hot" && (
        <div className="absolute top-6 left-6 z-10 bg-amber-500 text-black text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
          {badgeText || "Hot Drop"}
        </div>
      )}

      {/* Vendor Logo */}
      <div className="absolute top-9 right-9 z-10 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center border border-slate-50 overflow-hidden">
        <Image 
          src={platformLogo.trim()} 
          alt={platformName} 
          width={40} 
          height={40} 
          unoptimized 
          className="w-full h-full object-cover" 
        />
      </div>

      {/* Product Image */}
      <div className="aspect-square rounded-[2rem] bg-slate-50 mb-8 overflow-hidden relative">
        <Image
          src={product.images[0].trim()}
          alt={product.name}
          fill
          unoptimized
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
      </div>

      <div className="flex-1 flex flex-col">
        <h2 className="text-slate-900 font-bold leading-tight mb-4 line-clamp-2 text-lg">
          {product.name}
        </h2>

        <div className="flex items-center gap-2 mb-6">
          <div className="text-amber-500" aria-hidden="true">
            <Icons.Star />
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {product.rating} Rating
          </span>
        </div>

        <div className="mt-auto pt-6 border-t border-slate-50 flex items-end justify-between mb-8">
          <div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Deal Price</span>
            <span className="text-3xl font-black text-slate-900 tracking-tighter">₹{price.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-blue-600 text-white w-full py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] text-center group-hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95">
          {showViewPlatformDeal ? `View ${platformName} Deal` : "View Deal"}
        </div>
      </div>
    </Link>
  );
}

