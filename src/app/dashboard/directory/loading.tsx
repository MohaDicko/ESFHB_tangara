export default function DirectoryLoading() {
  return (
    <div className="p-8 space-y-6 animate-pulse">
      <div className="h-8 bg-zinc-100 rounded-2xl w-1/3" />
      <div className="h-12 bg-zinc-100 rounded-2xl w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="h-40 bg-zinc-100 rounded-3xl" />
        ))}
      </div>
    </div>
  )
}
