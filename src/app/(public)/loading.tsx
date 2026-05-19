import SkeletonCard from "@/components/Product/SkeletonCard";

export default function Loading() {
  return (
    <div className="min-h-screen pt-12">
      <div className="container">
        {/* Hero Skeleton */}
        <div className="h-[500px] bg-slate-100 rounded-[3rem] w-full mb-24 animate-pulse" />

        {/* Trending Section Skeleton */}
        <div className="mb-12">
          <div className="h-10 bg-slate-100 rounded-full w-48 mb-12 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
