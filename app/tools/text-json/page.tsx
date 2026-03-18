"use client" 
import React, { useState } from 'react'

function toJsonFromText(text: string) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0)
  const obj = lines.map((line, idx) => {
    const [key, ...rest] = line.split(':')
    const value = rest.join(':').trim()
    const k = key?.trim() || `line${idx + 1}`
    return { [k]: value || line }
  })
  return obj
}

export default function TextJson() {
  const [text, setText] = useState<string>('name: John Doe\nemail: john@example.com')
  const [json, setJson] = useState<string>('[]')

  const toJson = () => {
    try {
      const arr = toJsonFromText(text)
      setJson(JSON.stringify(arr, null, 2))
    } catch {
      setJson('[]')
    }
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(json)
    } catch {
      // ignore
    }
  }

  const download = () => {
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'text-to-json.json'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Text to JSON</h2>
      <textarea className="w-full h-40 p-2 border rounded" value={text} onChange={e => setText(e.target.value)} />
      <div className="flex space-x-2">
        <button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={toJson}>Convert</button>
        <button className="px-3 py-2 bg-gray-600 text-white rounded" onClick={copy}>Copy</button>
        <button className="px-3 py-2 bg-green-600 text-white rounded" onClick={download}>Download JSON</button>
      </div>
      <textarea className="w-full h-40 p-2 border rounded" value={json} readOnly />
    </section>
  )
}
