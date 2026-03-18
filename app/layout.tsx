import React from 'react'
import Navbar from '../components/Navbar'

import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <Navbar />
        <main className="min-h-screen max-w-7xl mx-auto p-4 md:p-6">
          {children}
        </main>
      </body>
    </html>
  )
}
