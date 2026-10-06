import { useState, type FormEvent } from 'react'
import type { Copy, Locale } from '../content'

type Field = 'name' | 'email' | 'message'
const MSG: Record<Locale, Record<Field, string>> = {
  es: { name: 'Escribe tu nombre.', email: 'Escribe un correo válido.', message: 'Cuéntame la fecha y el lugar.' },
  en: { name: 'Enter your name.', email: 'Enter a valid email.', message: 'Tell me the date and the venue.' },
}

export type FormStatus = 'idle' | 'sending' | 'ok' | 'error'

/**
 * Validación propia, en línea, ES y EN, y envío a /api/contact (Resend, función de Vercel).
 * Uso: <form noValidate onSubmit={onSubmit}>; en cada campo aria-invalid={!!errors.name} y el texto de errors.name.
 * `note` es el mensaje de estado para la región role="status".
 */
export function useBookingForm(locale: Locale, t: Copy) {
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [status, setStatus] = useState<FormStatus>('idle')

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (status === 'sending') return
    const form = e.currentTarget
    const f = new FormData(form)
    const v = (k: string) => String(f.get(k) ?? '').trim()
    const next: Partial<Record<Field, string>> = {}
    if (v('name').length < 2) next.name = MSG[locale].name
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v('email'))) next.email = MSG[locale].email
    if (v('message').length < 10) next.message = MSG[locale].message
    setErrors(next)
    const first = Object.keys(next)[0]
    if (first) {
      (form.elements.namedItem(first) as HTMLElement | null)?.focus()
      setStatus('idle')
      return
    }
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: v('name'), email: v('email'), subject: v('subject') || 'booking', message: v('message') }),
      })
      if (!res.ok) throw new Error(String(res.status))
      setStatus('ok')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  const note = status === 'sending' ? t.contact.sending : status === 'ok' ? t.contact.success : status === 'error' ? t.contact.error : ''
  return { errors, status, onSubmit, note }
}
