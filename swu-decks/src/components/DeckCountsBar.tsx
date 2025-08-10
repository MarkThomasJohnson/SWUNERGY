"use client"

export function DeckCountsBar() {
  return (
    <div className="flex items-center gap-3 text-sm text-white/80">
      <div className="rounded bg-white/10 px-2 py-1">Main: 0/50</div>
      <div className="rounded bg-white/10 px-2 py-1">Side: 0/10</div>
      <div className="rounded bg-white/10 px-2 py-1">Overflow: 0</div>
    </div>
  )
}