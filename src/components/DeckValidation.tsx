"use client"

import { useDeckStore } from '@/store/deckStore'

export function DeckValidation() {
  const { validateDeck, getTotalCount } = useDeckStore()
  
  const validation = validateDeck()
  const mainDeckCount = getTotalCount('main')
  const sideboardCount = getTotalCount('side')
  const overflowCount = getTotalCount('overflow')

  const getProgressColor = (count: number, target: number) => {
    if (count === target) return 'text-green-400'
    if (count > target) return 'text-red-400'
    if (count >= target * 0.8) return 'text-yellow-400'
    return 'text-white/60'
  }

  const getProgressBarColor = (count: number, target: number) => {
    if (count === target) return 'bg-green-500'
    if (count > target) return 'bg-red-500'
    if (count >= target * 0.8) return 'bg-yellow-500'
    return 'bg-white/20'
  }

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
      <h3 className="text-lg font-semibold text-white mb-4">Deck Status</h3>
      
      {/* Progress Bars */}
      <div className="space-y-4">
        {/* Main Deck */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-white/80">Main Deck</span>
            <span className="text-white/60 font-mono">{mainDeckCount}/50</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                mainDeckCount === 50 ? 'bg-green-500' : 
                mainDeckCount >= 45 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(100, (mainDeckCount / 50) * 100)}%` }}
            />
          </div>
        </div>

        {/* Sideboard */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-white/80">Sideboard</span>
            <span className="text-white/60 font-mono">{sideboardCount}/10</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                sideboardCount === 10 ? 'bg-green-500' : 
                sideboardCount >= 8 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(100, (sideboardCount / 10) * 100)}%` }}
            />
          </div>
        </div>

        {/* Overflow */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-white/80">Overflow</span>
            <span className="text-white/60 font-mono">{overflowCount}</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                overflowCount === 0 ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(100, overflowCount * 10)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Validation Status */}
      <div className="mt-4 pt-4 border-t border-white/10">
        {validation.isValid ? (
          <div className="flex items-center gap-2 text-green-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">Deck is valid!</span>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-red-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="font-medium">Deck has issues:</span>
            </div>
            <ul className="text-sm text-white/80 space-y-1 ml-7">
              {validation.errors.map((error, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>{error}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
} 