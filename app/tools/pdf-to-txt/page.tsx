"use client" 
import React, { useState } from 'react'
import FileUpload from '../../../components/FileUpload'
import ResultBox from '../../../components/ResultBox'
import { copyToClipboard } from '../../../lib/utils/copyToClipboard'

export default function PdfToTxt() {
  const [txt, setTxt] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFiles = async (files: File[]) => {
    const file = files[0]
    if (!file) return
    setError(null)
    setTxt(null)
    setLoading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/pdf-to-txt', { method: 'POST', body: form })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Conversion failed')
      }
      const data = await res.json()
      if (data?.text) {
        setTxt(data.text)
      } else {
        throw new Error('No text returned')
      }
    } catch (e: any) {
      setError(e?.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const downloadTxt = () => {
    if (!txt) return
    const blob = new Blob([txt], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'document.txt'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const copyTxt = async () => {
    if (!txt) return
    await copyToClipboard(txt)
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">PDF to TXT</h2>
      <FileUpload onFiles={handleFiles} accept="application/pdf" />
      {loading && <p className="text-sm text-gray-600">Converting...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {txt && (
        <ResultBox title="Extracted Text">
          <pre className="whitespace-pre-wrap text-sm">{txt}</pre>
          <div className="mt-2 flex space-x-2">
            <button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={copyTxt}>Copy</button>
            <button className="px-3 py-2 bg-green-600 text-white rounded" onClick={downloadTxt}>Download .txt</button>
          </div>
        </ResultBox>
      )}
    </section>
  )
}
