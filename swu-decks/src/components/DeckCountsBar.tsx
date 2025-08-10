"use client"

export function DeckCountsBar({
  values = { main: 0, side: 0, overflow: 0 },
}: {
  values?: { main: number; side: number; overflow: number }
}) {
  return (
    <div className="flex items-center gap-3 text-sm text-white/80">
      <div className="rounded bg-white/10 px-2 py-1">Main: {values.main}/50</div>
      <div className="rounded bg-white/10 px-2 py-1">Side: {values.side}/10</div>
      <div className="rounded bg-white/10 px-2 py-1">Overflow: {values.overflow}</div>
    </div>
  )
}