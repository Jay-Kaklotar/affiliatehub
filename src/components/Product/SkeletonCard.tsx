export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 h-full animate-pulse">
      <div className="aspect-square bg-slate-100 rounded-[2rem] mb-8" />
      <div className="h-6 bg-slate-100 rounded-full w-3/4 mb-4" />
      <div className="h-4 bg-slate-100 rounded-full w-1/2 mb-8" />
      <div className="mt-auto pt-6 border-t border-slate-50 flex justify-between items-end">
        <div className="space-y-2">
          <div className="h-3 bg-slate-100 rounded-full w-12" />
          <div className="h-8 bg-slate-100 rounded-full w-24" />
        </div>
        <div className="h-12 bg-slate-100 rounded-xl w-24" />
      </div>
    </div>
  );
}
