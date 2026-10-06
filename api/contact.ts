import type { VercelRequest, VercelResponse } from '@vercel/node'

// Formulario de bookings de djspin.co. Envía con Resend.
// Variables (Vercel, y .env.local para probar en local):
//   RESEND_API_KEY  obligatoria
//   CONTACT_TO      destino. Por defecto mspindj@gmail.com
//   CONTACT_FROM    remitente. Por defecto el de pruebas de Resend, que SOLO entrega al correo
//                   dueño de la cuenta de Resend. Para otro destino hay que verificar un dominio.
const SUBJECTS: Record<string, string> = { booking: 'Booking', press: 'Prensa', brand: 'Curaduría sonora', other: 'Otro' }
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
// En el asunto y en reply_to no puede ir un salto de línea.
const oneLine = (s: string) => s.replace(/[\r\n]+/g, ' ')

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const body = (req.body ?? {}) as Record<string, unknown>
  const name = oneLine(clean(body.name, 120))
  const email = oneLine(clean(body.email, 200))
  const subjectKey = clean(body.subject, 20)
  const message = clean(body.message, 5000)

  if (name.length < 2 || !EMAIL.test(email) || message.length < 10) {
    return res.status(400).json({ error: 'Missing or invalid fields' })
  }
  const subject = SUBJECTS[subjectKey] ?? SUBJECTS.other

  const RESEND_API_KEY = process.env.RESEND_API_KEY
  if (!RESEND_API_KEY) {
    console.error('contact: falta RESEND_API_KEY en este entorno')
    return res.status(500).json({ error: 'Server misconfigured' })
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || 'Spin Website <onboarding@resend.dev>',
        to: [process.env.CONTACT_TO || 'mspindj@gmail.com'],
        subject: `[${subject}] ${name} · djspin.co`,
        reply_to: email,
        text: `${subject} desde djspin.co\n\nNombre: ${name}\nEmail: ${email}\n\n${message}`,
        html: `
          <h2>${esc(subject)} desde djspin.co</h2>
          <p><strong>Nombre:</strong> ${esc(name)}</p>
          <p><strong>Email:</strong> ${esc(email)}</p>
          <hr />
          <p>${esc(message).replace(/\n/g, '<br />')}</p>
        `,
      }),
    })

    if (!response.ok) {
      // El detalle queda en los logs de la función, no se le muestra a quien escribe.
      const detail = await response.text().catch(() => '')
      console.error(`contact: Resend respondió ${response.status}: ${detail.slice(0, 500)}`)
      return res.status(502).json({ error: 'Failed to send' })
    }

    return res.status(200).json({ success: true })
  } catch (e) {
    console.error('contact: no se pudo llamar a Resend', e)
    return res.status(502).json({ error: 'Failed to send' })
  }
}
