'use client'

import React from "react"

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Mostrar página cuando cambia la ruta
    setIsVisible(false)
    
    // Usar RAF para sincronizar con el navegador
    const frame = requestAnimationFrame(() => {
      setIsVisible(true)
    })

    return () => cancelAnimationFrame(frame)
  }, [pathname])

  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        backfaceVisibility: 'hidden',
        transform: 'translateZ(0)',
      }}
    >
      {children}
    </div>
  )
}
