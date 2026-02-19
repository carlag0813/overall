"use client"

import { DrawerFooter } from "@/components/ui/drawer"
import { Separator } from "@/components/ui/separator"
import { DrawerClose } from "@/components/ui/drawer"
import { DrawerTitle } from "@/components/ui/drawer"
import { DrawerHeader } from "@/components/ui/drawer"
import { DrawerContent } from "@/components/ui/drawer"
import { Drawer } from "@/components/ui/drawer"
import { useState } from "react"
import { Heart, Copy, ClipboardCheck, Eye, ChevronRight, Zap, HelpCircle, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { TimeExpectation } from "@/components/time-expectation"
import { FAQHomeButton } from "@/components/faq-home-button"
import { HomeBannerCarousel } from "@/components/home-banner-carousel"

interface ProductCardsProps {
  salaryAdvanceAmount: number
  personalLoanAmount: number
  netSalary: number
  legalDeductions: number
  judicialDeductions: number
  thirdPartyDeductions: number
}

export function ProductCards({
  salaryAdvanceAmount,
  personalLoanAmount,
  netSalary,
  legalDeductions,
  judicialDeductions,
  thirdPartyDeductions,
}: ProductCardsProps) {
  const router = useRouter()
  const [showBreakdownModal, setShowBreakdownModal] = useState(false)
  const [breakdownType, setBreakdownType] = useState<"adelanto" | "prestamo">("prestamo")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleShowBreakdown = (type: "adelanto" | "prestamo") => {
    setBreakdownType(type)
    setShowBreakdownModal(true)
  }

  const handleProductClick = (productType: "adelanto" | "prestamo") => {
    console.log("[v0] Navigating to simulator with type:", productType)
    router.push(`/simulador-prestamo?tipo=${productType}`)
  }

  const availableAmount = breakdownType === "prestamo" ? personalLoanAmount : salaryAdvanceAmount
  const baseAfterDeductions = netSalary - legalDeductions - judicialDeductions - thirdPartyDeductions
  const limitPercentage = breakdownType === "prestamo" ? 0.5 : 0.3

  return (
    <section className="space-y-2">
      {/* Header con saludo en una sola línea */}
      <div className="flex items-center gap-2 md:gap-3 px-1 animate-in fade-in slide-in-from-top-2 duration-500 delay-150">
        <span className="text-3xl md:text-4xl flex-shrink-0">👋</span>
        <p className="font-bold text-lg md:text-xl text-foreground">¡Hola Carlos! <span className="font-semibold text-foreground/80">Acceso rápido a tus servicios</span></p>
      </div>

      {/* Grilla de 4 accesos rápidos - Estilo Yape */}
      <div className="grid grid-cols-2 gap-2 md:gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        {/* Préstamo Personal - Más prominente */}
        <button
          onClick={() => handleProductClick("prestamo")}
          className="group relative"
        >
          <div className="bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 rounded-2xl p-3 md:p-4 h-32 md:h-36 flex flex-col items-center justify-center gap-1.5 border border-amber-700/30 shadow-xl"
          >
            <div className="p-3 md:p-3.5 rounded-xl bg-amber-800 shadow-lg">
              <Zap className="h-6 w-6 md:h-7.5 md:w-7.5 text-white" />
            </div>
            <div className="text-center">
              <p className="font-bold text-sm md:text-base text-white/95 leading-tight">Préstamo</p>
              <p className="text-xs text-white/80 font-medium">Personal</p>
            </div>
            <div className="text-center pt-1">
              <p className="text-xl md:text-2xl font-bold text-white drop-shadow-lg">{formatCurrency(personalLoanAmount)}</p>
            </div>
          </div>
        </button>

        {/* Adelanto de Salario - Más prominente */}
        <button
          onClick={() => handleProductClick("adelanto")}
          className="group relative"
        >
          <div className="bg-gradient-to-br from-teal-400 via-teal-500 to-cyan-600 rounded-2xl p-3 md:p-4 h-32 md:h-36 flex flex-col items-center justify-center gap-1.5 border border-teal-700/30 shadow-xl"
          >
            <div className="p-3 md:p-3.5 rounded-xl bg-teal-800 shadow-lg">
              <BarChart3 className="h-6 w-6 md:h-7.5 md:w-7.5 text-white" />
            </div>
            <div className="text-center">
              <p className="font-bold text-sm md:text-base text-white/95 leading-tight">Adelanto</p>
              <p className="text-xs text-white/80 font-medium">de Salario</p>
            </div>
            <div className="text-center pt-1">
              <p className="text-xl md:text-2xl font-bold text-white drop-shadow-lg">{formatCurrency(salaryAdvanceAmount)}</p>
            </div>
          </div>
        </button>

        {/* Mis Operaciones */}
        <Link href="/mi-historial" className="group">
          <div className="bg-gradient-to-br from-blue-500/20 to-indigo-600/10 rounded-2xl p-3 md:p-4 h-32 md:h-36 flex flex-col items-center justify-center gap-1.5 border border-blue-200/50"
          >
            <div className="p-3 md:p-3.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
              <ClipboardCheck className="h-6 w-6 md:h-7.5 md:w-7.5 text-white" />
            </div>
            <div className="text-center">
              <p className="font-bold text-sm md:text-base text-foreground leading-tight">Mis</p>
              <p className="text-xs text-foreground/60 font-medium">Operaciones</p>
            </div>
          </div>
        </Link>

        {/* Ayuda / FAQ */}
        <button
          onClick={() => {
            // Simular click en el componente FAQ
            document.querySelector('[title="Preguntas frecuentes"]')?.dispatchEvent(new Event('click', { bubbles: true }))
          }}
          className="group"
        >
          <div className="bg-gradient-to-br from-emerald-500/20 to-green-600/10 rounded-2xl p-3 md:p-4 h-32 md:h-36 flex flex-col items-center justify-center gap-1.5 border border-emerald-200/50"
          >
            <div className="p-3 md:p-3.5 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
              <HelpCircle className="h-6 w-6 md:h-7.5 md:w-7.5 text-white" />
            </div>
            <div className="text-center">
              <p className="font-bold text-sm md:text-base text-foreground leading-tight">Ayuda</p>
              <p className="text-xs text-foreground/60 font-medium">FAQ</p>
            </div>
          </div>
        </button>
      </div>

      {/* Banner Carousel */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
        <HomeBannerCarousel />
      </div>

      <Drawer open={showBreakdownModal} onOpenChange={setShowBreakdownModal}>
        <DrawerContent className="max-h-[80vh]">
          <DrawerHeader className="text-left">
            <DrawerTitle className="flex items-center gap-2 text-lg font-bold">
              <Eye className="h-5 w-5 text-primary" />
              Desglose del Monto
            </DrawerTitle>
            <DrawerClose className="absolute right-4 top-4 opacity-70 hover:opacity-100">
              <span className="sr-only">Cerrar</span>
            </DrawerClose>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto px-4 pb-6">
            <p className="text-sm text-foreground/70 mb-4">
              Ejemplo de cálculo de Monto Máximo para{" "}
              <span className="font-semibold text-foreground">
                {breakdownType === "prestamo" ? "Préstamo Personal" : "Adelanto de Salario"}
              </span>
            </p>

            <div className="space-y-3 bg-foreground/5 rounded-lg p-4 border border-foreground/10 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground/70">Sueldo Neto </span>
                <span className="font-bold text-foreground">{formatCurrency(1200)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground/70">{"(-) Descuentos Judiciales"}</span>
                <span className="text-sm font-medium text-destructive">-{formatCurrency(150)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground/70">{"(-) Descuentos de Ley"}</span>
                <span className="text-sm font-medium text-destructive">-{formatCurrency(80)}</span>
              </div>

              <div className="flex justify-between items-center bg-gradient-to-r from-blue-500/10 to-blue-400/5 p-2 rounded mt-2 border border-blue-500/20">
                <span className="text-sm font-medium text-foreground">Base de seguridad</span>
                <span className="text-sm font-bold text-blue-600">{formatCurrency(970)}</span>
              </div>

              <p className="text-xs text-foreground/60 italic">La base debe ser mayor al límite de sueldo</p>

              <Separator className="my-2" />

              <div className="flex justify-between items-center text-sm font-semibold pt-2">
                <span className="text-foreground">Límite ({breakdownType === "prestamo" ? "50%" : "30%"} Sueldo Bruto)</span>
                <span className="text-foreground">{formatCurrency(600)}</span>
              </div>

              <Separator className="my-2" />

              <div className="flex justify-between items-center pt-2 bg-gradient-to-r from-primary/10 to-primary/5 p-3 rounded-lg">
                <span className="font-semibold text-foreground">Disponible para solicitud</span>
                <span className={`text-2xl font-bold ${breakdownType === "prestamo" ? "text-premium" : "text-primary"}`}>
                  {formatCurrency(600)}
                </span>
              </div>
            </div>
          </div>

          <DrawerFooter className="border-t">
            <Button 
              className="w-full font-semibold h-11 bg-primary hover:bg-primary/90" 
              onClick={() => setShowBreakdownModal(false)}
            >
              Entendido
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </section>
  )
}
