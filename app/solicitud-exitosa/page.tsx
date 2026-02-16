"use client"

import { Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useScrollToTop } from "@/hooks/use-scroll-to-top"
import { AppFooter } from "@/components/app-footer"
import { CheckCircle2, Home, Download, Clock, Building2, FileText, Loader2, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const mockUser = {
  bankName: "BCP",
  accountNumber: "************7845",
}

function SolicitudExitosaContent() {
  useScrollToTop()
  const router = useRouter()
  const searchParams = useSearchParams()

  const amount = Number(searchParams.get("monto")) || 1000
  const term = Number(searchParams.get("plazo")) || 6
  const productType = (searchParams.get("tipo") as "adelanto" | "prestamo") || "prestamo"
  const monthlyPayment = Number(searchParams.get("cuota")) || 180

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
    }).format(value)
  }

  const referenceNumber = `SOL-${Date.now().toString().slice(-8)}`
  const estimatedTime = productType === "adelanto" ? "30 minutos" : "24-48 horas"

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header verde success con gradientes y acentos */}
      <div className="bg-gradient-to-b from-success/15 via-success/5 to-background px-4 py-6 text-center border-b-2 border-b-success">
        <div className="flex justify-center mb-3 animate-in zoom-in-50 duration-500">
          <div className="relative h-20 w-20 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-success/30 to-success/20 rounded-full animate-pulse opacity-40" />
            <div className="absolute inset-2 bg-success/20 rounded-full animate-pulse opacity-20" style={{animationDelay: '0.2s'}} />
            <div className="p-2.5 rounded-full bg-gradient-to-br from-success/10 to-white border-3 border-success relative z-10 shadow-lg">
              <CheckCircle2 className="h-10 w-10 text-success animate-in slide-in-from-bottom-4 duration-700" />
            </div>
          </div>
        </div>
        <div className="space-y-0.5 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 mb-2">
          <h1 className="text-2xl font-bold text-success">¡Solicitud Exitosa!</h1>
          <p className="text-sm text-foreground/75 font-semibold">Tu {productType === "prestamo" ? "préstamo personal" : "adelanto de salario"} ha sido aprobado</p>
        </div>
      </div>

      <main className="flex-1 px-4 py-4 pb-20 space-y-3">
        {/* Card principal - Monto aprobado */}
        <Card className="border-0 shadow-lg overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          {/* Barra de color superior */}
          <div className="h-1 bg-success" />
          
          {/* Fondo gradient success */}
          <div className="bg-gradient-to-br from-success/8 via-white to-success/5 p-5 text-center">
            <p className="text-xs text-foreground/60 mb-1.5 font-semibold uppercase tracking-wider">Monto aprobado</p>
            <p className="text-4xl font-black text-success mb-2">
              {formatCurrency(amount)}
            </p>
            
          </div>

          {/* Tabla de detalles - Solo para préstamo */}
          {productType === "prestamo" && (
            <div className="grid grid-cols-2 gap-2 p-4 border-t border-success/10">
              {/* Columna 1: Cuota */}
              <div className="text-center space-y-1.5 p-3 rounded-lg bg-gradient-to-br from-success/10 to-success/5 border border-success/20 hover:shadow-md transition-all hover:scale-105 cursor-pointer duration-200 animate-in fade-in duration-500 delay-400" style={{animationFillMode: 'both'}}>
                <p className="text-[10px] text-foreground/70 font-semibold uppercase tracking-wide">Cuota</p>
                <p className="text-base font-black text-success">{formatCurrency(monthlyPayment)}</p>
                <p className="text-[10px] text-foreground/60 font-medium">mensual</p>
              </div>

              {/* Columna 2: Plazo */}
              <div className="text-center space-y-1.5 p-3 rounded-lg bg-gradient-to-br from-success/10 to-success/5 border border-success/20 hover:shadow-md transition-all hover:scale-105 cursor-pointer duration-200 animate-in fade-in duration-500 delay-500" style={{animationFillMode: 'both'}}>
                <p className="text-[10px] text-foreground/70 font-semibold uppercase tracking-wide">Plazo</p>
                <p className="text-base font-black text-success">{term}</p>
                <p className="text-[10px] text-foreground/60 font-medium">meses</p>
              </div>
            </div>
          )}
        </Card>

        {/* Tarjeta de información - Solo Estado */}
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400">
          {/* Card de Estado */}
          <div className={`bg-gradient-to-r ${productType === "prestamo" ? "from-amber-500/15 to-amber-400/10" : "from-emerald-500/15 to-emerald-400/10"} border ${productType === "prestamo" ? "border-amber-500/30" : "border-emerald-500/30"} rounded-lg p-4 group hover:shadow-md transition-all duration-200`}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 flex-1">
                <div className={`p-1.5 rounded-lg ${productType === "prestamo" ? "bg-amber-500/20" : "bg-emerald-500/20"} group-hover:${productType === "prestamo" ? "bg-amber-500/30" : "bg-emerald-500/30"} transition-colors flex-shrink-0`}>
                  <Clock className={`h-5 w-5 ${productType === "prestamo" ? "text-amber-600" : "text-emerald-600"}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-foreground/70 font-semibold uppercase tracking-wide">Estado</p>
                  <p className="text-sm text-foreground font-medium">¡Tu dinero ya está en camino!</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mensaje informativo con ícono */}
        <div className="p-3 bg-gradient-to-r from-success/5 via-success/3 to-success/5 rounded-lg border border-success/15 text-center animate-in fade-in duration-500 delay-500">
          <p className="text-xs text-foreground/75 leading-relaxed">
            <span className="font-semibold text-success">✓ Aprobado:</span> Monitorea el estado en tu <span className="font-semibold text-success">historial de transacciones</span>.
          </p>
        </div>
      </main>

      {/* Botones sticky - Verde success */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/98 to-transparent p-3 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-600">
        <Button
          className="w-full h-10 gap-2 bg-success hover:bg-success/90 text-white font-semibold text-sm transition-all hover:scale-105 active:scale-95 duration-200 shadow-lg hover:shadow-xl"
          onClick={() => router.push("/")}
        >
          Volver al inicio
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <AppFooter />
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}

export default function SolicitudExitosaPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SolicitudExitosaContent />
    </Suspense>
  )
}
