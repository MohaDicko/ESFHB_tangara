export default function DashboardLoading() {
  return (
    <div className="flex-1 p-8 space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="h-8 bg-zinc-100 rounded-2xl w-1/3" />
      <div className="h-4 bg-zinc-100 rounded-xl w-1/4" />
      
      {/* Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-28 bg-zinc-100 rounded-3xl" />
        ))}
      </div>

      {/* Content skeleton */}
      <div className="space-y-3 mt-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-16 bg-zinc-100 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}
