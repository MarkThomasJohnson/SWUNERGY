"use client"

import { useMemo } from 'react'
import { useDeckStore } from '@/store/deckStore'
import type { Card } from '@/lib/types'

interface AspectSynergiesProps {
  allCards: Card[]
}

export function AspectSynergies({ allCards }: AspectSynergiesProps) {
  const { selectedLeader, selectedBase, getMainDeckCards } = useDeckStore()
  
  const synergies = useMemo(() => {
    if (!selectedLeader || !selectedBase) return []

    const leaderAspects = selectedLeader.aspects
    const baseAspects = selectedBase.aspects
    const allAspects = [...new Set([...leaderAspects, ...baseAspects])]
    
    const mainDeckEntries = getMainDeckCards()
    const mainDeckCardIds = new Set(mainDeckEntries.map(entry => entry.cardId))

    // Find cards that share aspects with leader/base
    const aspectMatches = allCards.filter(card => {
      // Skip if already in main deck
      if (mainDeckCardIds.has(card.id)) return false
      
      // Check if card shares any aspects with leader or base
      return card.aspects.some(aspect => allAspects.includes(aspect))
    })

    // Find cards with synergistic abilities
    const synergisticCards = allCards.filter(card => {
      if (mainDeckCardIds.has(card.id)) return false
      
      const cardText = card.text?.toLowerCase() || ''
      const leaderText = selectedLeader.text?.toLowerCase() || ''
      const baseText = selectedBase.text?.toLowerCase() || ''
      
      // Look for synergistic keywords
      const synergyKeywords = [
        'when played', 'ambush', 'bounce', 'return to hand', 'draw', 'discard',
        'damage', 'heal', 'protect', 'shield', 'stun', 'exhaust', 'ready'
      ]
      
      return synergyKeywords.some(keyword => 
        cardText.includes(keyword) || 
        leaderText.includes(keyword) || 
        baseText.includes(keyword)
      )
    })

    // Combine and sort by relevance
    const allRecommendations = [...aspectMatches, ...synergisticCards]
    const uniqueRecommendations = allRecommendations.filter((card, index, self) => 
      index === self.findIndex(c => c.id === card.id)
    )

    return uniqueRecommendations.slice(0, 12) // Show top 12 recommendations
  }, [selectedLeader, selectedBase, allCards, getMainDeckCards])

  if (!selectedLeader || !selectedBase) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
        <h3 className="text-lg font-medium text-white mb-4">Card Recommendations</h3>
        <div className="text-center py-8 text-white/50">
          <svg className="w-12 h-12 mx-auto mb-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <p className="text-lg font-medium">Select a leader and base</p>
          <p className="text-sm">to see card recommendations and synergies</p>
        </div>
      </div>
    )
  }

  if (synergies.length === 0) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
        <h3 className="text-lg font-medium text-white mb-4">Card Recommendations</h3>
        <div className="text-center py-8 text-white/50">
          <svg className="w-12 h-12 mx-auto mb-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <p className="text-lg font-medium">No recommendations found</p>
          <p className="text-sm">Try adding more cards to see synergies</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
      <h3 className="text-lg font-medium text-white mb-4">Card Recommendations</h3>
      
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-white/60">Based on:</span>
          <div className="flex gap-2">
            {selectedLeader.aspects.map((aspect) => (
              <span
                key={aspect}
                className="px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-300 rounded border border-blue-500/30"
              >
                {aspect}
              </span>
            ))}
            {selectedBase.aspects.map((aspect) => (
              <span
                key={aspect}
                className="px-2 py-1 text-xs font-medium bg-green-500/20 text-green-300 rounded border border-green-500/30"
              >
                {aspect}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {synergies.map((card) => (
          <div
            key={card.id}
            className="p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <div className="flex items-start gap-3">
              {card.imageUrl && (
                <img
                  src={card.imageUrl}
                  alt={card.name}
                  className="w-12 h-16 object-cover rounded border border-white/20 flex-shrink-0"
                />
              )}
              <div className="min-w-0 flex-1">
                <h5 className="font-medium text-white text-sm leading-tight mb-1">
                  {card.name}
                </h5>
                <div className="flex items-center gap-1 mb-2">
                  {card.aspects.map((aspect) => (
                    <span
                      key={aspect}
                      className="w-2 h-2 rounded-full bg-blue-400"
                      title={aspect}
                    />
                  ))}
                </div>
                <div className="text-xs text-white/60">
                  {card.type} • {card.cost !== null ? `${card.cost} cost` : 'No cost'}
                </div>
                {card.text && (
                  <p className="text-xs text-white/70 mt-2 line-clamp-2">
                    {card.text}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 