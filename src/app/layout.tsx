import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SWU Decks',
  description: 'Star Wars Unlimited deck builder',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div>
          <header>
            <h1>SWU Decks</h1>
          </header>
          {children}
        </div>
      </body>
    </html>
  )
}