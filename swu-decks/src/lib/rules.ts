import type { Card, DeckVersion, Aspect } from '@/lib/types'

export const MIN_MAIN_CARDS = 50
export const MAX_COPIES = 3
export const SIDEBOARD_LIMIT = 10

export type DeckIssue = {
  level: 'error' | 'warning'
  code:
    | 'MAIN_SIZE_UNDER_MIN'
    | 'COPIES_OVER_LIMIT'
    | 'SIDEBOARD_OVER_LIMIT'
    | 'LEADER_MISSING'
    | 'BASE_MISSING'
    | 'UNKNOWN_CARD'
  message: string
  details?: Record<string, unknown>
}

export function summarizeAspects(
  cardsById: Map<string, Card>,
  entries: { cardId: string; count: number }[]
): Record<Aspect, number> {
  const counts: Record<Aspect, number> = {
    aggression: 0,
    cunning: 0,
    command: 0,
    vigilance: 0,
    heroism: 0,
    villainy: 0,
  }
  for (const e of entries) {
    const card = cardsById.get(e.cardId)
    if (!card) continue
    for (const aspect of card.aspects) counts[aspect] += e.count
  }
  return counts
}

export function validateDeck(
  version: DeckVersion,
  cardsById: Map<string, Card>
): { issues: DeckIssue[]; totals: { main: number; side: number; overflow: number } } {
  const issues: DeckIssue[] = []

  if (!version.leaderId) {
    issues.push({ level: 'error', code: 'LEADER_MISSING', message: 'Leader not selected.' })
  }
  if (!version.baseId) {
    issues.push({ level: 'error', code: 'BASE_MISSING', message: 'Base not selected.' })
  }

  // Unknown cards
  for (const section of ['mainEntries', 'sideEntries', 'overflowEntries'] as const) {
    for (const e of version[section]) {
      if (!cardsById.has(e.cardId)) {
        issues.push({ level: 'warning', code: 'UNKNOWN_CARD', message: `Unknown card ${e.cardId}`, details: { section } })
      }
    }
  }

  // Main deck size
  const mainTotal = version.mainEntries.reduce((sum, e) => sum + e.count, 0)
  if (mainTotal < MIN_MAIN_CARDS) {
    issues.push({
      level: 'error',
      code: 'MAIN_SIZE_UNDER_MIN',
      message: `Main deck has ${mainTotal}/${MIN_MAIN_CARDS} cards.`,
      details: { have: mainTotal, need: MIN_MAIN_CARDS },
    })
  }

  // Copy limit
  const copyCounts = new Map<string, number>()
  for (const e of version.mainEntries) copyCounts.set(e.cardId, (copyCounts.get(e.cardId) ?? 0) + e.count)
  for (const [cardId, count] of copyCounts) {
    if (count > MAX_COPIES) {
      const card = cardsById.get(cardId)
      issues.push({
        level: 'error',
        code: 'COPIES_OVER_LIMIT',
        message: `${card?.name ?? cardId} has ${count}/${MAX_COPIES} copies in main deck.`,
        details: { cardId, count },
      })
    }
  }

  // Sideboard limit
  const sideTotal = version.sideEntries.reduce((sum, e) => sum + e.count, 0)
  if (sideTotal > SIDEBOARD_LIMIT) {
    issues.push({
      level: 'warning',
      code: 'SIDEBOARD_OVER_LIMIT',
      message: `Sideboard has ${sideTotal}/${SIDEBOARD_LIMIT} cards. Excess should be moved to Overflow.`,
      details: { sideTotal, limit: SIDEBOARD_LIMIT },
    })
  }

  const overflowTotal = version.overflowEntries.reduce((sum, e) => sum + e.count, 0)

  return { issues, totals: { main: mainTotal, side: sideTotal, overflow: overflowTotal } }
}