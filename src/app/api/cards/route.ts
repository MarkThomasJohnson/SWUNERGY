import { NextResponse } from 'next/server'
import type { Card } from '@/lib/types'

// Sample card data - in production this would come from a database
const SAMPLE_CARDS: Card[] = [
  {
    id: "leader_luke",
    name: "Luke Skywalker, Rebel Leader",
    setCode: "SOR",
    collectorNumber: "L01",
    type: "leader",
    aspects: ["heroism", "vigilance"],
    traits: ["Jedi", "Leader"],
    keywords: [],
    unique: true,
    text: "Action: Ready a friendly unit.",
    imageUrl: "/images/leader_luke.jpg"
  },
  {
    id: "base_yavin",
    name: "Yavin 4 Base",
    setCode: "SOR",
    collectorNumber: "B01",
    type: "base",
    aspects: ["heroism"],
    traits: ["Rebel", "Base"],
    keywords: [],
    unique: true,
    text: "Your heroism aspect is increased by 1.",
    imageUrl: "/images/base_yavin.jpg"
  },
  {
    id: "unit_rebel_trooper",
    name: "Rebel Trooper",
    setCode: "SOR",
    collectorNumber: "U101",
    type: "unit",
    cost: 2,
    aspects: ["heroism"],
    traits: ["Rebel", "Trooper"],
    keywords: ["Ambush"],
    unique: false,
    text: "When played: Deal 1 damage to a unit.",
    imageUrl: "/images/unit_rebel_trooper.jpg"
  },
  {
    id: "unit_xwing",
    name: "Red Squadron X-Wing",
    setCode: "SOR",
    collectorNumber: "U202",
    type: "unit",
    cost: 4,
    aspects: ["heroism", "vigilance"],
    traits: ["Vehicle", "Fighter"],
    keywords: [],
    unique: false,
    text: "Restore 1.",
    imageUrl: "/images/unit_xwing.jpg"
  }
]

export async function GET() {
  try {
    return NextResponse.json(SAMPLE_CARDS)
  } catch (error) {
    console.error('Error serving cards:', error)
    return NextResponse.json([], { status: 200 })
  }
}