import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SWU Decks',
  description: 'Star Wars Unlimited deck builder',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <div className="mx-auto max-w-7xl p-4 md:p-6">
          <header className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight">SWU Decks</h1>
            <nav className="text-sm text-white/70">MVP</nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  )
}