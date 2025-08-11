"use client"

import { useState, useEffect, useMemo } from 'react'
import { SegmentedControl } from '@/components/SegmentedControl'
import { DeckCountsBar } from '@/components/DeckCountsBar'
import { useDeckStore } from '@/store/deckStore'
import type { Card } from '@/lib/types'
import { validateDeck } from '@/lib/rules'

const VIEWS = [
  { value: 'list', label: 'List' },
  { value: 'gallery', label: 'Gallery' },
  { value: 'canvas', label: 'Canvas' },
] as const

export default function BuilderPage() {
  const [view, setView] = useState<(typeof VIEWS)[number]['value']>('list')
  const [cards, setCards] = useState<Card[]>([])
  const version = useDeckStore((s) => s.version)

  useEffect(() => {
    fetch('/api/cards')
      .then((r) => r.json())
      .then((data: Card[]) => setCards(data))
      .catch(() => setCards([]))
  }, [])

  const validation = useMemo(() => {
    const byId = new Map(cards.map((c) => [c.id, c]))
    return validateDeck(version, byId)
  }, [version, cards])

  return (
    <main className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <SegmentedControl<typeof VIEWS[number]['value']> options={VIEWS} value={view} onChange={setView} />
        <DeckCountsBar values={validation.totals} />
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