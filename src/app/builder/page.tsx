"use client"

import { useState, useEffect, useMemo } from 'react'
import { SegmentedControl } from '@/components/SegmentedControl'
import { DeckCountsBar } from '@/components/DeckCountsBar'
import { LeaderBaseSelector } from '@/components/LeaderBaseSelector'
import { CardSearch } from '@/components/CardSearch'
import { ListView } from '@/components/ListView'
import { GalleryView } from '@/components/GalleryView'
import { DeckValidation } from '@/components/DeckValidation'
import { AspectSynergies } from '@/components/AspectSynergies'
import { DeckAreas } from '@/components/DeckAreas'
import { DeckExport } from '@/components/DeckExport'
import { useDeckStore } from '@/store/deckStore'
import { swudbClient, convertSWUDBCard } from '@/lib/swudb'
import type { Card, Aspect } from '@/lib/types'

const VIEWS = [
  { value: 'list', label: 'List' },
  { value: 'gallery', label: 'Gallery' },
] as const

export default function BuilderPage() {
  const [view, setView] = useState<(typeof VIEWS)[number]['value']>('list')
  const [cards, setCards] = useState<Card[]>([])
  const [leaders, setLeaders] = useState<Card[]>([])
  const [bases, setBases] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAspects, setSelectedAspects] = useState<Aspect[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedSets, setSelectedSets] = useState<string[]>([])

  // Deck store
  const {
    selectedLeader,
    selectedBase,
    setLeader,
    setBase,
    setEntryCount,
    getMainDeckCards,
    getTotalCount,
  } = useDeckStore()

  // Fetch cards from SWUDB
  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch different card types in parallel
        const [leadersData, basesData, unitsData, eventsData, upgradesData] = await Promise.all([
          swudbClient.getLeaders(),
          swudbClient.getBases(),
          swudbClient.getUnits(),
          swudbClient.getEvents(),
          swudbClient.getUpgrades(),
        ])

        // Convert to our internal format
        const allCards = [
          ...leadersData.map(convertSWUDBCard),
          ...basesData.map(convertSWUDBCard),
          ...unitsData.map(convertSWUDBCard),
          ...eventsData.map(convertSWUDBCard),
          ...upgradesData.map(convertSWUDBCard),
        ]

        setCards(allCards)
        setLeaders(leadersData.map(convertSWUDBCard))
        setBases(basesData.map(convertSWUDBCard))
      } catch (err) {
        console.error('Error fetching cards:', err)
        setError('Failed to load cards. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchCards()
  }, [])

  // Handle card count changes
  const handleCardCountChange = (cardId: string, count: number) => {
    if (count === 0) {
      // Remove from main deck
      setEntryCount(cardId, 0, 'main')
    } else {
      // Add to main deck
      setEntryCount(cardId, count, 'main')
    }
  }

  // Get current deck counts
  const mainDeckCards = getMainDeckCards()
  const mainDeckTotal = getTotalCount('main')
  const sideboardTotal = getTotalCount('side')
  const overflowTotal = getTotalCount('overflow')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
          <p className="text-white/60">Loading cards...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-white font-medium mb-2">Error Loading Cards</p>
          <p className="text-white/60 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <main className="space-y-6">
      {/* Header with view controls and deck counts */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <SegmentedControl<typeof VIEWS[number]['value']>
            options={VIEWS}
            value={view}
            onChange={setView}
          />
          <div className="text-sm text-white/60">
            {cards.length} cards available
          </div>
        </div>
        <DeckCountsBar
          values={{
            main: mainDeckTotal,
            side: sideboardTotal,
            overflow: overflowTotal
          }}
        />
      </div>

      {/* Leader and Base Selection */}
      <LeaderBaseSelector
        leaders={leaders}
        bases={bases}
        selectedLeader={selectedLeader}
        selectedBase={selectedBase}
        onLeaderSelect={setLeader}
        onBaseSelect={setBase}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                        {/* Left Column - Search and Cards */}
                <div className="lg:col-span-2 space-y-4 lg:space-y-6">
                  {/* Search and Filters */}
                  <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                    <CardSearch
                      query={searchQuery}
                      onQueryChange={setSearchQuery}
                      selectedAspects={selectedAspects}
                      onAspectsChange={setSelectedAspects}
                      selectedTypes={selectedTypes}
                      onTypesChange={setSelectedTypes}
                      selectedSets={selectedSets}
                      onSetsChange={setSelectedSets}
                    />
                  </div>

                  {/* Card View (List/Gallery) */}
                  {view === 'list' ? (
            <ListView
              cards={cards}
              deckEntries={mainDeckCards}
              onCountChange={handleCardCountChange}
              searchQuery={searchQuery}
              selectedAspects={selectedAspects}
              selectedTypes={selectedTypes}
              selectedSets={selectedSets}
            />
          ) : (
            <GalleryView
              cards={cards}
              deckEntries={mainDeckCards}
              onCountChange={handleCardCountChange}
              searchQuery={searchQuery}
              selectedAspects={selectedAspects}
              selectedTypes={selectedTypes}
              selectedSets={selectedSets}
            />
          )}
        </div>

        {/* Right Column - Deck Management */}
        <div className="lg:col-span-1 xl:col-span-2 space-y-4 lg:space-y-6">
          <DeckValidation />
          <DeckAreas allCards={cards} />
          <AspectSynergies allCards={cards} />
          <DeckExport allCards={cards} />
        </div>
      </div>
    </main>
  )
}