import SkeletonCard from "@/components/Product/SkeletonCard";

export default function Loading() {
  return (
    <div className="min-h-screen py-24 bg-white">
      <div className="container">
        <div className="mb-16">
          <div className="h-4 bg-slate-100 rounded-full w-24 mb-12 animate-pulse" />
          <div className="h-16 bg-slate-100 rounded-2xl w-3/4 mb-4 animate-pulse" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
