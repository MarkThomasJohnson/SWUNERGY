"use client"

import { useState } from 'react'
import clsx from 'clsx'
import type { Aspect } from '@/lib/types'

interface CardSearchProps {
  query: string
  onQueryChange: (query: string) => void
  selectedAspects: Aspect[]
  onAspectsChange: (aspects: Aspect[]) => void
  selectedTypes: string[]
  onTypesChange: (types: string[]) => void
  selectedSets: string[]
  onSetsChange: (sets: string[]) => void
  selectedRarities: string[]
  onRaritiesChange: (rarities: string[]) => void
}

const ASPECTS: Aspect[] = ['aggression', 'cunning', 'command', 'vigilance', 'heroism', 'villainy']
const CARD_TYPES = ['unit', 'event', 'upgrade', 'base', 'leader']
const SETS = ['SOR', 'SOR2', 'SOR3'] // Add more sets as needed
const RARITIES = ['common', 'uncommon', 'rare', 'legendary']

export function CardSearch({
  query,
  onQueryChange,
  selectedAspects,
  onAspectsChange,
  selectedTypes,
  onTypesChange,
  selectedSets,
  onSetsChange,
  selectedRarities,
  onRaritiesChange,
}: CardSearchProps) {
  const toggleAspect = (aspect: Aspect) => {
    if (selectedAspects.includes(aspect)) {
      onAspectsChange(selectedAspects.filter(a => a !== aspect))
    } else {
      onAspectsChange([...selectedAspects, aspect])
    }
  }

  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      onTypesChange(selectedTypes.filter(t => t !== type))
    } else {
      onTypesChange([...selectedTypes, type])
    }
  }

  const toggleSet = (set: string) => {
    if (selectedSets.includes(set)) {
      onSetsChange(selectedSets.filter(s => s !== set))
    } else {
      onSetsChange([...selectedSets, set])
    }
  }

  const toggleRarity = (rarity: string) => {
    if (selectedRarities.includes(rarity)) {
      onRaritiesChange(selectedRarities.filter(r => r !== rarity))
    } else {
      onRaritiesChange([...selectedRarities, rarity])
    }
  }

  const clearFilters = () => {
    onQueryChange('')
    onAspectsChange([])
    onTypesChange([])
    onSetsChange([])
    onRaritiesChange([])
  }

  const hasActiveFilters = query || selectedAspects.length > 0 || selectedTypes.length > 0 || selectedSets.length > 0

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search cards by name, text, or traits..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="w-full px-4 py-2 pl-10 rounded-lg border border-white/10 bg-white/5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        />
        <svg
          className="absolute left-3 top-2.5 h-5 w-5 text-white/50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        {/* Aspects */}
        <div>
          <h4 className="text-sm font-medium text-white/80 mb-2">Aspects</h4>
          <div className="flex flex-wrap gap-2">
            {ASPECTS.map((aspect) => (
              <button
                key={aspect}
                onClick={() => toggleAspect(aspect)}
                className={clsx(
                  'px-3 py-1.5 text-sm rounded-full border transition-colors capitalize',
                  selectedAspects.includes(aspect)
                    ? 'bg-brand-600 border-brand-500 text-white'
                    : 'border-white/20 text-white/70 hover:bg-white/10 hover:text-white'
                )}
              >
                {aspect}
              </button>
            ))}
          </div>
        </div>

        {/* Card Types */}
        <div>
          <h4 className="text-sm font-medium text-white/80 mb-2">Card Types</h4>
          <div className="flex flex-wrap gap-2">
            {CARD_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => toggleType(type)}
                className={clsx(
                  'px-3 py-1.5 text-sm rounded-full border transition-colors capitalize',
                  selectedTypes.includes(type)
                    ? 'bg-brand-600 border-brand-500 text-white'
                    : 'border-white/20 text-white/70 hover:bg-white/10 hover:text-white'
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Sets */}
        <div>
          <h4 className="text-sm font-medium text-white/80 mb-2">Sets</h4>
          <div className="flex flex-wrap gap-2">
            {SETS.map((set) => (
              <button
                key={set}
                onClick={() => toggleSet(set)}
                className={clsx(
                  'px-3 py-1.5 text-sm rounded-full border transition-colors',
                  selectedSets.includes(set)
                    ? 'bg-brand-600 border-brand-500 text-white'
                    : 'border-white/20 text-white/70 hover:bg-white/10 hover:text-white'
                )}
              >
                {set}
              </button>
            ))}
          </div>
        </div>

        {/* Rarities */}
        <div>
          <h4 className="text-sm font-medium text-white/80 mb-2">Rarities</h4>
          <div className="flex flex-wrap gap-2">
            {RARITIES.map((rarity) => (
              <button
                key={rarity}
                onClick={() => toggleRarity(rarity)}
                className={clsx(
                  'px-3 py-1.5 text-sm rounded-full border transition-colors capitalize',
                  selectedRarities.includes(rarity)
                    ? 'bg-brand-600 border-brand-500 text-white'
                    : 'border-white/20 text-white/70 hover:bg-white/10 hover:text-white'
                )}
              >
                {rarity}
              </button>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm rounded-lg border border-white/20 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            Clear All Filters
          </button>
        )}
      </div>
    </div>
  )
} 