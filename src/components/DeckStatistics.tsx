"use client"

import { useMemo } from 'react'
import { useDeckStore } from '@/store/deckStore'
import type { Card } from '@/lib/types'

interface DeckStatisticsProps {
  allCards: Card[]
}

export function DeckStatistics({ allCards }: DeckStatisticsProps) {
  const { selectedLeader, selectedBase, getMainDeckCards, getCardById } = useDeckStore()

  const statistics = useMemo(() => {
    if (!selectedLeader || !selectedBase) return null

    const mainDeckEntries = getMainDeckCards()
    const mainDeckCards: Card[] = []
    
    // Get actual card objects for analysis
    mainDeckEntries.forEach(entry => {
      const card = getCardById(entry.cardId, allCards)
      if (card) {
        for (let i = 0; i < entry.count; i++) {
          mainDeckCards.push(card)
        }
      }
    })

    // Cost curve analysis
    const costCurve = new Map<number, number>()
    for (let i = 0; i <= 8; i++) {
      costCurve.set(i, 0)
    }
    
    mainDeckCards.forEach(card => {
      const cost = card.cost ?? 0
      const current = costCurve.get(cost) ?? 0
      costCurve.set(cost, current + 1)
    })

    // Aspect distribution
    const aspectCounts = new Map<string, number>()
    mainDeckCards.forEach(card => {
      card.aspects.forEach(aspect => {
        const current = aspectCounts.get(aspect) ?? 0
        aspectCounts.set(aspect, current + 1)
      })
    })

    // Card type distribution
    const typeCounts = new Map<string, number>()
    mainDeckCards.forEach(card => {
      const current = typeCounts.get(card.type) ?? 0
      typeCounts.set(card.type, current + 1)
    })

    // Average cost
    const totalCost = mainDeckCards.reduce((sum, card) => sum + (card.cost ?? 0), 0)
    const averageCost = mainDeckCards.length > 0 ? (totalCost / mainDeckCards.length).toFixed(1) : '0'

    // Mana curve quality analysis
    const lowCostCards = mainDeckCards.filter(card => (card.cost ?? 0) <= 2).length
    const midCostCards = mainDeckCards.filter(card => (card.cost ?? 0) >= 3 && (card.cost ?? 0) <= 5).length
    const highCostCards = mainDeckCards.filter(card => (card.cost ?? 0) >= 6).length
    
    const curveQuality = (() => {
      if (lowCostCards < 15) return 'Poor - Need more low-cost cards'
      if (midCostCards < 20) return 'Fair - Could use more mid-cost cards'
      if (highCostCards > 8) return 'Fair - Too many high-cost cards'
      if (lowCostCards >= 18 && midCostCards >= 25 && highCostCards <= 6) return 'Excellent - Well-balanced curve'
      return 'Good - Decent curve distribution'
    })()

    return {
      costCurve: Array.from(costCurve.entries()).sort(([a], [b]) => a - b),
      aspectCounts: Array.from(aspectCounts.entries()).sort(([, a], [, b]) => b - a),
      typeCounts: Array.from(typeCounts.entries()).sort(([, a], [, b]) => b - a),
      averageCost,
      totalCards: mainDeckCards.length,
      curveQuality,
      lowCostCards,
      midCostCards,
      highCostCards
    }
  }, [selectedLeader, selectedBase, getMainDeckCards, getCardById, allCards])

  if (!selectedLeader || !selectedBase) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
        <h3 className="text-lg font-medium text-white mb-4">Deck Statistics</h3>
        <div className="text-center py-8 text-white/50">
          <svg className="w-12 h-12 mx-auto mb-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-lg font-medium">Select a leader and base</p>
          <p className="text-sm">to see deck statistics and analysis</p>
        </div>
      </div>
    )
  }

  if (!statistics) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
        <h3 className="text-lg font-medium text-white mb-4">Deck Statistics</h3>
        <div className="text-center py-8 text-white/50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-sm">Calculating statistics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
      <h3 className="text-lg font-medium text-white mb-4">Deck Statistics</h3>
      
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 rounded-lg bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-blue-400">{statistics.totalCards}</div>
          <div className="text-xs text-white/60">Total Cards</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-green-400">{statistics.averageCost}</div>
          <div className="text-xs text-white/60">Avg Cost</div>
        </div>
      </div>

      {/* Curve Quality */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-white/80 mb-3">Mana Curve Quality</h4>
        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
          <div className="text-sm text-white mb-2">{statistics.curveQuality}</div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="text-blue-400 font-medium">{statistics.lowCostCards}</div>
              <div className="text-white/60">Low (0-2)</div>
            </div>
            <div className="text-center">
              <div className="text-green-400 font-medium">{statistics.midCostCards}</div>
              <div className="text-white/60">Mid (3-5)</div>
            </div>
            <div className="text-center">
              <div className="text-yellow-400 font-medium">{statistics.highCostCards}</div>
              <div className="text-white/60">High (6+)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Curve */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-white/80 mb-3">Cost Curve</h4>
        <div className="space-y-2">
          {statistics.costCurve.map(([cost, count]) => (
            <div key={cost} className="flex items-center gap-3">
              <div className="w-8 text-sm text-white/60">{cost}</div>
              <div className="flex-1 bg-white/10 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-blue-500 h-full transition-all duration-300"
                  style={{ width: `${(count / Math.max(...statistics.costCurve.map(([, c]) => c))) * 100}%` }}
                />
              </div>
              <div className="w-8 text-sm text-white/80 text-right">{count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Aspect Distribution */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-white/80 mb-3">Aspect Distribution</h4>
        <div className="grid grid-cols-2 gap-2">
          {statistics.aspectCounts.map(([aspect, count]) => (
            <div key={aspect} className="flex items-center justify-between p-2 rounded bg-white/5">
              <span className="text-sm text-white/80 capitalize">{aspect}</span>
              <span className="text-sm font-medium text-white">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Card Type Distribution */}
      <div>
        <h4 className="text-sm font-medium text-white/80 mb-3">Card Types</h4>
        <div className="space-y-2">
          {statistics.typeCounts.map(([type, count]) => (
            <div key={type} className="flex items-center justify-between p-2 rounded bg-white/5">
              <span className="text-sm text-white/80 capitalize">{type}</span>
              <span className="text-sm font-medium text-white">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 