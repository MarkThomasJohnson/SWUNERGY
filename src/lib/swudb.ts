export interface SWUDBCard {
  id: string
  name: string
  set_code: string
  collector_number: string
  type: 'unit' | 'event' | 'upgrade' | 'base' | 'leader'
  cost?: number
  aspects: string[]
  traits: string[]
  keywords: string[]
  unique: boolean
  text?: string
  image_url?: string
  rarity?: string
  attack?: number
  health?: number
  defense?: number
}

export interface SWUDBResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    per_page: number
    total_pages: number
  }
}

class SWUDBClient {
  private baseUrl = 'https://swudb.com/api/v1'

  async searchCards(params: {
    query?: string
    aspects?: string[]
    types?: string[]
    sets?: string[]
    page?: number
    per_page?: number
  }): Promise<SWUDBResponse<SWUDBCard>> {
    const searchParams = new URLSearchParams()
    
    if (params.query) searchParams.append('q', params.query)
    if (params.aspects?.length) searchParams.append('aspects', params.aspects.join(','))
    if (params.types?.length) searchParams.append('types', params.types.join(','))
    if (params.sets?.length) searchParams.append('sets', params.sets.join(','))
    if (params.page) searchParams.append('page', params.page.toString())
    if (params.per_page) searchParams.append('per_page', params.per_page.toString())

    const response = await fetch(`${this.baseUrl}/cards?${searchParams}`)
    
    if (!response.ok) {
      throw new Error(`SWUDB API error: ${response.status}`)
    }

    return response.json()
  }

  async getCard(id: string): Promise<SWUDBCard> {
    const response = await fetch(`${this.baseUrl}/cards/${id}`)
    
    if (!response.ok) {
      throw new Error(`SWUDB API error: ${response.status}`)
    }

    return response.json()
  }

  async getLeaders(): Promise<SWUDBCard[]> {
    const response = await this.searchCards({ types: ['leader'], per_page: 100 })
    return response.data
  }

  async getBases(): Promise<SWUDBCard[]> {
    const response = await this.searchCards({ types: ['base'], per_page: 100 })
    return response.data
  }

  async getUnits(): Promise<SWUDBCard[]> {
    const response = await this.searchCards({ types: ['unit'], per_page: 100 })
    return response.data
  }

  async getEvents(): Promise<SWUDBCard[]> {
    const response = await this.searchCards({ types: ['event'], per_page: 100 })
    return response.data
  }

  async getUpgrades(): Promise<SWUDBCard[]> {
    const response = await this.searchCards({ types: ['upgrade'], per_page: 100 })
    return response.data
  }
}

export const swudbClient = new SWUDBClient()

// Helper function to convert SWUDB card to our internal Card type
export function convertSWUDBCard(swudbCard: SWUDBCard) {
  return {
    id: swudbCard.id,
    name: swudbCard.name,
    setCode: swudbCard.set_code,
    collectorNumber: swudbCard.collector_number,
    type: swudbCard.type,
    cost: swudbCard.cost,
    aspects: swudbCard.aspects as any[],
    traits: swudbCard.traits,
    keywords: swudbCard.keywords,
    unique: swudbCard.unique,
    text: swudbCard.text,
    imageUrl: swudbCard.image_url,
    rarity: swudbCard.rarity,
    attack: swudbCard.attack,
    health: swudbCard.health,
    defense: swudbCard.defense,
  }
} 