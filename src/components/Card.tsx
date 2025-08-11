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
        {/* Card Image */}
        {showImage && card.imageUrl && (
          <img
            src={card.imageUrl}
            alt={card.name}
            className="w-12 h-16 object-cover rounded border border-white/20 flex-shrink-0"
          />
        )}
        
        {/* Card Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h5 className="font-medium text-white text-sm leading-tight mb-1 line-clamp-2">
                {card.name}
              </h5>
              <div className="flex items-center gap-1 mb-2 flex-wrap">
                {card.aspects.map((aspect) => (
                  <span
                    key={aspect}
                    className="w-3 h-3 rounded-full bg-blue-400 flex-shrink-0"
                    title={aspect}
                  />
                ))}
                {card.unique && (
                  <span className="text-xs text-yellow-400 font-medium px-1.5 py-0.5 bg-yellow-400/10 rounded">
                    Unique
                  </span>
                )}
              </div>
              <div className="text-xs text-white/60 mb-2">
                {card.type} • {card.cost !== null ? `${card.cost} cost` : 'No cost'}
                {card.attack !== null && ` • ${card.attack} ATK`}
                {card.health !== null && ` • ${card.health} HP`}
              </div>
              {card.text && (
                <p className="text-xs text-white/70 line-clamp-2">
                  {card.text}
                </p>
              )}
            </div>
            
            {/* Count Controls */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className="text-center">
                <div className="text-lg font-bold text-white">{count}</div>
                <div className="text-xs text-white/60">count</div>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => onCountChange(count + 1)}
                  className="w-8 h-8 rounded bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-colors flex items-center justify-center"
                  title="Add card"
                >
                  +
                </button>
                <button
                  onClick={() => onCountChange(Math.max(0, count - 1))}
                  className="w-8 h-8 rounded bg-red-600 hover:bg-red-500 text-white text-sm font-bold transition-colors flex items-center justify-center"
                  title="Remove card"
                >
                  -
                </button>
              </div>
            </div>
          </div>
          
          {/* Area Controls (if enabled) */}
          {showAreaControls && (
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between text-xs text-white/60 mb-2">
                <span>Move to:</span>
                <span className="text-white/80">
                  Main: {getAreaCount('main')} | Side: {getAreaCount('side')} | Overflow: {getAreaCount('overflow')}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => moveToArea('main')}
                  disabled={getAreaCount('main') >= 3}
                  className="px-3 py-1.5 text-xs rounded bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                >
                  Main Deck
                </button>
                <button
                  onClick={() => moveToArea('side')}
                  disabled={getAreaCount('side') >= 3}
                  className="px-3 py-1.5 text-xs rounded bg-yellow-600 hover:bg-yellow-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                >
                  Sideboard
                </button>
                <button
                  onClick={() => moveToArea('overflow')}
                  className="px-3 py-1.5 text-xs rounded bg-red-600 hover:bg-red-500 transition-colors"
                >
                  Overflow
                </button>
              </div>
            </div>
          )}
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