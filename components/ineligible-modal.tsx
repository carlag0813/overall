"use client"

import { AlertCircle, Clock, FileX } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface IneligibleModalProps {
  isOpen: boolean
  onClose: () => void
  reason: "active_loan" | "insufficient_seniority"
}

export function IneligibleModal({ isOpen, onClose, reason }: IneligibleModalProps) {
  const content = {
    active_loan: {
      icon: FileX,
      title: "Operación en curso",
      description:
        "Actualmente tienes un préstamo o adelanto vigente. Una vez que finalices tu operación actual, podrás solicitar un nuevo financiamiento.",
      suggestion: "Te notificaremos cuando tu línea esté disponible nuevamente.",
    },
    insufficient_seniority: {
      icon: Clock,
      title: "Antigüedad insuficiente",
      description: "Para acceder a este producto necesitas cumplir con el tiempo mínimo de antigüedad en la empresa.",
      suggestion: "Adelanto de salario: 3 meses mínimo. Préstamo personal: 6 meses mínimo.",
    },
  }

  const { icon: Icon, title, description, suggestion } = content[reason]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[340px] rounded-2xl p-0 overflow-hidden">
        <div className="bg-red-500/5 p-6 flex flex-col items-center text-center">
          <div className="p-4 rounded-full bg-red-500/10 mb-4">
            <Icon className="h-8 w-8 text-red-500" />
          </div>
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl text-foreground">{title}</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-5">
          <div className="flex items-start gap-3 bg-secondary/50 rounded-xl p-3 mb-4">
            <AlertCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">{suggestion}</p>
          </div>

          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" onClick={onClose}>
            Entendido
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
