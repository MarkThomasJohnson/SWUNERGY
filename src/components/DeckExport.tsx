"use client"

import { useDeckStore } from '@/store/deckStore'
import type { Card } from '@/lib/types'

interface DeckExportProps {
  allCards: Card[]
}

export function DeckExport({ allCards }: DeckExportProps) {
  const { selectedLeader, selectedBase, getMainDeckCards, getSideboardCards, getOverflowCards } = useDeckStore()

  const getCardById = (cardId: string): Card | undefined => {
    return allCards.find(card => card.id === cardId)
  }

  const exportAsJSON = () => {
    if (!selectedLeader || !selectedBase) {
      alert('Please select a leader and base first')
      return
    }

    const deckData = {
      name: `${selectedLeader.name} / ${selectedBase.name} Deck`,
      leader: {
        id: selectedLeader.id,
        name: selectedLeader.name,
        aspects: selectedLeader.aspects,
      },
      base: {
        id: selectedBase.id,
        name: selectedBase.name,
        aspects: selectedBase.aspects,
      },
      mainDeck: getMainDeckCards().map(entry => ({
        cardId: entry.cardId,
        count: entry.count,
        card: getCardById(entry.cardId),
      })),
      sideboard: getSideboardCards().map(entry => ({
        cardId: entry.cardId,
        count: entry.count,
        card: getCardById(entry.cardId),
      })),
      overflow: getOverflowCards().map(entry => ({
        cardId: entry.cardId,
        count: entry.count,
        card: getCardById(entry.cardId),
      })),
      exportDate: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(deckData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `${deckData.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`
    link.click()
    
    URL.revokeObjectURL(url)
  }

  const exportAsMelee = () => {
    if (!selectedLeader || !selectedBase) {
      alert('Please select a leader and base first')
      return
    }

    const mainDeck = getMainDeckCards()
    const sideboard = getSideboardCards()
    
    let meleeText = `${selectedLeader.name}\n${selectedBase.name}\n\n`
    
    // Add main deck cards
    mainDeck.forEach(entry => {
      const card = getCardById(entry.cardId)
      if (card) {
        meleeText += `${entry.count} ${card.name}\n`
      }
    })
    
    // Add sideboard cards
    if (sideboard.length > 0) {
      meleeText += `\nSideboard:\n`
      sideboard.forEach(entry => {
        const card = getCardById(entry.cardId)
        if (card) {
          meleeText += `${entry.count} ${card.name}\n`
        }
      })
    }

    const dataBlob = new Blob([meleeText], { type: 'text/plain' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `${selectedLeader.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_melee.txt`
    link.click()
    
    URL.revokeObjectURL(url)
  }

  const canExport = selectedLeader && selectedBase

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
      <h3 className="text-lg font-medium text-white mb-4">Export Deck</h3>
      
      {!canExport ? (
        <div className="text-center py-6 text-white/50">
          <svg className="w-12 h-12 mx-auto mb-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm">Select a leader and base to export your deck</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-sm text-white/70 mb-4">
            <p className="mb-2">Export your deck in different formats:</p>
            <ul className="space-y-1 text-xs text-white/60">
              <li>• <strong>JSON:</strong> Complete deck data for import/backup</li>
              <li>• <strong>Melee:</strong> Text format compatible with Melee.gg</li>
            </ul>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={exportAsJSON}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Export as JSON
            </button>
            <button
              onClick={exportAsMelee}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              Export as Melee
            </button>
          </div>
          
          <div className="text-xs text-white/50 text-center">
            Deck: {selectedLeader.name} / {selectedBase.name}
          </div>
        </div>
      )}
    </div>
  )
} 