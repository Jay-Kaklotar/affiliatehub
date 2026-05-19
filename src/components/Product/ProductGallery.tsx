"use client";

import { useState } from "react";

interface ProductGalleryProps {
  images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(images[0]);

  return (
    <div className="space-y-6">
      {/* Main Image View */}
      <div className="aspect-square rounded-3xl bg-slate-50 overflow-hidden border border-slate-100 shadow-sm relative group">
        <img 
          src={activeImage} 
          alt="Product View" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        
        {/* Subtle Overlay on Hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 pointer-events-none" />
      </div>

      {/* Thumbnails Slider/Grid */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(img)}
              className={`relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                activeImage === img 
                  ? "border-blue-600 ring-4 ring-blue-600/10" 
                  : "border-transparent hover:border-slate-200"
              }`}
            >
              <img 
                src={img} 
                alt={`Thumbnail ${index + 1}`} 
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  activeImage === img ? "opacity-100" : "opacity-60 hover:opacity-100"
                }`}
              />
              {activeImage === img && (
                <div className="absolute inset-0 bg-blue-600/5" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
