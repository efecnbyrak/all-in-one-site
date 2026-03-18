"use client" 
import React from 'react'
import Link from 'next/link'

type Props = {
  title: string
  description?: string
  href: string
}

export default function ToolCard({ title, description, href }: Props) {
  return (
    <Link href={href} className="block rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-gray-800 dark:text-gray-200">{title}</span>
        <span className="text-xs text-gray-500">Open</span>
      </div>
      {description && <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{description}</p>}
    </Link>
  )
}
