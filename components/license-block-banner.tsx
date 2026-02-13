"use client"

import { AlertTriangle, Mail, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface LicenseBlockBannerProps {
  onDismiss?: () => void
}

export function LicenseBlockBanner({ onDismiss }: LicenseBlockBannerProps) {
  return (
    <div className="px-4 py-6">
      <Card className="bg-warning/5 border-warning/30 p-6 relative overflow-hidden">
        {/* Decorative element */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-warning/10 rounded-full -mr-12 -mt-12" />

        <div className="relative">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="bg-warning/10 p-4 rounded-full">
              <AlertTriangle className="h-10 w-10 text-warning" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-lg font-bold text-foreground text-center mb-3">Oferta no disponible</h2>

          {/* Message */}
          <p className="text-muted-foreground text-center text-sm leading-relaxed mb-6">
            Tu oferta no está disponible actualmente por situación de licencia. Para más información, por favor contacta
            a RRHH.
          </p>

          {/* Divider */}
          <div className="border-t border-border my-4" />

          {/* Contact section */}
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground text-center font-semibold uppercase tracking-wide">
              Canal de contacto
            </p>

            <a
              href="mailto:rrhh@overall.com"
              className="flex items-center justify-center gap-2 bg-card border border-border rounded-lg py-3 px-4 text-foreground hover:bg-secondary transition-colors font-medium"
            >
              <Mail className="h-4 w-4 text-primary" />
              <span className="text-sm">Enviar correo a RRHH</span>
            </a>
          </div>

          {/* Dismiss button */}
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-4 text-muted-foreground hover:text-foreground hover:bg-secondary font-medium"
              onClick={onDismiss}
            >
              <X className="h-4 w-4 mr-2" />
              Volver al inicio
            </Button>
          )}
        </div>
      </Card>

      {/* Additional info card */}
      <Card className="mt-4 p-4 bg-secondary border-border">
        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          Durante tu período de licencia médica o descanso, los servicios de adelanto y préstamo se encuentran
          temporalmente suspendidos. Una vez reintegrado, podrás acceder nuevamente a tus ofertas preaprobadas.
        </p>
      </Card>
    </div>
  )
}
