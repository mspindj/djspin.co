import { useState, type ReactNode } from 'react'
import { bandcampEmbed, bandcampUrl, type Release } from '../content'

/**
 * Fachada del player de Bandcamp: el iframe NO se carga al entrar, solo cuando la persona lo pide.
 * Sin estilos de diseño: la propuesta pinta el botón (children) y el contenedor con `className`.
 * Solo los releases con `albumId` (los tres EP) tienen embed; el resto enlaza a Bandcamp.
 */
export default function BandcampFacade({
  release, bg, link, className, height = 470, children,
}: {
  release: Release
  /** Colores del embed en hex SIN #. */
  bg: string
  link: string
  className?: string
  height?: number
  /** Contenido del botón que carga el player. */
  children: ReactNode
}) {
  const [on, setOn] = useState(false)
  if (!release.albumId) {
    return <a className={className} href={bandcampUrl(release)} target="_blank" rel="noopener noreferrer">{children}</a>
  }
  if (!on) {
    return <button type="button" className={className} onClick={() => setOn(true)}>{children}</button>
  }
  return (
    <iframe
      className={className}
      title={`${release.title}, Spin`}
      src={bandcampEmbed(release.albumId, bg, link)}
      style={{ border: 0, width: '100%', height }}
      loading="lazy"
    />
  )
}
