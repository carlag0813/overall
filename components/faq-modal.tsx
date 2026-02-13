'use client'

import { DialogTitle } from "@/components/ui/dialog"
import { DialogHeader } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { DialogContent } from "@/components/ui/dialog"
import { Dialog } from "@/components/ui/dialog"
import { X } from 'lucide-react'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose, DrawerFooter } from '@/components/ui/drawer'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { HelpCircle } from 'lucide-react'

interface FAQModalProps {
  isOpen: boolean
  onClose: () => void
}

const faqItems = [
  {
    id: 'process-time',
    question: '¿Cuánto tiempo tarda el proceso de aprobación?',
    answer:
      'La aprobación es instantánea. Una vez completes tu solicitud, verás el resultado inmediatamente. Si es aprobada, el dinero entrará en proceso de depósito y debería estar disponible en tu cuenta dentro de 24 horas.',
  },
  {
    id: 'interest-rates',
    question: '¿Cuál es la tasa de interés?',
    answer:
      'Las tasas varían según el monto y plazo del préstamo. En el simulador puedes ver exactamente cuánto pagarás en intereses, IGV y comisiones antes de confirmar tu solicitud. Es totalmente transparente.',
  },
  {
    id: 'documents',
    question: '¿Qué documentos necesito?',
    answer:
      'Solo necesitas tu cédula de identidad vigente. El sistema se conecta automáticamente con nómina para verificar tu información. Todo es digital y sin papeleos innecesarios.',
  },
  {
    id: 'repayment',
    question: '¿Cómo funciona el pago de cuotas?',
    answer:
      'Para Préstamo Personal, las cuotas se descuentan automáticamente de tu segunda quincena de cada mes. No necesitas hacer nada, es automático. Puedes ver el cronograma completo en el simulador.',
  },
  {
    id: 'multiple-products',
    question: '¿Puedo solicitar ambos productos a la vez?',
    answer:
      'No, solo puedes tener una operación vigente a la vez. Debes esperar a que una se complete antes de solicitar otra. Recibirás notificación cuando tu línea esté disponible nuevamente.',
  },
  {
    id: 'rejection',
    question: '¿Por qué mi solicitud fue rechazada?',
    answer:
      'Las razones comunes incluyen: no cumplir con los meses de antigüedad requeridos, tener una operación vigente, o información incompleta en nómina. Verás el motivo específico en tu solicitud rechazada. Puedes contactarnos si tienes dudas.',
  },
]

export function FAQModal({ isOpen, onClose }: FAQModalProps) {
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader className="text-left">
          <DrawerTitle className="flex items-center gap-2 text-lg font-bold">
            <HelpCircle className="h-5 w-5 text-emerald-600" />
            Preguntas Frecuentes
          </DrawerTitle>
          <DrawerClose className="absolute right-4 top-4 opacity-70 hover:opacity-100">
            <span className="sr-only">Cerrar</span>
          </DrawerClose>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-6">
          <div className="space-y-2">
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item) => (
                <AccordionItem key={item.id} value={item.id} className="border-b border-emerald-500/10">
                  <AccordionTrigger className="hover:text-emerald-600 py-3 data-[state=open]:text-emerald-600 transition-colors">
                    <span className="text-sm font-semibold text-foreground text-left leading-tight">
                      {item.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-foreground/70 leading-relaxed pb-3">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        <DrawerFooter className="border-t">
          <Button 
            className="w-full font-semibold h-11 bg-emerald-500 hover:bg-emerald-600" 
            onClick={onClose}
          >
            Entendido
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
