import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="space-y-6">
      <div className="rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur">
        <h2 className="mb-2 text-xl font-semibold">Welcome</h2>
        <p className="text-white/80">Start building your first Star Wars Unlimited deck.</p>
        <div className="mt-4">
          <Link
            href="/builder"
            className="inline-flex items-center rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Open Deck Builder
          </Link>
        </div>
      </div>
    </main>
  )
}