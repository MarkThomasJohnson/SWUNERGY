"use client"

import { useState, useEffect, useMemo, useRef } from 'react'
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
import { DeckStatistics } from '@/components/DeckStatistics'
import { QuickActions, type QuickActionsRef } from '@/components/QuickActions'
import { KeyboardShortcuts } from '@/components/KeyboardShortcuts'
import { useDeckStore } from '@/store/deckStore'
import { swudbClient, convertSWUDBCard } from '@/lib/swudb'
import type { Card, Aspect } from '@/lib/types'

const VIEWS = [
  { value: 'list', label: 'List' },
  { value: 'gallery', label: 'Gallery' },
] as const

export default function BuilderPage() {
  const [view, setView] = useState<'list' | 'gallery'>('list')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAspects, setSelectedAspects] = useState<Aspect[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedSets, setSelectedSets] = useState<string[]>([])
  const [selectedRarities, setSelectedRarities] = useState<string[]>([])
  const [cards, setCards] = useState<Card[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const quickActionsRef = useRef<QuickActionsRef>(null)

  const {
    selectedLeader, selectedBase, setLeader, setBase, setEntryCount,
    getMainDeckCards, getTotalCount,
  } = useDeckStore()

  // Fetch all cards on component mount
  useEffect(() => {
    const fetchCards = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const [leaders, bases, units, events, upgrades] = await Promise.all([
          swudbClient.getLeaders(),
          swudbClient.getBases(),
          swudbClient.getUnits(),
          swudbClient.getEvents(),
          swudbClient.getUpgrades(),
        ])

        const allCards = [
          ...leaders.map(convertSWUDBCard),
          ...bases.map(convertSWUDBCard),
          ...units.map(convertSWUDBCard),
          ...events.map(convertSWUDBCard),
          ...upgrades.map(convertSWUDBCard),
        ]

        setCards(allCards)
      } catch (err) {
        console.error('Failed to fetch cards:', err)
        setError('Failed to load cards. Please try refreshing the page.')
      } finally {
        setIsLoading(false)
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

  // Extract leaders and bases for the selector
  const leaders = cards.filter(card => card.type === 'leader')
  const bases = cards.filter(card => card.type === 'base')

  // Show loading state
  if (isLoading) {
    return (
      <main className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-white mb-2">Loading Star Wars Unlimited Cards</h2>
          <p className="text-white/60">Fetching card data from the database...</p>
        </div>
      </main>
    )
  }

  // Show error state
  if (error) {
    return (
      <main className="space-y-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Failed to Load Cards</h2>
          <p className="text-white/60 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </main>
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
                      selectedRarities={selectedRarities}
                      onRaritiesChange={setSelectedRarities}
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
          <DeckStatistics allCards={cards} />
          <QuickActions ref={quickActionsRef} allCards={cards} />
          <KeyboardShortcuts 
            onClearDeck={() => quickActionsRef.current?.handleClearDeck()}
            onAutoFill={() => quickActionsRef.current?.handleAutoFill()}
            onRandomDeck={() => quickActionsRef.current?.handleRandomDeck()}
            onBalanceAspects={() => quickActionsRef.current?.handleBalanceAspects()}
          />
        </div>
      </div>
    </main>
  )
}