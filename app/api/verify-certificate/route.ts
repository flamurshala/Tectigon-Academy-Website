import { NextResponse } from 'next/server'
import { z } from 'zod'

export const runtime = 'nodejs'

const CERTIFICATE_DOWNLOAD_URL =
  process.env.CERTIFICATE_DOWNLOAD_URL ||
  'https://tsms.tectigonacademy.com/backend/download_certificate_by_identity.php'

const CERTIFICATE_DOWNLOAD_API_KEY = 'tsms_cert_download_key_12345'

const payloadSchema = z.object({
  name: z.string().trim().min(1),
  surname: z.string().trim().min(1),
  certificateId: z.string().trim().min(1),
})

export async function POST(req: Request) {
  try {
    const data = payloadSchema.parse(await req.json())
    const fullName = `${data.name} ${data.surname}`.replace(/\s+/g, ' ').trim()

    const response = await fetch(CERTIFICATE_DOWNLOAD_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': CERTIFICATE_DOWNLOAD_API_KEY,
      },
      body: JSON.stringify({
        fullName,
        certificateId: data.certificateId,
      }),
    })

    if (!response.ok) {
      let message = 'Certificate not found'

      try {
        const error = (await response.json()) as { error?: string }
        message = error.error || message
      } catch {
        // The upstream API may return a non-JSON error body.
      }

      return NextResponse.json(
        { success: false, message },
        { status: response.status },
      )
    }

    const pdf = await response.arrayBuffer()

    return new NextResponse(pdf, {
      status: 200,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/pdf',
        'Content-Disposition':
          response.headers.get('Content-Disposition') ||
          'attachment; filename="certificate.pdf"',
      },
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Name, surname, and certificate ID are required.' },
        { status: 400 },
      )
    }

    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Certificate verification error', { message })

    return NextResponse.json(
      { success: false, message: 'Certificate verification failed.' },
      { status: 500 },
    )
  }
}
