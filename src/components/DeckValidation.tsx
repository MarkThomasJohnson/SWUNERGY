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
      <h3 className="text-lg font-medium text-white mb-4">Deck Status</h3>
      
      {/* Progress Bars */}
      <div className="space-y-4 mb-6">
        {/* Main Deck Progress */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-white/80">Main Deck</span>
            <span className={`text-sm font-medium ${getProgressColor(mainDeckCount, 50)}`}>
              {mainDeckCount}/50
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(mainDeckCount, 50)}`}
              style={{ width: `${Math.min((mainDeckCount / 50) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Sideboard Progress */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-white/80">Sideboard</span>
            <span className={`text-sm font-medium ${getProgressColor(sideboardCount, 10)}`}>
              {sideboardCount}/10
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(sideboardCount, 10)}`}
              style={{ width: `${Math.min((sideboardCount / 10) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Overflow Warning */}
        {overflowCount > 0 && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-white/80">Overflow</span>
              <span className="text-sm font-medium text-red-400">
                {overflowCount} cards
              </span>
            </div>
            <div className="w-full bg-red-500/20 rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-red-500 transition-all duration-300"
                style={{ width: `${Math.min((overflowCount / 10) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Validation Status */}
      <div className="space-y-3">
        {validation.isValid ? (
          <div className="flex items-center gap-2 text-green-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">Deck is valid and ready to play!</span>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 text-red-400 mb-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="font-medium">Deck validation errors:</span>
            </div>
            <ul className="space-y-1">
              {validation.errors.map((error, index) => (
                <li key={index} className="text-sm text-red-300 flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">•</span>
                  {error}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
} 