import type { Card } from '@/lib/types'

export interface CardSource {
  fetchAllCards(): Promise<Card[]>
}

export class LocalJsonCardSource implements CardSource {
  constructor(private readonly url: string) {}
  async fetchAllCards(): Promise<Card[]> {
    const res = await fetch(this.url, { cache: 'no-store' })
    if (!res.ok) throw new Error(`Failed to load cards: ${res.status}`)
    const data = (await res.json()) as Card[]
    return data
  }
}

// Placeholder for a future swudb-backed source.
export class SwuDbSource implements CardSource {
  // Provide the concrete endpoint and mapping once confirmed
  constructor(private readonly endpoint: string) {}
  async fetchAllCards(): Promise<Card[]> {
    const res = await fetch(this.endpoint, { cache: 'no-store' })
    if (!res.ok) throw new Error(`Failed to query swudb: ${res.status}`)
    const raw = await res.json()
    // Map raw fields to Card here once the schema is finalized
    const mapped: Card[] = []
    return mapped
  }
}