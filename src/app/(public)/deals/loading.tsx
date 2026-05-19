import SkeletonCard from "@/components/Product/SkeletonCard";

export default function Loading() {
  return (
    <div className="min-h-screen py-24 bg-slate-50">
      <div className="container">
        <div className="mb-20">
          <div className="h-4 bg-slate-200 rounded-full w-24 mb-6 animate-pulse" />
          <div className="h-20 bg-slate-200 rounded-[2.5rem] w-full mb-12 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
