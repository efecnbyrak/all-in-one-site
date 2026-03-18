"use client" 
import React from 'react'

type Props = {
  title?: string
  children: React.ReactNode
}

export default function ResultBox({ title, children }: Props) {
  return (
    <section className="border rounded-lg p-4 border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70">
      {title && <h4 className="text-lg font-semibold mb-2">{title}</h4>}
      <div className="prose dark:prose-invert max-h-96 overflow-auto" style={{ whiteSpace: 'pre-wrap' }}>
        {children}
      </div>
    </section>
  )
}
