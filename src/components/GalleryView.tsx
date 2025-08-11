"use client"

import { useMemo } from 'react'
import { CardComponent } from './Card'
import type { Card } from '@/lib/types'

interface GalleryViewProps {
  cards: Card[]
  deckEntries: Array<{ cardId: string; count: number }>
  onCountChange: (cardId: string, count: number) => void
  searchQuery: string
  selectedAspects: string[]
  selectedTypes: string[]
  selectedSets: string[]
  selectedRarities: string[]
  onRaritiesChange: (rarities: string[]) => void
}

export function GalleryView({
  cards,
  deckEntries,
  onCountChange,
  searchQuery,
  selectedAspects,
  selectedTypes,
  selectedSets,
  selectedRarities,
  onRaritiesChange,
}: GalleryViewProps) {
  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesName = card.name.toLowerCase().includes(query)
        const matchesText = card.text?.toLowerCase().includes(query) || false
        const matchesTraits = card.traits.some(trait => 
          trait.toLowerCase().includes(query)
        )
        if (!matchesName && !matchesText && !matchesTraits) {
          return false
        }
      }

      // Aspect filter
      if (selectedAspects.length > 0) {
        if (!card.aspects.some(aspect => selectedAspects.includes(aspect))) {
          return false
        }
      }

      // Type filter
      if (selectedTypes.length > 0) {
        if (!selectedTypes.includes(card.type)) {
          return false
        }
      }

      // Set filter
      if (selectedSets.length > 0) {
        if (!selectedSets.includes(card.setCode)) {
          return false
        }
      }

      // Rarity filter
      if (selectedRarities.length > 0) {
        if (!card.rarity || !selectedRarities.includes(card.rarity)) {
          return false
        }
      }

      return true
    })
  }, [cards, searchQuery, selectedAspects, selectedTypes, selectedSets, selectedRarities])

  const sortedCards = useMemo(() => {
    return [...filteredCards].sort((a, b) => {
      // Sort by type first, then by cost, then by name
      const typeOrder = { leader: 0, base: 1, unit: 2, event: 3, upgrade: 4 }
      const typeDiff = (typeOrder[a.type] || 0) - (typeOrder[b.type] || 0)
      if (typeDiff !== 0) return typeDiff

      const costA = a.cost ?? 999
      const costB = b.cost ?? 999
      if (costA !== costB) return costA - costB

      return a.name.localeCompare(b.name)
    })
  }, [filteredCards])

  const getCardCount = (cardId: string) => {
    const entry = deckEntries.find(e => e.cardId === cardId)
    return entry?.count || 0
  }

  if (filteredCards.length === 0) {
    return (
      <div className="text-center py-12 text-white/50">
        <svg className="w-12 h-12 mx-auto mb-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-lg font-medium">No cards found</p>
        <p className="text-sm">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-white/60 mb-4">
        Showing {filteredCards.length} of {cards.length} cards
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {sortedCards.map((card) => (
          <CardComponent
            key={card.id}
            card={card}
            count={getCardCount(card.id)}
            onCountChange={(count) => onCountChange(card.id, count)}
            compact={false}
            showImage={true}
          />
        ))}
      </div>
    </div>
  )
} 