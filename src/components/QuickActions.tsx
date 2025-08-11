"use client"

import { useState, useImperativeHandle, forwardRef } from 'react'
import { useDeckStore } from '@/store/deckStore'
import type { Card } from '@/lib/types'
import type { Aspect } from '@/lib/types'

interface QuickActionsProps {
  allCards: Card[]
}

export interface QuickActionsRef {
  handleClearDeck: () => void
  handleAutoFill: () => void
  handleRandomDeck: () => void
  handleBalanceAspects: () => void
}

export const QuickActions = forwardRef<QuickActionsRef, QuickActionsProps>(({ allCards }, ref) => {
  const { selectedLeader, selectedBase, setEntryCount, getMainDeckCards, getCardById } = useDeckStore()
  const [isLoading, setIsLoading] = useState(false)

  // Expose functions to parent component
  useImperativeHandle(ref, () => ({
    handleClearDeck,
    handleAutoFill,
    handleRandomDeck,
    handleBalanceAspects
  }), [])

  const handleClearDeck = () => {
    if (confirm('Are you sure you want to clear the entire deck?')) {
      const mainDeckEntries = getMainDeckCards()
      mainDeckEntries.forEach(entry => {
        setEntryCount(entry.cardId, 0, 'main')
      })
    }
  }

  const handleAutoFill = () => {
    if (!selectedLeader || !selectedBase) {
      alert('Please select a leader and base first')
      return
    }

    setIsLoading(true)
    
    // Simple auto-fill logic: add random cards that share aspects with leader/base
    const sharedAspects = selectedLeader.aspects.filter(aspect => 
      selectedBase.aspects.includes(aspect)
    )
    
    if (sharedAspects.length === 0) {
      alert('Leader and base must share at least one aspect')
      setIsLoading(false)
      return
    }

    const currentMainDeck = getMainDeckCards()
    const currentCount = currentMainDeck.reduce((sum, entry) => sum + entry.count, 0)
    const remainingSlots = 50 - currentCount

    if (remainingSlots <= 0) {
      alert('Deck is already full!')
      setIsLoading(false)
      return
    }

    // Get cards that share aspects and aren't already in the deck
    const availableCards = allCards.filter(card => {
      const isCompatible = card.aspects.some(aspect => sharedAspects.includes(aspect))
      const isNotInDeck = !currentMainDeck.some(entry => entry.cardId === card.id)
      return isCompatible && isNotInDeck && card.type !== 'leader' && card.type !== 'base'
    })

    // Randomly select cards to fill remaining slots
    const shuffled = availableCards.sort(() => 0.5 - Math.random())
    let addedCount = 0

    for (const card of shuffled) {
      if (addedCount >= remainingSlots) break
      
      const maxToAdd = Math.min(3, remainingSlots - addedCount) // Max 3 of any card
      const currentCount = currentMainDeck.find(entry => entry.cardId === card.id)?.count || 0
      const canAdd = Math.min(maxToAdd, 3 - currentCount)
      
      if (canAdd > 0) {
        setEntryCount(card.id, currentCount + canAdd, 'main')
        addedCount += canAdd
      }
    }

    setIsLoading(false)
    alert(`Added ${addedCount} cards to complete your deck!`)
  }

  const handleRandomDeck = () => {
    if (!selectedLeader || !selectedBase) {
      alert('Please select a leader and base first')
      return
    }

    if (confirm('This will replace your current deck with a random one. Continue?')) {
      setIsLoading(true)
      
      // Clear current deck
      const currentMainDeck = getMainDeckCards()
      currentMainDeck.forEach(entry => {
        setEntryCount(entry.cardId, 0, 'main')
      })

      // Get shared aspects
      const sharedAspects = selectedLeader.aspects.filter(aspect => 
        selectedBase.aspects.includes(aspect)
      )
      
      if (sharedAspects.length === 0) {
        alert('Leader and base must share at least one aspect')
        setIsLoading(false)
        return
      }

      // Get compatible cards
      const compatibleCards = allCards.filter(card => {
        const isCompatible = card.aspects.some(aspect => sharedAspects.includes(aspect))
        return isCompatible && card.type !== 'leader' && card.type !== 'base'
      })

      // Randomly build deck
      const shuffled = compatibleCards.sort(() => 0.5 - Math.random())
      let remainingSlots = 50

      for (const card of shuffled) {
        if (remainingSlots <= 0) break
        
        const maxToAdd = Math.min(3, remainingSlots)
        const toAdd = Math.floor(Math.random() * maxToAdd) + 1
        
        setEntryCount(card.id, toAdd, 'main')
        remainingSlots -= toAdd
      }

      setIsLoading(false)
      alert('Random deck generated!')
    }
  }

  const handleBalanceAspects = () => {
    if (!selectedLeader || !selectedBase) {
      alert('Please select a leader and base first')
      return
    }

    setIsLoading(true)
    
    // Get current deck composition
    const mainDeckEntries = getMainDeckCards()
    const mainDeckCards: Card[] = []
    
    mainDeckEntries.forEach(entry => {
      const card = getCardById(entry.cardId, allCards)
      if (card) {
        for (let i = 0; i < entry.count; i++) {
          mainDeckCards.push(card)
        }
      }
    })

    // Count aspects
    const aspectCounts = new Map<string, number>()
    mainDeckCards.forEach(card => {
      card.aspects.forEach(aspect => {
        const current = aspectCounts.get(aspect) ?? 0
        aspectCounts.set(aspect, current + 1)
      })
    })

    // Find underrepresented aspects
    const sharedAspects = selectedLeader.aspects.filter(aspect => 
      selectedBase.aspects.includes(aspect)
    )
    
    const avgPerAspect = 50 / sharedAspects.length
    const underrepresented: Aspect[] = []
    
    sharedAspects.forEach((aspect: Aspect) => {
      const count = aspectCounts.get(aspect) ?? 0
      if (count < avgPerAspect * 0.7) { // 30% below average
        underrepresented.push(aspect)
      }
    })

    if (underrepresented.length === 0) {
      alert('Your deck is already well-balanced!')
      setIsLoading(false)
      return
    }

    // Try to add cards for underrepresented aspects
    let addedCount = 0
    const currentTotal = mainDeckCards.length
    
    for (const aspect of underrepresented) {
      if (currentTotal + addedCount >= 50) break
      
      const aspectCards = allCards.filter(card => 
        card.aspects.includes(aspect) && 
        card.type !== 'leader' && 
        card.type !== 'base' &&
        !mainDeckEntries.some(entry => entry.cardId === card.id)
      )
      
      if (aspectCards.length > 0) {
        const card = aspectCards[Math.floor(Math.random() * aspectCards.length)]
        const currentCount = mainDeckEntries.find(entry => entry.cardId === card.id)?.count || 0
        const canAdd = Math.min(3 - currentCount, 50 - currentTotal - addedCount)
        
        if (canAdd > 0) {
          setEntryCount(card.id, currentCount + canAdd, 'main')
          addedCount += canAdd
        }
      }
    }

    setIsLoading(false)
    if (addedCount > 0) {
      alert(`Added ${addedCount} cards to balance your deck's aspects!`)
    } else {
      alert('Could not add more cards to balance aspects (deck may be full)')
    }
  }

  if (!selectedLeader || !selectedBase) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
        <h3 className="text-lg font-medium text-white mb-4">Quick Actions</h3>
        <div className="text-center py-8 text-white/50">
          <svg className="w-12 h-12 mx-auto mb-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <p className="text-lg font-medium">Select a leader and base</p>
          <p className="text-sm">to access quick deck actions</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
      <h3 className="text-lg font-medium text-white mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleClearDeck}
          disabled={isLoading}
          className="p-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="text-sm font-medium">Clear Deck</div>
          <div className="text-xs text-red-300/60">Remove all cards</div>
        </button>

        <button
          onClick={handleAutoFill}
          disabled={isLoading}
          className="p-3 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="text-sm font-medium">Auto-Fill</div>
          <div className="text-xs text-blue-300/60">Complete deck</div>
        </button>

        <button
          onClick={handleRandomDeck}
          disabled={isLoading}
          className="p-3 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="text-sm font-medium">Random Deck</div>
          <div className="text-xs text-purple-300/60">Generate new</div>
        </button>

        <button
          onClick={handleBalanceAspects}
          disabled={isLoading}
          className="p-3 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="text-sm font-medium">Balance</div>
          <div className="text-xs text-green-300/60">Fix aspects</div>
        </button>
      </div>

      {isLoading && (
        <div className="mt-4 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-sm text-white/60">Processing...</p>
        </div>
      )}
    </div>
  )
}) 