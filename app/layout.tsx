import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kitchen Image Composer',
  description: 'AI-powered kitchen image composition tool',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="no">
      <body>{children}</body>
    </html>
  )
}
