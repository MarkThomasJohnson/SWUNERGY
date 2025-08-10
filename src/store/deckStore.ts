"use client"

import { create } from 'zustand'
import type { DeckVersion, DeckEntry } from '@/lib/types'

interface DeckState {
  version: DeckVersion
  setLeader: (leaderId: string | null) => void
  setBase: (baseId: string | null) => void
  setEntryCount: (cardId: string, count: number, area: 'main' | 'side' | 'overflow') => void
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
  setLeader: (leaderId) => set((s) => ({ version: { ...s.version, leaderId } })),
  setBase: (baseId) => set((s) => ({ version: { ...s.version, baseId } })),
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
}))