"use client"

import { useState } from 'react'
import { useDeckStore } from '@/store/deckStore'
import { CardComponent } from './Card'
import type { Card } from '@/lib/types'

interface DeckAreasProps {
  allCards: Card[]
}

export function DeckAreas({ allCards }: DeckAreasProps) {
  const [activeTab, setActiveTab] = useState<'side' | 'overflow'>('side')
  const { getSideboardCards, getOverflowCards, setEntryCount } = useDeckStore()

  const sideboardCards = getSideboardCards()
  const overflowCards = getOverflowCards()

  const getCardById = (cardId: string): Card | undefined => {
    return allCards.find(card => card.id === cardId)
  }

  const handleCountChange = (cardId: string, count: number, area: 'side' | 'overflow') => {
    if (count === 0) {
      setEntryCount(cardId, 0, area)
    } else {
      setEntryCount(cardId, count, area)
    }
  }

  const moveToMainDeck = (cardId: string, area: 'side' | 'overflow') => {
    const currentCount = area === 'side' 
      ? getSideboardCards().find(e => e.cardId === cardId)?.count || 0
      : getOverflowCards().find(e => e.cardId === cardId)?.count || 0
    
    if (currentCount > 0) {
      // Remove from current area
      setEntryCount(cardId, 0, area)
      // Add to main deck
      setEntryCount(cardId, currentCount, 'main')
    }
  }

  const moveToOverflow = (cardId: string) => {
    const currentCount = getSideboardCards().find(e => e.cardId === cardId)?.count || 0
    
    if (currentCount > 0) {
      // Remove from sideboard
      setEntryCount(cardId, 0, 'side')
      // Add to overflow
      setEntryCount(cardId, currentCount, 'overflow')
    }
  }

  const moveToSide = (cardId: string) => {
    const currentCount = getOverflowCards().find(e => e.cardId === cardId)?.count || 0
    const sideboardCount = getSideboardCards().reduce((total, entry) => total + entry.count, 0)
    
    if (currentCount > 0 && sideboardCount + currentCount <= 10) {
      // Remove from overflow
      setEntryCount(cardId, 0, 'overflow')
      // Add to sideboard
      setEntryCount(cardId, currentCount, 'side')
    }
  }

  const tabs = [
    { id: 'side', label: 'Sideboard', count: sideboardCards.length, color: 'text-green-400' },
    { id: 'overflow', label: 'Overflow', count: overflowCards.length, color: 'text-red-400' },
  ] as const

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
      <h3 className="text-lg font-semibold text-white mb-4">Deck Areas</h3>
      
      {/* Tabs */}
      <div className="flex border-b border-white/10 mb-4">
        <button
          onClick={() => setActiveTab('side')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'side'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-white/60 hover:text-white/80'
          }`}
        >
          Sideboard ({sideboardCards.length})
        </button>
        <button
          onClick={() => setActiveTab('overflow')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'overflow'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-white/60 hover:text-white/80'
          }`}
        >
          Overflow ({overflowCards.length})
        </button>
      </div>

      {/* Content */}
      <div className="min-h-[200px]">
        {activeTab === 'side' ? (
          <div className="space-y-3">
            {sideboardCards.length === 0 ? (
              <div className="text-center py-8 text-white/40">
                <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-sm">No cards in sideboard</p>
                <p className="text-xs text-white/30 mt-1">Add cards to your sideboard to see them here</p>
              </div>
            ) : (
              sideboardCards.map((entry) => {
                const card = allCards.find(c => c.id === entry.cardId)
                if (!card) return null
                
                return (
                  <div key={entry.cardId} className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-white/5">
                    {card.imageUrl && (
                      <img
                        src={card.imageUrl}
                        alt={card.name}
                        className="w-12 h-16 object-cover rounded border border-white/20 flex-shrink-0"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <h5 className="font-medium text-white text-sm leading-tight mb-1 line-clamp-2">
                        {card.name}
                      </h5>
                      <div className="flex items-center gap-1 mb-2">
                        {card.aspects.map((aspect) => (
                          <span
                            key={aspect}
                            className="w-3 h-3 rounded-full bg-blue-400 flex-shrink-0"
                            title={aspect}
                          />
                        ))}
                        <span className="text-xs text-white/60 ml-2">
                          {card.type} • {card.cost !== null ? `${card.cost} cost` : 'No cost'}
                        </span>
                      </div>
                      <div className="text-xs text-white/60">
                        Count: {entry.count}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button
                        onClick={() => moveToMainDeck(entry.cardId, 'side')}
                        className="px-3 py-1.5 text-xs rounded bg-green-600 hover:bg-green-500 transition-colors"
                      >
                        To Main
                      </button>
                      <button
                        onClick={() => moveToOverflow(entry.cardId)}
                        className="px-3 py-1.5 text-xs rounded bg-red-600 hover:bg-red-500 transition-colors"
                      >
                        To Overflow
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {overflowCards.length === 0 ? (
              <div className="text-center py-8 text-white/40">
                <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="text-sm">No cards in overflow</p>
                <p className="text-xs text-white/30 mt-1">Cards will move here when sideboard is full</p>
              </div>
            ) : (
              overflowCards.map((entry) => {
                const card = allCards.find(c => c.id === entry.cardId)
                if (!card) return null
                
                return (
                  <div key={entry.cardId} className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-white/5">
                    {card.imageUrl && (
                      <img
                        src={card.imageUrl}
                        alt={card.name}
                        className="w-12 h-16 object-cover rounded border border-white/20 flex-shrink-0"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <h5 className="font-medium text-white text-sm leading-tight mb-1 line-clamp-2">
                        {card.name}
                      </h5>
                      <div className="flex items-center gap-1 mb-2">
                        {card.aspects.map((aspect) => (
                          <span
                            key={aspect}
                            className="w-3 h-3 rounded-full bg-blue-400 flex-shrink-0"
                            title={aspect}
                          />
                        ))}
                        <span className="text-xs text-white/60 ml-2">
                          {card.type} • {card.cost !== null ? `${card.cost} cost` : 'No cost'}
                        </span>
                      </div>
                      <div className="text-xs text-white/60">
                        Count: {entry.count}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button
                        onClick={() => moveToMainDeck(entry.cardId, 'overflow')}
                        className="px-3 py-1.5 text-xs rounded bg-green-600 hover:bg-green-500 transition-colors"
                      >
                        To Main
                      </button>
                      <button
                        onClick={() => moveToSide(entry.cardId)}
                        className="px-3 py-1.5 text-xs rounded bg-yellow-600 hover:bg-yellow-500 transition-colors"
                      >
                        To Side
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>
    </div>
  )
} 