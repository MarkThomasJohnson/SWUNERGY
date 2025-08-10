import type { Card, DeckVersion } from '@/lib/types'

export function exportDeckAsJson(version: DeckVersion) {
  return JSON.stringify(version, null, 2)
}

export function exportDeckAsMelee(version: DeckVersion, cardsById: Map<string, Card>): string {
  const lines: string[] = []
  const leader = version.leaderId ? cardsById.get(version.leaderId) : undefined
  const base = version.baseId ? cardsById.get(version.baseId) : undefined
  if (leader) lines.push(`Leader: ${leader.name}`)
  if (base) lines.push(`Base: ${base.name}`)
  if (leader || base) lines.push('')

  lines.push('Main Deck:')
  for (const e of sortByName(version.mainEntries, cardsById)) {
    const card = cardsById.get(e.cardId)
    if (!card) continue
    lines.push(`${e.count} ${card.name}`)
  }

  if (version.sideEntries.length) {
    lines.push('', 'Sideboard:')
    for (const e of sortByName(version.sideEntries, cardsById)) {
      const card = cardsById.get(e.cardId)
      if (!card) continue
      lines.push(`${e.count} ${card.name}`)
    }
  }

  if (version.overflowEntries.length) {
    lines.push('', 'Overflow:')
    for (const e of sortByName(version.overflowEntries, cardsById)) {
      const card = cardsById.get(e.cardId)
      if (!card) continue
      lines.push(`${e.count} ${card.name}`)
    }
  }

  return lines.join('\n')
}

function sortByName(
  entries: { cardId: string; count: number }[],
  cardsById: Map<string, Card>
) {
  return [...entries].sort((a, b) => {
    const an = cardsById.get(a.cardId)?.name ?? ''
    const bn = cardsById.get(b.cardId)?.name ?? ''
    return an.localeCompare(bn)
  })
}