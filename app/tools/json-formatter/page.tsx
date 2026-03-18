"use client" 
import React, { useState } from 'react'
import ResultBox from '../../../components/ResultBox'
import { copyToClipboard } from '../../../lib/utils/copyToClipboard'

export default function JsonFormatter() {
  const [input, setInput] = useState<string>('{"key": "value"}')
  const [output, setOutput] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const format = () => {
    try {
      const obj = JSON.parse(input)
      setOutput(JSON.stringify(obj, null, 2))
      setError(null)
    } catch (e: any) {
      setError(e.message)
    }
  }

  const minify = () => {
    try {
      const obj = JSON.parse(input)
      setOutput(JSON.stringify(obj))
      setError(null)
    } catch (e: any) {
      setError(e.message)
    }
  }

  const copy = async () => {
    if (!output) return
    await copyToClipboard(output)
  }

  const download = () => {
    if (!output) return
    const blob = new Blob([output], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'formatted.json'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">JSON Formatter</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <textarea className="w-full h-40 p-2 border rounded" value={input} onChange={e => setInput(e.target.value)} />
        <textarea className="w-full h-40 p-2 border rounded" value={output} readOnly />
      </div>
      <div className="flex space-x-2">
        <button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={format}>Format</button>
        <button className="px-3 py-2 bg-yellow-600 text-white rounded" onClick={minify}>Minify</button>
        <button className="px-3 py-2 bg-gray-600 text-white rounded" onClick={copy}>Copy</button>
        <button className="px-3 py-2 bg-green-600 text-white rounded" onClick={download}>Download</button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </section>
  )
}
