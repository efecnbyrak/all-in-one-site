"use client" 
import React, { useEffect, useState } from 'react'

export default function Navbar() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    // Initialize from document class if present
    const isDark = document.documentElement.classList.contains('dark')
    setDark(isDark)
  }, [])

  const toggleDark = () => {
    document.documentElement.classList.toggle('dark')
    setDark((d) => !d)
  }

  return (
    <nav className="w-full bg-white/90 dark:bg-gray-800/90 shadow-md backdrop-filter backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl">Multi-Tools</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleDark} className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-sm">
            {dark ? 'Light' : 'Dark'} mode
          </button>
        </div>
      </div>
    </nav>
  )
}
