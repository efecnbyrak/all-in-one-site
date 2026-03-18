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
    const pdfModule = await import('pdf-parse')
    const pdfParse = pdfModule.default ?? pdfModule
    const data = await pdfParse(buf)
    const text = data.text || ''

    return NextResponse.json({ success: true, text })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 })
  }
}
