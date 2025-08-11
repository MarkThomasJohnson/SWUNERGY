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
  validateDeck: () => { isValid: boolean; errors: string[] }
  getAspectSynergies: () => Array<{ card: Card; synergies: string[] }>
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

  validateDeck: () => {
    const state = get()
    const errors: string[] = []

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

    return {
      isValid: errors.length === 0,
      errors
    }
  },

  getAspectSynergies: () => {
    const state = get()
    if (!state.selectedLeader || !state.selectedBase) {
      return []
    }

    // Get all cards in the deck
    const allCards: Card[] = []

    // Add leader and base
    allCards.push(state.selectedLeader, state.selectedBase)

    // Add main deck cards (we'd need to fetch the actual Card objects here)
    // For now, return empty array - this will be enhanced when we have card lookup
    return []
  },
}))