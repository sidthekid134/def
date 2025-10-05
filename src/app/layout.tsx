import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Recipe App',
  description: 'A modern recipe application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}