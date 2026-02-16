'use client'

import { HelpCircle } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FAQModal } from '@/components/faq-modal'
import Link from 'next/link'

export function FAQHomeButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="default"
        size="lg"
        className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all gap-2 flex-shrink-0 w-full justify-center"
        title="Preguntas frecuentes"
        aria-label="Abrir preguntas frecuentes"
      >
        <HelpCircle className="h-5 w-5" />
        <span>FAQ</span>
      </Button>

      <FAQModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
