import SkeletonCard from "@/components/Product/SkeletonCard";

export default function Loading() {
  return (
    <div className="min-h-screen py-24 bg-white">
      <div className="container">
        <div className="mb-16">
          <div className="h-4 bg-slate-100 rounded-full w-32 mb-12 animate-pulse" />
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-slate-100 rounded-[2rem] animate-pulse" />
            <div className="h-16 bg-slate-100 rounded-2xl w-1/2 animate-pulse" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
