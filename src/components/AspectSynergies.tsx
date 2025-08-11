"use client"

import { useMemo } from 'react'
import { useDeckStore } from '@/store/deckStore'
import type { Card } from '@/lib/types'

interface AspectSynergiesProps {
  allCards: Card[]
}

export function AspectSynergies({ allCards }: AspectSynergiesProps) {
  const { selectedLeader, selectedBase, getMainDeckCards } = useDeckStore()
  
  // Enhanced synergy detection logic
  const getSynergyScore = (card: Card): { score: number; reasons: string[] } => {
    const reasons: string[] = []
    let score = 0

    // Aspect synergy (higher weight)
    if (selectedLeader && card.aspects.some(aspect => selectedLeader.aspects.includes(aspect))) {
      score += 3
      reasons.push(`Shares ${card.aspects.filter(a => selectedLeader.aspects.includes(a)).join(', ')} aspect with leader`)
    }
    
    if (selectedBase && card.aspects.some(aspect => selectedBase.aspects.includes(aspect))) {
      score += 2
      reasons.push(`Shares ${card.aspects.filter(a => selectedBase.aspects.includes(a)).join(', ')} aspect with base`)
    }

    // Text-based synergies
    if (card.text) {
      const text = card.text.toLowerCase()
      
      // High-value synergies
      if (text.includes('when played') || text.includes('when this enters play')) {
        score += 4
        reasons.push('Has "when played" trigger - great for combos')
      }
      
      if (text.includes('ambush')) {
        score += 4
        reasons.push('Has Ambush - can surprise opponents')
      }
      
      if (text.includes('bounce') || text.includes('return to hand')) {
        score += 3
        reasons.push('Has bounce effect - good for card advantage')
      }
      
      if (text.includes('draw') || text.includes('card')) {
        score += 3
        reasons.push('Provides card draw')
      }
      
      if (text.includes('heal') || text.includes('health')) {
        score += 2
        reasons.push('Provides healing/survivability')
      }
      
      if (text.includes('attack') || text.includes('damage')) {
        score += 2
        reasons.push('Provides attack/damage')
      }
      
      if (text.includes('control') || text.includes('stun')) {
        score += 2
        reasons.push('Provides control effects')
      }
    }

    // Cost curve considerations
    if (card.cost !== null && card.cost !== undefined) {
      if (card.cost <= 2) {
        score += 1
        reasons.push('Low cost - good for early game')
      } else if (card.cost >= 5) {
        score += 1
        reasons.push('High cost - good for late game')
      }
    }

    // Unique card bonus
    if (card.unique) {
      score += 1
      reasons.push('Unique card - powerful effect')
    }

    return { score, reasons }
  }

  const recommendedCards = useMemo(() => {
    if (!selectedLeader || !selectedBase) return []

    const availableCards = allCards.filter(card => {
      const mainCount = getMainDeckCards().find(entry => entry.cardId === card.id)?.count || 0
      return mainCount === 0 // Only show cards not in main deck
    })

    return availableCards
      .map(card => ({
        card,
        ...getSynergyScore(card)
      }))
      .filter(item => item.score > 0) // Only show cards with some synergy
      .sort((a, b) => b.score - a.score) // Sort by synergy score
      .slice(0, 12) // Top 12 recommendations
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

  if (recommendedCards.length === 0) {
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
        {recommendedCards.map((item) => (
          <div
            key={item.card.id}
            className="p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <div className="flex items-start gap-3">
              {item.card.imageUrl && (
                <img
                  src={item.card.imageUrl}
                  alt={item.card.name}
                  className="w-12 h-16 object-cover rounded border border-white/20 flex-shrink-0"
                />
              )}
              <div className="min-w-0 flex-1">
                <h5 className="font-medium text-white text-sm leading-tight mb-1">
                  {item.card.name}
                </h5>
                <div className="flex items-center gap-1 mb-2">
                  {item.card.aspects.map((aspect) => (
                    <span
                      key={aspect}
                      className="w-2 h-2 rounded-full bg-blue-400"
                      title={aspect}
                    />
                  ))}
                </div>
                <div className="text-xs text-white/60">
                  {item.card.type} • {item.card.cost !== null ? `${item.card.cost} cost` : 'No cost'}
                </div>
                {item.card.text && (
                  <p className="text-xs text-white/70 mt-2 line-clamp-2">
                    {item.card.text}
                  </p>
                )}
                                 <div className="text-xs text-white/50 mt-1">
                   <div className="font-medium text-blue-300">Synergy Score: {item.score}</div>
                   {item.reasons.length > 0 && (
                     <div className="mt-1 space-y-1">
                       {item.reasons.slice(0, 2).map((reason, idx) => (
                         <div key={idx} className="text-white/60 text-xs leading-tight">
                           • {reason}
                         </div>
                       ))}
                       {item.reasons.length > 2 && (
                         <div className="text-white/40 text-xs">
                           +{item.reasons.length - 2} more reasons
                         </div>
                       )}
                     </div>
                   )}
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 