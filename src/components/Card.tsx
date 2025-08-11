"use client"

import { useState } from 'react'
import { useDeckStore } from '@/store/deckStore'
import type { Card as CardType } from '@/lib/types'

interface CardComponentProps {
  card: CardType
  count: number
  onCountChange: (count: number) => void
  compact?: boolean
  showImage?: boolean
  showAreaControls?: boolean
}

export function CardComponent({
  card,
  count,
  onCountChange,
  compact = false,
  showImage = true,
  showAreaControls = false,
}: CardComponentProps) {
  const [showAreaMenu, setShowAreaMenu] = useState(false)
  const { setEntryCount, getCardCount } = useDeckStore()

  const handleCountChange = (newCount: number) => {
    if (newCount < 0) return
    if (newCount > 3) return
    onCountChange(newCount)
  }

  const moveToArea = (area: 'main' | 'side' | 'overflow') => {
    const currentCount = getCardCount(card.id, 'main') + getCardCount(card.id, 'side') + getCardCount(card.id, 'overflow')
    if (currentCount === 0) return

    // Remove from all areas first
    setEntryCount(card.id, 0, 'main')
    setEntryCount(card.id, 0, 'side')
    setEntryCount(card.id, 0, 'overflow')

    // Add to selected area
    setEntryCount(card.id, currentCount, area)
    setShowAreaMenu(false)
  }

  const getAreaCount = (area: 'main' | 'side' | 'overflow') => {
    return getCardCount(card.id, area)
  }

  const totalCount = getAreaCount('main') + getAreaCount('side') + getAreaCount('overflow')

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
        {showImage && card.imageUrl && (
          <img
            src={card.imageUrl}
            alt={card.name}
            className="w-12 h-16 object-cover rounded border border-white/20 flex-shrink-0"
          />
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h5 className="font-medium text-white text-sm truncate">{card.name}</h5>
            {card.cost !== null && (
              <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded">
                {card.cost}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1">
              {card.aspects.map((aspect) => (
                <span
                  key={aspect}
                  className="w-2 h-2 rounded-full bg-blue-400"
                  title={aspect}
                />
              ))}
            </div>
            <span className="text-xs text-white/60">{card.type}</span>
          </div>

          {card.text && (
            <p className="text-xs text-white/70 line-clamp-2">{card.text}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Area Controls */}
          {showAreaControls && (
            <div className="relative">
              <button
                onClick={() => setShowAreaMenu(!showAreaMenu)}
                className="p-1 text-white/60 hover:text-white transition-colors"
                title="Move to different area"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>

              {showAreaMenu && (
                <div className="absolute right-0 top-full mt-1 w-32 bg-gray-800 border border-white/20 rounded-lg shadow-lg z-10">
                  <div className="py-1">
                    <button
                      onClick={() => moveToArea('main')}
                      className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                    >
                      Main Deck ({getAreaCount('main')})
                    </button>
                    <button
                      onClick={() => moveToArea('side')}
                      className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                    >
                      Sideboard ({getAreaCount('side')})
                    </button>
                    <button
                      onClick={() => moveToArea('overflow')}
                      className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                    >
                      Overflow ({getAreaCount('overflow')})
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Count Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleCountChange(count - 1)}
              disabled={count <= 0}
              className="w-6 h-6 rounded bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            
            <span className="w-8 text-center text-white font-medium">{count}</span>
            
            <button
              onClick={() => handleCountChange(count + 1)}
              disabled={count >= 3}
              className="w-6 h-6 rounded bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Gallery view (non-compact)
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors overflow-hidden">
      {showImage && card.imageUrl && (
        <div className="relative">
          <img
            src={card.imageUrl}
            alt={card.name}
            className="w-full h-48 object-cover"
          />
          {count > 0 && (
            <div className="absolute top-2 right-2 bg-black/80 text-white text-sm font-bold px-2 py-1 rounded">
              {count}
            </div>
          )}
        </div>
      )}
      
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <h5 className="font-medium text-white text-sm leading-tight">{card.name}</h5>
          {card.cost !== null && (
            <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded">
              {card.cost}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            {card.aspects.map((aspect) => (
              <span
                key={aspect}
                className="w-2 h-2 rounded-full bg-blue-400"
                title={aspect}
              />
            ))}
          </div>
          <span className="text-xs text-white/60">{card.type}</span>
        </div>

        {card.text && (
          <p className="text-xs text-white/70 line-clamp-3 mb-3">{card.text}</p>
        )}

        {/* Quick Add/Remove */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleCountChange(count - 1)}
              disabled={count <= 0}
              className="w-6 h-6 rounded bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            
            <span className="w-8 text-center text-white font-medium">{count}</span>
            
            <button
              onClick={() => handleCountChange(count + 1)}
              disabled={count >= 3}
              className="w-6 h-6 rounded bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {/* Area indicator */}
          {totalCount > 0 && (
            <div className="flex gap-1">
              {getAreaCount('main') > 0 && (
                <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                  Main: {getAreaCount('main')}
                </span>
              )}
              {getAreaCount('side') > 0 && (
                <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                  Side: {getAreaCount('side')}
                </span>
              )}
              {getAreaCount('overflow') > 0 && (
                <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded">
                  Overflow: {getAreaCount('overflow')}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 