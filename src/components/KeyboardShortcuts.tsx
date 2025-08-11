"use client"

import { useState, useEffect } from 'react'
import { useDeckStore } from '@/store/deckStore'

interface KeyboardShortcutsProps {
  onClearDeck: () => void
  onAutoFill: () => void
  onRandomDeck: () => void
  onBalanceAspects: () => void
}

export function KeyboardShortcuts({ 
  onClearDeck, 
  onAutoFill, 
  onRandomDeck, 
  onBalanceAspects 
}: KeyboardShortcutsProps) {
  const [showHelp, setShowHelp] = useState(false)
  const { selectedLeader, selectedBase } = useDeckStore()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle shortcuts when not typing in input fields
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }

      // Ctrl/Cmd + key shortcuts
      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case 'k':
            event.preventDefault()
            setShowHelp(prev => !prev)
            break
          case 'c':
            event.preventDefault()
            if (selectedLeader && selectedBase) {
              onClearDeck()
            }
            break
          case 'f':
            event.preventDefault()
            if (selectedLeader && selectedBase) {
              onAutoFill()
            }
            break
          case 'r':
            event.preventDefault()
            if (selectedLeader && selectedBase) {
              onRandomDeck()
            }
            break
          case 'b':
            event.preventDefault()
            if (selectedLeader && selectedBase) {
              onBalanceAspects()
            }
            break
        }
      }

      // Escape key to close help
      if (event.key === 'Escape') {
        setShowHelp(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClearDeck, onAutoFill, onRandomDeck, onBalanceAspects, selectedLeader, selectedBase])

  if (!showHelp) {
    return (
      <button
        onClick={() => setShowHelp(true)}
        className="fixed bottom-4 right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white/80 border border-white/20 transition-all duration-200 shadow-lg backdrop-blur-sm"
        title="Keyboard Shortcuts (Ctrl+K)"
        aria-label="Show keyboard shortcuts"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </button>
    )
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={() => setShowHelp(false)}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg border border-white/20 shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Keyboard Shortcuts</h2>
              <button
                onClick={() => setShowHelp(false)}
                className="text-white/60 hover:text-white transition-colors"
                aria-label="Close shortcuts help"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-sm font-medium text-white mb-1">Toggle Help</div>
                  <div className="text-xs text-white/60">Ctrl+K</div>
                </div>
                
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-sm font-medium text-white mb-1">Clear Deck</div>
                  <div className="text-xs text-white/60">Ctrl+C</div>
                </div>
                
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-sm font-medium text-white mb-1">Auto-Fill</div>
                  <div className="text-xs text-white/60">Ctrl+F</div>
                </div>
                
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-sm font-medium text-white mb-1">Random Deck</div>
                  <div className="text-xs text-white/60">Ctrl+R</div>
                </div>
                
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-sm font-medium text-white mb-1">Balance Aspects</div>
                  <div className="text-xs text-white/60">Ctrl+B</div>
                </div>
                
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-sm font-medium text-white mb-1">Close Help</div>
                  <div className="text-xs text-white/60">Escape</div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <p className="text-sm text-white/60 text-center">
                  Shortcuts only work when a leader and base are selected
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 