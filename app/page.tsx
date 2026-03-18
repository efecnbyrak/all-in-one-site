import React from 'react'
import ToolCard from '../components/ToolCard'

type Category = {
  id: string
  title: string
  description?: string
  tools: { title: string; href: string; description?: string }[]
}

const categories: Category[] = [
  {
    id: 'file-tools',
    title: 'File Tools',
    description: 'Convert and manage files with lightweight tools',
    tools: [
      { title: 'PNG to JPG', href: '/tools/image-converter', description: 'Client-side image conversion' },
      { title: 'JPG to PNG', href: '/tools/image-converter', description: 'Client-side image conversion' },
      { title: 'PDF to TXT', href: '/tools/pdf-to-txt', description: 'Extract text from PDFs' },
      { title: 'Word to PDF', href: '/tools/word-to-pdf', description: 'Convert Word to PDF' },
    ],
  },
  {
    id: 'dev-tools',
    title: 'Developer Tools',
    description: 'Format, convert and transform JSON/text',
    tools: [
      { title: 'JSON Formatter', href: '/tools/json-formatter', description: 'Beautify/minify JSON' },
      { title: 'Text to JSON', href: '/tools/text-json', description: 'Convert text to JSON' },
      { title: 'JSON to Text', href: '/tools/text-json', description: 'Convert JSON to text' },
    ],
  },
  {
    id: 'calculators',
    title: 'Calculators',
    description: 'Scientific and educational calculators',
    tools: [
      { title: 'Scientific Calculator', href: '/tools/calculator', description: 'MathJS-powered calculator' },
      { title: 'University Score', href: '/tools/university-score', description: 'TYT/AYT based scoring' },
      { title: 'Weighted Average', href: '/tools/average-calculator', description: 'Weighted average calculator' },
    ],
  },
]

export default function Home() {
  return (
    <section className="space-y-8">
      <header className="pt-6 pb-2 max-w-3xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold">Multi-Tool Studio</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">A single place for file converters, developer tools and calculators. No database required.</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white/80 dark:bg-gray-800/70 rounded-xl shadow p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-2">{cat.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{cat.description}</p>
            <div className="space-y-2">
              {cat.tools.map((t) => (
                <ToolCard key={t.title} title={t.title} href={t.href} description={t.description} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
