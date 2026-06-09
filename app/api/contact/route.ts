import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { z } from 'zod'

export const runtime = 'nodejs'

const phoneRegex = /^[+()0-9\s-]{7,20}$/

const payloadSchema = z.object({
  emri: z.string().trim().min(1),
  mbiemri: z.string().trim().min(1),
  email: z.string().trim().email(),
  telefoni: z.string().trim().regex(phoneRegex),
  mesazhi: z.string().trim().min(1),
})

function requiredEnv(name: string) {
  const raw = process.env[name]
  const val = typeof raw === 'string' ? raw.trim() : raw
  if (!val) throw new Error(`Missing env var: ${name}`)
  // Support .env values wrapped in single/double quotes.
  return val.replace(/^['"]|['"]$/g, '')
}

function escapeHtml(input: string) {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

export async function POST(req: Request) {
  try {
    const data = payloadSchema.parse(await req.json())

    const host = requiredEnv('SMTP_HOST')
    const port = Number(requiredEnv('SMTP_PORT'))
    const user = requiredEnv('SMTP_USER')
    const pass = requiredEnv('SMTP_PASS')
    const to = requiredEnv('MAIL_TO')
    const from = requiredEnv('MAIL_FROM')

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    })

    await transporter.verify()

    const html = `
      <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;line-height:1.5">
        <h2 style="margin:0 0 12px">New Contact Form Message</h2>
        <table style="border-collapse:collapse;width:100%;max-width:720px">
          <tr>
            <td style="padding:8px 10px;border:1px solid #e5e7eb;background:#f9fafb"><strong>Emër</strong></td>
            <td style="padding:8px 10px;border:1px solid #e5e7eb">${escapeHtml(data.emri)}</td>
          </tr>
          <tr>
            <td style="padding:8px 10px;border:1px solid #e5e7eb;background:#f9fafb"><strong>Mbiemër</strong></td>
            <td style="padding:8px 10px;border:1px solid #e5e7eb">${escapeHtml(data.mbiemri)}</td>
          </tr>
          <tr>
            <td style="padding:8px 10px;border:1px solid #e5e7eb;background:#f9fafb"><strong>Email</strong></td>
            <td style="padding:8px 10px;border:1px solid #e5e7eb">${escapeHtml(data.email)}</td>
          </tr>
          <tr>
            <td style="padding:8px 10px;border:1px solid #e5e7eb;background:#f9fafb"><strong>Numri i telefonit</strong></td>
            <td style="padding:8px 10px;border:1px solid #e5e7eb">${escapeHtml(data.telefoni)}</td>
          </tr>
          <tr>
            <td style="padding:8px 10px;border:1px solid #e5e7eb;background:#f9fafb"><strong>Mesazhi</strong></td>
            <td style="padding:8px 10px;border:1px solid #e5e7eb;white-space:pre-wrap">${escapeHtml(
              data.mesazhi,
            )}</td>
          </tr>
        </table>
      </div>
    `

    await transporter.sendMail({
      to,
      from,
      subject: 'New Contact Form Message',
      replyTo: data.email,
      html,
    })

    return NextResponse.json(
      { success: true, message: 'Mesazhi u dërgua me sukses.' },
      { status: 200 },
    )
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Invalid input', issues: err.issues },
        { status: 400 },
      )
    }

    const e = err as unknown as { code?: string; response?: string; message?: string }
    console.error('Contact SMTP error', {
      code: e?.code,
      response: e?.response,
      message: e?.message,
    })

    if (e?.code === 'EAUTH') {
      return NextResponse.json(
        {
          success: false,
          message:
            'SMTP authentication failed. Ju lutem verifikoni kredencialet SMTP në server.',
        },
        { status: 502 },
      )
    }

    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}

