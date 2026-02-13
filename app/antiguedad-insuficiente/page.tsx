"use client"

import { Clock, Mail, ArrowLeft, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { AppFooter } from "@/components/app-footer"

export default function AntiguedadInsuficientePage() {
  // Datos de ejemplo del colaborador
  const fechaIngreso = "15 de noviembre, 2025"
  const mesesActuales = 2
  const mesesRequeridos = 3

  return (
    <div className="min-h-screen bg-background">
      <header className="gradient-executive px-4 pt-12 pb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 -ml-2 font-medium">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Button>
        </Link>
        <h1 className="text-white font-bold text-xl mt-4">Antigüedad Insuficiente</h1>
      </header>

      <div className="px-4 py-6">
        <Card className="bg-gradient-to-br from-attention-light/50 to-white border-attention/40 p-6 relative overflow-hidden shadow-md border-t-4 border-t-attention">
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-attention/10 rounded-full -mr-12 -mt-12" />

          <div className="relative">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="bg-attention/20 p-4 rounded-full">
                <Clock className="h-10 w-10 text-attention" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-lg font-bold text-foreground text-center mb-3">Antigüedad mínima no cumplida</h2>

            {/* Message */}
            <p className="text-muted-foreground text-center text-sm leading-relaxed mb-6">
              Para aplicar a un adelanto de sueldo en Overall, necesitas una antigüedad mínima de{" "}
              <span className="font-bold text-attention">3 meses</span> en la empresa.
            </p>

            {/* Progress indicator */}
            <div className="bg-attention-light/30 rounded-lg p-4 border border-attention/30 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground font-medium">Tu progreso</span>
                <span className="text-xs font-bold text-foreground">
                  {mesesActuales} de {mesesRequeridos} meses
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-attention rounded-full transition-all"
                  style={{ width: `${(mesesActuales / mesesRequeridos) * 100}%` }}
                />
              </div>
              <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>Fecha de ingreso: {fechaIngreso}</span>
              </div>
            </div>

            {/* Estimated availability */}
            <div className="bg-interaction-light/30 rounded-lg p-4 border border-interaction/30 mb-4">
              <p className="text-xs text-muted-foreground text-center mb-1 font-medium">Podrás acceder a partir del:</p>
              <p className="text-sm font-bold text-interaction text-center">15 de febrero, 2026</p>
            </div>

            {/* Divider */}
            <div className="border-t border-border my-4" />

            {/* Contact section */}
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground text-center font-semibold uppercase tracking-wide">
                ¿Tienes dudas?
              </p>

              <a
                href="mailto:rrhh@overall.com"
                className="flex items-center justify-center gap-2 bg-card border border-border rounded-lg py-3 px-4 text-foreground hover:bg-secondary transition-colors font-medium"
              >
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-sm">Contactar a RRHH</span>
              </a>
            </div>

            {/* Back to home button */}
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-4 text-muted-foreground hover:text-foreground hover:bg-secondary font-medium"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al inicio
              </Button>
            </Link>
          </div>
        </Card>

        {/* Additional info card */}
        <Card className="mt-4 p-4 bg-secondary border-border">
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            El requisito de antigüedad mínima de 3 meses es una política de Overall para garantizar la estabilidad
            laboral antes de acceder a los beneficios financieros. Una vez cumplido este período, podrás acceder a tus
            ofertas preaprobadas automáticamente.
          </p>
        </Card>
      </div>

      <AppFooter />
    </div>
  )
}
