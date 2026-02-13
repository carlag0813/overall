'use client'

import { useState } from 'react'
import { HelpCircle } from 'lucide-react'
import { FAQModal } from '@/components/faq-modal'
import { usePathname } from 'next/navigation'

export function FAQButton() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // No mostrar en home ni en solicitud exitosa
  if (pathname === '/' || pathname === '/solicitud-exitosa') {
    return null
  }

  return (
    <>
      {/* Botón flotante circular en esquina superior derecha, debajo del stepper */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-24 right-4 z-30 p-3 rounded-full bg-emerald-500 border-2 border-emerald-600 hover:bg-emerald-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 my-4"
        aria-label="Abrir preguntas frecuentes"
        title="Preguntas frecuentes"
      >
        <HelpCircle className="h-5 w-5 text-white" />
      </button>

      {/* Modal FAQ - Sheet desde abajo */}
      <FAQModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
