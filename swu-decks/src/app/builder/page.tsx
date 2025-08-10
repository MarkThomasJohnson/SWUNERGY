"use client"

import { useState } from 'react'
import { SegmentedControl } from '@/components/SegmentedControl'
import { DeckCountsBar } from '@/components/DeckCountsBar'

const VIEWS = [
  { value: 'list', label: 'List' },
  { value: 'gallery', label: 'Gallery' },
  { value: 'canvas', label: 'Canvas' },
] as const

export default function BuilderPage() {
  const [view, setView] = useState<(typeof VIEWS)[number]['value']>('list')

  return (
    <main className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <SegmentedControl
          options={VIEWS}
          value={view}
          onChange={setView}
        />
        <DeckCountsBar />
      </div>

      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
        {view === 'list' && (
          <div className="text-white/80">List view goes here (inline add 0–3, filters).</div>
        )}
        {view === 'gallery' && (
          <div className="text-white/80">Gallery view goes here (images + text search).</div>
        )}
        {view === 'canvas' && (
          <div className="text-white/80">Canvas view goes here (synergy graph).</div>
        )}
      </div>
    </main>
  )
}