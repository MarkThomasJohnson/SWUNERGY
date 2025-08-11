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
    cost: undefined,
    aspects: ["heroism", "vigilance"],
    traits: ["Jedi", "Leader"],
    keywords: [],
    unique: true,
    text: "Action: Ready a friendly unit.",
    imageUrl: "/images/leader_luke.jpg",
    rarity: "Legendary",
    attack: undefined,
    health: undefined,
    defense: undefined
  },
  {
    id: "base_yavin",
    name: "Yavin 4 Base",
    setCode: "SOR",
    collectorNumber: "B01",
    type: "base",
    cost: undefined,
    aspects: ["heroism"],
    traits: ["Rebel", "Base"],
    keywords: [],
    unique: true,
    text: "Your heroism aspect is increased by 1.",
    imageUrl: "/images/base_yavin.jpg",
    rarity: "Rare",
    attack: undefined,
    health: undefined,
    defense: undefined
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
    imageUrl: "/images/unit_rebel_trooper.jpg",
    rarity: "Common",
    attack: 2,
    health: 2,
    defense: 1
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
    imageUrl: "/images/unit_xwing.jpg",
    rarity: "Uncommon",
    attack: 3,
    health: 3,
    defense: 2
  },
  {
    id: "event_force_push",
    name: "Force Push",
    setCode: "SOR",
    collectorNumber: "E101",
    type: "event",
    cost: 1,
    aspects: ["heroism"],
    traits: ["Force"],
    keywords: [],
    unique: false,
    text: "Move a unit to another area.",
    imageUrl: "/images/event_force_push.jpg",
    rarity: "Common",
    attack: undefined,
    health: undefined,
    defense: undefined
  },
  {
    id: "upgrade_lightsaber",
    name: "Lightsaber",
    setCode: "SOR",
    collectorNumber: "UP101",
    type: "upgrade",
    cost: 2,
    aspects: ["heroism"],
    traits: ["Weapon"],
    keywords: [],
    unique: false,
    text: "Equipped unit gets +1 attack.",
    imageUrl: "/images/upgrade_lightsaber.jpg",
    rarity: "Uncommon",
    attack: undefined,
    health: undefined,
    defense: undefined
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