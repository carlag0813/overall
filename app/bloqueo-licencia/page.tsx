"use client"

import { AlertTriangle, Mail, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { AppFooter } from "@/components/app-footer"

export default function BloqueoLicenciaPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header simplificado */}
      <header className="bg-primary px-4 pt-12 pb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10 -ml-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Button>
        </Link>
        <h1 className="text-primary-foreground font-semibold text-xl mt-4">Bloqueo por Licencia</h1>
      </header>

      <div className="px-4 py-6">
        <Card className="bg-amber-50 border-amber-200 p-6 relative overflow-hidden">
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-100 rounded-full -mr-12 -mt-12" />

          <div className="relative">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="bg-amber-100 p-4 rounded-full">
                <AlertTriangle className="h-10 w-10 text-amber-600" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-lg font-semibold text-amber-900 text-center mb-3">Oferta no disponible</h2>

            {/* Message */}
            <p className="text-amber-800 text-center text-sm leading-relaxed mb-6">
              Tu oferta no está disponible actualmente por situación de licencia. Para más información, por favor
              contacta a RRHH.
            </p>

            {/* Divider */}
            <div className="border-t border-amber-200 my-4" />

            {/* Contact section */}
            <div className="space-y-3">
              <p className="text-xs text-amber-700 text-center font-medium uppercase tracking-wide">
                Canal de contacto
              </p>

              <a
                href="mailto:rrhh@overall.com"
                className="flex items-center justify-center gap-2 bg-white border border-amber-200 rounded-lg py-3 px-4 text-amber-800 hover:bg-amber-50 transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span className="text-sm font-medium">Enviar correo a RRHH</span>
              </a>
            </div>

            {/* Back to home button */}
            <Link href="/">
              <Button variant="ghost" size="sm" className="w-full mt-4 text-amber-700 hover:bg-amber-100">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al inicio
              </Button>
            </Link>
          </div>
        </Card>

        {/* Additional info card */}
        <Card className="mt-4 p-4 bg-muted/50 border-muted">
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            Durante tu período de licencia médica o descanso, los servicios de adelanto y préstamo se encuentran
            temporalmente suspendidos. Una vez reintegrado, podrás acceder nuevamente a tus ofertas preaprobadas.
          </p>
        </Card>
      </div>

      <AppFooter />
    </div>
  )
}
