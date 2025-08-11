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

  const tabs = [
    { id: 'side', label: 'Sideboard', count: sideboardCards.length, color: 'text-green-400' },
    { id: 'overflow', label: 'Overflow', count: overflowCards.length, color: 'text-red-400' },
  ] as const

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
      <h3 className="text-lg font-medium text-white mb-4">Deck Areas</h3>
      
      {/* Tabs */}
      <div className="flex border-b border-white/10 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-white border-b-2 border-brand-500'
                : 'text-white/60 hover:text-white'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'side' && (
        <div>
          {sideboardCards.length === 0 ? (
            <div className="text-center py-8 text-white/50">
              <svg className="w-12 h-12 mx-auto mb-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-lg font-medium">Sideboard is empty</p>
              <p className="text-sm">Add cards to your sideboard to see them here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sideboardCards.map((entry) => {
                const card = getCardById(entry.cardId)
                if (!card) return null

                return (
                  <div key={entry.cardId} className="flex items-center gap-3">
                    <div className="flex-1">
                      <CardComponent
                        card={card}
                        count={entry.count}
                        onCountChange={(count) => handleCountChange(entry.cardId, count, 'side')}
                        compact={true}
                        showImage={false}
                      />
                    </div>
                    <button
                      onClick={() => moveToMainDeck(entry.cardId, 'side')}
                      className="px-3 py-1 text-xs bg-blue-500/20 text-blue-300 rounded border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
                      title="Move to main deck"
                    >
                      To Main
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'overflow' && (
        <div>
          {overflowCards.length === 0 ? (
            <div className="text-center py-8 text-white/50">
              <svg className="w-12 h-12 mx-auto mb-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H6m14 0l-7-7m7 7l-7 7" />
              </svg>
              <p className="text-lg font-medium">No overflow cards</p>
              <p className="text-sm">Cards will appear here when sideboard is full</p>
            </div>
          ) : (
            <div className="space-y-3">
              {overflowCards.map((entry) => {
                const card = getCardById(entry.cardId)
                if (!card) return null

                return (
                  <div key={entry.cardId} className="flex items-center gap-3">
                    <div className="flex-1">
                      <CardComponent
                        card={card}
                        count={entry.count}
                        onCountChange={(count) => handleCountChange(entry.cardId, count, 'overflow')}
                        compact={true}
                        showImage={false}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => moveToMainDeck(entry.cardId, 'overflow')}
                        className="px-3 py-1 text-xs bg-blue-500/20 text-blue-300 rounded border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
                        title="Move to main deck"
                      >
                        To Main
                      </button>
                      <button
                        onClick={() => {
                          // Move to sideboard if there's space
                          const sideboardCount = getSideboardCards().length
                          if (sideboardCount < 10) {
                            setEntryCount(entry.cardId, 0, 'overflow')
                            setEntryCount(entry.cardId, entry.count, 'side')
                          }
                        }}
                        disabled={getSideboardCards().length >= 10}
                        className="px-3 py-1 text-xs bg-green-500/20 text-green-300 rounded border border-green-500/30 hover:bg-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Move to sideboard"
                      >
                        To Side
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
} 