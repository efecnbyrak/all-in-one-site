"use client" 
import React, { useState } from 'react'
import { convertImageFile } from '../../../lib/converters/imageConverter'
import FileUpload from '../../../components/FileUpload'

export default function ImageConverter() {
  const [pngToJpg, setPngToJpg] = useState<{ blob: Blob | null; name: string } | null>(null)
  const [jpgToPng, setJpgToPng] = useState<{ blob: Blob | null; name: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePngToJpg = async (files: File[]) => {
    const f = files[0]
    if (!f) return
    setLoading(true)
    setError(null)
    try {
      const blob = await convertImageFile(f, 'jpeg', 0.92)
      if (blob) {
        setPngToJpg({ blob, name: f.name.replace(/\.[^.]+$/, '') + '.jpg' })
      }
    } catch (e) {
      setError('Conversion failed')
    } finally {
      setLoading(false)
    }
  }

  const handleJpgToPng = async (files: File[]) => {
    const f = files[0]
    if (!f) return
    setLoading(true)
    setError(null)
    try {
      const blob = await convertImageFile(f, 'png', 1)
      if (blob) {
        setJpgToPng({ blob, name: f.name.replace(/\.[^.]+$/, '') + '.png' })
      }
    } catch {
      setError('Conversion failed')
    } finally {
      setLoading(false)
    }
  }

  const download = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">Image Converter</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">PNG to JPG</h3>
          <FileUpload onFiles={handlePngToJpg} accept="image/png" />
          {loading && <p className="text-sm text-gray-600">Converting...</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
          {pngToJpg?.blob && (
            <div className="mt-2">
              <button className="px-3 py-2 bg-green-600 text-white rounded" onClick={() => download(pngToJpg.blob!, pngToJpg.name)}>Download</button>
            </div>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">JPG to PNG</h3>
          <FileUpload onFiles={handleJpgToPng} accept="image/jpeg,image/jpg,image/png" />
          {jpgToPng?.blob && (
            <div className="mt-2">
              <button className="px-3 py-2 bg-green-600 text-white rounded" onClick={() => download(jpgToPng.blob!, jpgToPng.name)}>Download</button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
