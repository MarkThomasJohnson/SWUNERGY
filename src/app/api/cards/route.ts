import { NextResponse } from 'next/server'
import { LocalJsonCardSource } from '@/lib/sources/swudb'

export async function GET() {
  const source = new LocalJsonCardSource(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/cards.sample.json`)
  const cards = await source.fetchAllCards()
  return NextResponse.json(cards)
}