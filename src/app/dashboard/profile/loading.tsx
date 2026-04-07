export default function ProfileLoading() {
  return (
    <div className="p-8 max-w-5xl mx-auto animate-pulse">
      <div className="h-8 bg-zinc-100 rounded-2xl w-1/3 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 bg-zinc-100 rounded-3xl" />
          ))}
        </div>
        <div className="space-y-4">
          <div className="h-48 bg-zinc-100 rounded-3xl" />
          <div className="h-32 bg-zinc-100 rounded-3xl" />
          <div className="h-14 bg-zinc-100 rounded-3xl" />
        </div>
      </div>
    </div>
  )
}
