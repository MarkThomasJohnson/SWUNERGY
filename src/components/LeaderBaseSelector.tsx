"use client"

import { useState } from 'react'
import clsx from 'clsx'
import type { Card, Aspect } from '@/lib/types'

interface LeaderBaseSelectorProps {
  leaders: Card[]
  bases: Card[]
  selectedLeader: Card | null
  selectedBase: Card | null
  onLeaderSelect: (leader: Card | null) => void
  onBaseSelect: (base: Card | null) => void
}

export function LeaderBaseSelector({
  leaders,
  bases,
  selectedLeader,
  selectedBase,
  onLeaderSelect,
  onBaseSelect,
}: LeaderBaseSelectorProps) {
  const [showLeaderModal, setShowLeaderModal] = useState(false)
  const [showBaseModal, setShowBaseModal] = useState(false)

  const aspectColors: Record<string, string> = {
    aggression: 'bg-red-500',
    cunning: 'bg-purple-500',
    command: 'bg-blue-500',
    vigilance: 'bg-green-500',
    heroism: 'bg-yellow-500',
    villainy: 'bg-gray-500',
  }

  const getCompatibleAspects = () => {
    const aspects: string[] = []
    if (selectedLeader) aspects.push(...selectedLeader.aspects)
    if (selectedBase) aspects.push(...selectedBase.aspects)
    return [...new Set(aspects)]
  }

  const compatibleAspects = getCompatibleAspects()

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white">Deck Foundation</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Leader Selection */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-white/80">Leader</h4>
          {selectedLeader ? (
            <div className="p-3 rounded-lg border border-white/10 bg-white/5">
              <div className="flex items-center gap-3">
                {selectedLeader.imageUrl && (
                  <img 
                    src={selectedLeader.imageUrl} 
                    alt={selectedLeader.name}
                    className="w-16 h-20 object-cover rounded border border-white/20"
                  />
                )}
                <div className="flex-1">
                  <h5 className="font-medium text-white">{selectedLeader.name}</h5>
                  <div className="flex items-center gap-1 mt-1">
                    {selectedLeader.aspects.map((aspect) => (
                      <span
                        key={aspect}
                        className={clsx(
                          'w-3 h-3 rounded-full',
                          aspectColors[aspect] || 'bg-gray-500'
                        )}
                        title={aspect}
                      />
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => onLeaderSelect(null)}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowLeaderModal(true)}
              className="w-full p-4 rounded-lg border-2 border-dashed border-white/20 text-white/50 hover:border-white/40 hover:text-white/60 transition-colors text-center"
            >
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Select Leader
            </button>
          )}
        </div>

        {/* Base Selection */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-white/80">Base</h4>
          {selectedBase ? (
            <div className="p-3 rounded-lg border border-white/10 bg-white/5">
              <div className="flex items-center gap-3">
                {selectedBase.imageUrl && (
                  <img 
                    src={selectedBase.imageUrl} 
                    alt={selectedBase.name}
                    className="w-16 h-20 object-cover rounded border border-white/20"
                  />
                )}
                <div className="flex-1">
                  <h5 className="font-medium text-white">{selectedBase.name}</h5>
                  <div className="flex items-center gap-1 mt-1">
                    {selectedBase.aspects.map((aspect) => (
                      <span
                        key={aspect}
                        className={clsx(
                          'w-3 h-3 rounded-full',
                          aspectColors[aspect] || 'bg-gray-500'
                        )}
                        title={aspect}
                      />
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => onBaseSelect(null)}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowBaseModal(true)}
              className="w-full p-4 rounded-lg border-2 border-dashed border-white/20 text-white/50 hover:border-white/40 hover:text-white/60 transition-colors text-center"
            >
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Select Base
            </button>
          )}
        </div>
      </div>

      {/* Compatible Aspects Display */}
      {compatibleAspects.length > 0 && (
        <div className="p-3 rounded-lg border border-white/10 bg-white/5">
          <h4 className="text-sm font-medium text-white/80 mb-2">Compatible Aspects</h4>
          <div className="flex items-center gap-2">
            {compatibleAspects.map((aspect) => (
              <span
                key={aspect}
                className={clsx(
                  'px-3 py-1.5 text-sm rounded-full text-white capitalize',
                  aspectColors[aspect] || 'bg-gray-500'
                )}
              >
                {aspect}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Leader Selection Modal */}
      {showLeaderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">Select Leader</h3>
                <button
                  onClick={() => setShowLeaderModal(false)}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {leaders.map((leader) => (
                  <button
                    key={leader.id}
                    onClick={() => {
                      onLeaderSelect(leader)
                      setShowLeaderModal(false)
                    }}
                    className="p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      {leader.imageUrl && (
                        <img 
                          src={leader.imageUrl} 
                          alt={leader.name}
                          className="w-12 h-16 object-cover rounded border border-white/20"
                        />
                      )}
                      <div>
                        <h5 className="font-medium text-white">{leader.name}</h5>
                        <div className="flex items-center gap-1 mt-1">
                          {leader.aspects.map((aspect) => (
                            <span
                              key={aspect}
                              className={clsx(
                                'w-2 h-2 rounded-full',
                                aspectColors[aspect as keyof typeof aspectColors] || 'bg-gray-500'
                              )}
                              title={aspect}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Base Selection Modal */}
      {showBaseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">Select Base</h3>
                <button
                  onClick={() => setShowBaseModal(false)}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {bases.map((base) => (
                  <button
                    key={base.id}
                    onClick={() => {
                      onBaseSelect(base)
                      setShowBaseModal(false)
                    }}
                    className="p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      {base.imageUrl && (
                        <img 
                          src={base.imageUrl} 
                          alt={base.name}
                          className="w-12 h-16 object-cover rounded border border-white/20"
                        />
                      )}
                      <div>
                        <h5 className="font-medium text-white">{base.name}</h5>
                        <div className="flex items-center gap-1 mt-1">
                          {base.aspects.map((aspect) => (
                            <span
                              key={aspect}
                              className={clsx(
                                'w-2 h-2 rounded-full',
                                aspectColors[aspect] || 'bg-gray-500'
                              )}
                              title={aspect}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 