"use client"

import { create } from 'zustand'
import type { DeckVersion, DeckEntry, Card } from '@/lib/types'

interface DeckState {
  version: DeckVersion
  selectedLeader: Card | null
  selectedBase: Card | null
  setLeader: (leader: Card | null) => void
  setBase: (base: Card | null) => void
  setEntryCount: (cardId: string, count: number, area: 'main' | 'side' | 'overflow') => void
  getCardCount: (cardId: string, area: 'main' | 'side' | 'overflow') => number
  getTotalCount: (area: 'main' | 'side' | 'overflow') => number
  getMainDeckCards: () => Array<{ cardId: string; count: number }>
  getSideboardCards: () => Array<{ cardId: string; count: number }>
  getOverflowCards: () => Array<{ cardId: string; count: number }>
  getCardById: (cardId: string, allCards: Card[]) => Card | undefined
  validateDeck: () => { isValid: boolean; errors: string[]; warnings: string[] }
  getAspectSynergies: (allCards: Card[]) => Array<{ card: Card; synergies: string[] }>
}

const emptyVersion: DeckVersion = {
  leaderId: null,
  baseId: null,
  mainEntries: [],
  sideEntries: [],
  overflowEntries: [],
}

export const useDeckStore = create<DeckState>((set, get) => ({
  version: emptyVersion,
  selectedLeader: null,
  selectedBase: null,

  setLeader: (leader) => set((s) => ({
    selectedLeader: leader,
    version: { ...s.version, leaderId: leader?.id || null }
  })),

  setBase: (base) => set((s) => ({
    selectedBase: base,
    version: { ...s.version, baseId: base?.id || null }
  })),

  setEntryCount: (cardId, count, area) =>
    set((state) => {
      const cloneEntries = (entries: DeckEntry[]) => entries.filter((e) => e.cardId !== cardId)
      const nextEntry = count > 0 ? [{ cardId, count }] : []

      if (area === 'main') {
        return {
          version: {
            ...state.version,
            mainEntries: [...cloneEntries(state.version.mainEntries), ...nextEntry],
          },
        }
      }
      if (area === 'side') {
        return {
          version: {
            ...state.version,
            sideEntries: [...cloneEntries(state.version.sideEntries), ...nextEntry],
          },
        }
      }
      return {
        version: {
          ...state.version,
          overflowEntries: [...cloneEntries(state.version.overflowEntries), ...nextEntry],
        },
      }
    }),

  getCardCount: (cardId, area) => {
    const state = get()
    let entries: DeckEntry[] = []

    if (area === 'main') entries = state.version.mainEntries
    else if (area === 'side') entries = state.version.sideEntries
    else if (area === 'overflow') entries = state.version.overflowEntries

    const entry = entries.find(e => e.cardId === cardId)
    return entry?.count || 0
  },

  getTotalCount: (area) => {
    const state = get()
    let entries: DeckEntry[] = []

    if (area === 'main') entries = state.version.mainEntries
    else if (area === 'side') entries = state.version.sideEntries
    else if (area === 'overflow') entries = state.version.overflowEntries

    return entries.reduce((total, entry) => total + entry.count, 0)
  },

  getMainDeckCards: () => {
    const state = get()
    return state.version.mainEntries.map(entry => ({
      cardId: entry.cardId,
      count: entry.count
    }))
  },

  getSideboardCards: () => {
    const state = get()
    return state.version.sideEntries.map(entry => ({
      cardId: entry.cardId,
      count: entry.count
    }))
  },

  getOverflowCards: () => {
    const state = get()
    return state.version.overflowEntries.map(entry => ({
      cardId: entry.cardId,
      count: entry.count
    }))
  },

  // Helper function to get card by ID (will be used by components)
  getCardById: (cardId: string, allCards: Card[]): Card | undefined => {
    return allCards.find(card => card.id === cardId)
  },

  validateDeck: () => {
    const state = get()
    const errors: string[] = []
    const warnings: string[] = []

    // Check if leader and base are selected
    if (!state.selectedLeader) {
      errors.push('A leader must be selected')
    }
    if (!state.selectedBase) {
      errors.push('A base must be selected')
    }

    // Check main deck size (must be exactly 50 cards)
    const mainDeckCount = state.getTotalCount('main')
    if (mainDeckCount !== 50) {
      errors.push(`Main deck must contain exactly 50 cards (currently ${mainDeckCount})`)
    }

    // Check sideboard size (must be exactly 10 cards)
    const sideboardCount = state.getTotalCount('side')
    if (sideboardCount !== 10) {
      errors.push(`Sideboard must contain exactly 10 cards (currently ${sideboardCount})`)
    }

    // Check for overflow cards (should be 0 for a valid deck)
    const overflowCount = state.getTotalCount('overflow')
    if (overflowCount > 0) {
      errors.push(`Overflow contains ${overflowCount} cards - move them to main deck or sideboard`)
    }

    // Check aspect compatibility (leader and base should share at least one aspect)
    if (state.selectedLeader && state.selectedBase) {
      const leaderAspects = state.selectedLeader.aspects
      const baseAspects = state.selectedBase.aspects
      const sharedAspects = leaderAspects.filter(aspect => baseAspects.includes(aspect))
      
      if (sharedAspects.length === 0) {
        errors.push('Leader and base must share at least one aspect for a valid deck')
      } else if (sharedAspects.length === 1) {
        warnings.push('Leader and base share only one aspect - consider diversifying for more strategic options')
      }
    }

    // Check for unique card violations (unique cards can only have 1 copy)
    const mainEntries = state.version.mainEntries
    const sideEntries = state.version.sideEntries
    
    // This would need to be enhanced when we have access to allCards to check unique property
    // For now, we'll add a placeholder for this validation
    
    // Check cost curve balance (warnings, not errors)
    const mainDeckCards = mainEntries.map(entry => entry.count).reduce((sum, count) => sum + count, 0)
    if (mainDeckCards === 50) {
      // We could add cost curve analysis here when we have card data
      warnings.push('Consider analyzing your cost curve for optimal mana distribution')
    }

    // Check for aspect diversity (warnings, not errors)
    if (state.selectedLeader && state.selectedBase) {
      const allAspects = [...new Set([...state.selectedLeader.aspects, ...state.selectedBase.aspects])]
      if (allAspects.length < 3) {
        warnings.push('Consider including more aspects for strategic flexibility')
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  },

  getAspectSynergies: (allCards: Card[]) => {
    const state = get()
    if (!state.selectedLeader || !state.selectedBase) {
      return []
    }

    // Get all cards in the deck
    const deckCards: Card[] = []

    // Add leader and base
    deckCards.push(state.selectedLeader, state.selectedBase)

    // Add main deck cards
    state.version.mainEntries.forEach(entry => {
      const card = allCards.find(c => c.id === entry.cardId)
      if (card) {
        for (let i = 0; i < entry.count; i++) {
          deckCards.push(card)
        }
      }
    })

    // Analyze synergies between cards
    const synergies: Array<{ card: Card; synergies: string[] }> = []

    deckCards.forEach(card => {
      const cardSynergies: string[] = []

      // Check for aspect synergies
      const sharedAspects = card.aspects.filter(aspect => 
        state.selectedLeader?.aspects.includes(aspect) || 
        state.selectedBase?.aspects.includes(aspect)
      )
      
      if (sharedAspects.length > 0) {
        cardSynergies.push(`Shares ${sharedAspects.join(', ')} aspect(s)`)
      }

      // Check for text-based synergies
      if (card.text) {
        const text = card.text.toLowerCase()
        
        // Look for combo potential
        deckCards.forEach(otherCard => {
          if (otherCard.id !== card.id && otherCard.text) {
            const otherText = otherCard.text.toLowerCase()
            
            // Check for trigger synergies
            if (text.includes('when played') && otherText.includes('ambush')) {
              cardSynergies.push('Combo: Can trigger "when played" effects with Ambush cards')
            }
            
            if (text.includes('bounce') && otherText.includes('when this enters play')) {
              cardSynergies.push('Combo: Bounce + ETB effects for card advantage')
            }
          }
        })
      }

      if (cardSynergies.length > 0) {
        synergies.push({ card, synergies: cardSynergies })
      }
    })

    return synergies
  },
}))