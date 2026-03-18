"use client" 
import React, { useState } from 'react'
import FileUpload from '../../../components/FileUpload'
import ResultBox from '../../../components/ResultBox'
import { copyToClipboard } from '../../lib/utils/copyToClipboard'

export default function WordToPdf() {
  const [pdfBase64, setPdfBase64] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFiles = async (files: File[]) => {
    const file = files[0]
    if (!file) return
    setError(null)
    setPdfBase64(null)
    setLoading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/word-to-pdf', { method: 'POST', body: form })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Conversion failed')
      }
      const data = await res.json()
      if (data?.pdfBase64) {
        setPdfBase64(data.pdfBase64)
      } else {
        throw new Error('No PDF returned')
      }
    } catch (e: any) {
      setError(e?.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const downloadPdf = () => {
    if (!pdfBase64) return
    const blob = base64ToBlob(pdfBase64, 'application/pdf')
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'document.pdf'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const copyPdfBase64 = async () => {
    if (!pdfBase64) return
    await copyToClipboard(pdfBase64)
  }

  // helper to convert base64 string to blob
 const base64ToBlob = (base64: string, mime: string) => {
    const byteChars = atob(base64)
    const byteNumbers = new Array(byteChars.length)
    for (let i = 0; i < byteChars.length; i++) {
      byteNumbers[i] = byteChars.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    return new Blob([byteArray], { type: mime })
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Word to PDF</h2>
      <FileUpload onFiles={handleFiles} accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/msword" />
      {loading && <p className="text-sm text-gray-600">Converting...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {pdfBase64 && (
        <ResultBox title="Generated PDF">
          <p className="text-sm mb-2">PDF generated from Word document. You can download or copy base64.</p>
          <div className="flex space-x-2">
            <button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={copyPdfBase64}>Copy Base64</button>
            <button className="px-3 py-2 bg-green-600 text-white rounded" onClick={downloadPdf}>Download PDF</button>
          </div>
        </ResultBox>
      )}
    </section>
  )
}
