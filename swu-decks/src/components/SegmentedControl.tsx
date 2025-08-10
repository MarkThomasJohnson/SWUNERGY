"use client"

import clsx from 'clsx'

type Option = { value: string; label: string }

export function SegmentedControl({
  options,
  value,
  onChange,
}: {
  options: Option[]
  value: string
  onChange: (val: string) => void
}) {
  return (
    <div className="inline-flex overflow-hidden rounded-md border border-white/10 bg-white/10 p-1">
      {options.map((opt) => {
        const isActive = opt.value === value
        return (
          <button
            key={opt.value}
            className={clsx(
              'relative px-3 py-1.5 text-sm transition-colors',
              isActive ? 'bg-brand-600 text-white' : 'text-white/80 hover:text-white'
            )}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        )}
      )}
    </div>
  )
}