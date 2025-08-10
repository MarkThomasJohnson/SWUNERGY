export type Aspect = 'aggression' | 'cunning' | 'command' | 'vigilance' | 'heroism' | 'villainy'

export interface Card {
  id: string
  name: string
  setCode: string
  collectorNumber: string
  type: 'unit' | 'event' | 'upgrade' | 'base' | 'leader'
  cost?: number
  aspects: Aspect[]
  traits: string[]
  keywords: string[]
  unique: boolean
  text?: string
  imageUrl?: string
}

export interface DeckEntry {
  cardId: string
  count: number // 1-3 for main deck
}

export interface DeckVersion {
  leaderId: string | null
  baseId: string | null
  mainEntries: DeckEntry[]
  sideEntries: DeckEntry[]
  overflowEntries: DeckEntry[]
  notes?: string
}

export interface Deck {
  id: string
  userId: string
  name: string
  visibility: 'private' | 'unlisted' | 'public'
  createdAt: string
  updatedAt: string
  current: DeckVersion
}