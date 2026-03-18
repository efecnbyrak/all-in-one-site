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
    // Mammoth convert to HTML using dynamic import
    const mammoth = (await import('mammoth')).default || (await import('mammoth'))
    const { value: html } = await mammoth.convertToHtml({ buffer: buf })
    const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

    // Generate a PDF from extracted text using pdfkit (dynamic import)
    const pdfkitMod = await import('pdfkit')
    const PDFDocument = pdfkitMod.default || pdfkitMod.PDFDocument
    const doc = new PDFDocument({ margin: 40 })
    const chunks: Buffer[] = []
    doc.on('data', (chunk: any) => chunks.push(chunk))
    const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)))
      doc.on('error', reject)
      doc.fontSize(12).text(text, { width: 500 })
      doc.end()
    })

    const pdfBase64 = pdfBuffer.toString('base64')
    return NextResponse.json({ success: true, pdfBase64, filename: 'document.pdf' })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 })
  }
}
