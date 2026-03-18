"use client" 
import React, { DragEvent, useCallback, useMemo, useState } from 'react'

type Props = {
  onFiles: (files: File[]) => void
  accept?: string
  multiple?: boolean
}

export default function FileUpload({ onFiles, accept = '*/*', multiple = false }: Props) {
  const [dragOver, setDragOver] = useState(false)

  const onDrop = useCallback((e: DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer?.files || [])
    if (files.length) onFiles(files)
  }, [onFiles])

  const onDragOver = (e: DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const onDragLeave = () => setDragOver(false)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    if (files.length) onFiles(files)
  }

  const borderClass = dragOver ? 'border-indigo-500' : 'border-gray-300'
  return (
    <div
      className={`flex items-center justify-center p-6 border-dashed rounded-lg border-2 ${borderClass} bg-white/60 dark:bg-gray-800/60 hover:bg-gray-50 dark:hover:bg-gray-700`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      style={{ minHeight: '120px' }}
    >
      <div className="text-center">
        <p className="mb-2 text-sm text-gray-600">Drag & drop files here, or</p>
        <label className="inline-block cursor-pointer px-4 py-2 bg-blue-600 text-white rounded">
          Browse
          <input type="file" accept={accept} multiple={multiple} onChange={onChange} className="hidden" />
        </label>
      </div>
    </div>
  )
}
