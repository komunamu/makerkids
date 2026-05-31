import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MakerKids — 3D Printing & TinkerCAD',
  description: 'Learn 3D printing and design in 8 weeks',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif' }}>{children}</body>
    </html>
  )
}
