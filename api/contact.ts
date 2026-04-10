import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, subject, message } = req.body

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Missing fields' })
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY
  if (!RESEND_API_KEY) {
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
        from: 'Spin Website <onboarding@resend.dev>',
        to: ['mspindj@gmail.com'],
        subject: `[${subject.toUpperCase()}] ${name} — djspin.co`,
        html: `
          <h2>${subject.toUpperCase()} inquiry from djspin.co</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr />
          <p>${message.replace(/\n/g, '<br />')}</p>
        `,
        reply_to: email,
      }),
    })

    if (!response.ok) {
      const err = await response.json()
      return res.status(500).json({ error: err.message || 'Failed to send' })
    }

    return res.status(200).json({ success: true })
  } catch {
    return res.status(500).json({ error: 'Failed to send email' })
  }
}
