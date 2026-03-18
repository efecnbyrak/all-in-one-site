import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs18.x'

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData()
    const file = form.get('file') as File | null
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Enforce max 3MB
    if ((file as any).size && (file as any).size > 3 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Max 3MB.' }, { status: 413 })
    }

    const buf = Buffer.from(await (file as any).arrayBuffer())
    // Mammoth convert to HTML using dynamic import (robust import)
    const mammothModule = await import('mammoth')
    const mammoth = mammothModule.default ?? mammothModule
    const { value: html } = await mammoth.convertToHtml({ buffer: buf })
    const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

    // Generate a PDF from extracted text using pdf-lib (serverless-friendly, no native deps)
    const pdfLibModule = await import('pdf-lib')
    const PDFDocument = pdfLibModule.PDFDocument ?? pdfLibModule.default?.PDFDocument
    const StandardFonts = pdfLibModule.StandardFonts ?? pdfLibModule.default?.StandardFonts
    if (!PDFDocument || !StandardFonts) throw new Error('PDF library load failed')
    const pdfDoc = await PDFDocument.create()
    const HelveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

    let currentPage = pdfDoc.addPage([612, 792])
    const { height } = currentPage.getSize()
    const fontSize = 12
    const wrap = (s: string, max: number) => {
      const res: string[] = []
      let i = 0
      while (i < s.length) {
        res.push(s.substring(i, i + max))
        i += max
      }
      return res
    }
    const lines = text.split(/\r?\n/)
    let y = height - 50
    for (const line of lines) {
      const chunks = wrap(line, 60)
      for (const chunk of chunks) {
        if (y < 40) {
          currentPage = pdfDoc.addPage([612, 792])
          y = height - 50
        }
        currentPage.drawText(chunk, { x: 40, y, size: fontSize, font: HelveticaFont })
        y -= fontSize + 2
      }
      if (y < height - 60) {
        y -= 4
      }
    }
    const pdfBytes = await pdfDoc.save()
    const pdfBase64 = Buffer.from(pdfBytes).toString('base64')
    return NextResponse.json({ success: true, pdfBase64, filename: 'document.pdf' })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 })
  }
}
