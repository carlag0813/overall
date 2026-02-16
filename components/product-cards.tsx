"use client"

import { DrawerFooter } from "@/components/ui/drawer"
import { Separator } from "@/components/ui/separator"
import { DrawerClose } from "@/components/ui/drawer"
import { DrawerTitle } from "@/components/ui/drawer"
import { DrawerHeader } from "@/components/ui/drawer"
import { DrawerContent } from "@/components/ui/drawer"
import { Drawer } from "@/components/ui/drawer"
import { useState } from "react"
import { Heart, Copy, ClipboardCheck, Eye, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { TimeExpectation } from "@/components/time-expectation"
import { FAQHomeButton } from "@/components/faq-home-button"

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
    <section>
      {/* Header con saludo e iconos de historial y FAQ */}
      <div className="flex items-start justify-between gap-3 md:gap-4 mb-8 px-1 mt-5 animate-in fade-in slide-in-from-top-2 duration-500 delay-150">
        <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
          <span className="text-3xl md:text-4xl flex-shrink-0">👋</span>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg md:text-xl font-bold text-foreground">¡Hola Carlos!</h2>
            <p className="font-semibold text-foreground leading-tight text-xs md:text-sm">
              <span className="block md:inline">Conoce tus créditos disponibles</span>
              
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <Link href="/mi-historial" className="flex-shrink-0 w-full">
            <Button 
              variant="default"
              size="sm"
              className="md:size-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold shadow-lg hover:shadow-xl transition-all gap-1 md:gap-2 h-9 md:h-10 w-full justify-center"
              title="Ver mis solicitudes"
            >
              <ClipboardCheck className="h-4 w-4 md:h-5 md:w-5" />
              <span className="text-xs md:text-sm">Mis Operaciones</span>
            </Button>
          </Link>

          {/* FAQ Button - Debajo del botón de Mis Operaciones */}
          <FAQHomeButton />
        </div>
      </div>

      {/* Tu Oferta Preaprobada */}
      

      {/* TimeExpectation banner - Arriba de las tarjetas */}
      <TimeExpectation />

      <div className="space-y-4">
        {/* Personal Loan Card */}
        <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-[#D97706]/35 via-[#F59E0B]/20 to-[#FFF1B9]/10 group relative animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[450ms]">
          <div className="h-1 bg-[#D97706] relative z-10" />
          
          <CardHeader className="pt-4 px-5 relative z-10 pb-0.5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2.5 rounded-lg bg-[#D97706]/15">
                  <span className="text-2xl">💎</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-foreground">Préstamo por Planilla</h3>
                  <p className="text-xs text-foreground/70 font-medium">Disponible al instante</p>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pb-4 px-5 space-y-4 relative z-10">
            <div className="bg-gradient-to-br from-[#FFF1B9]/40 to-[#FFF1B9]/20 rounded-lg p-4 text-center border border-[#F59E0B]/30 py-3">
              <p className="text-foreground/70 mb-2 font-semibold text-base">Monto  Garantizado</p>
              <p className="font-bold text-[#D97706] mb-1 filter drop-shadow-lg text-4xl">{formatCurrency(personalLoanAmount)}</p>
              
            </div>

            <Button
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold text-sm h-10 transition-all hover:shadow-md"
              onClick={() => handleProductClick("prestamo")}
            >
              Iniciar solicitud de préstamo
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="w-full text-[#D97706] hover:text-[#D97706] font-medium hover:bg-[#FFF1B9]/40 h-8 text-base"
              onClick={() => handleShowBreakdown("prestamo")}
            >
              <Eye className="h-3.5 w-3.5 mr-1.5" />
              Conoce cómo calculamos el monto
            </Button>
          </CardContent>

          <CardFooter className="pt-0 px-5 relative z-10 pb-2">
          </CardFooter>
        </Card>

        {/* Salary Advance Card */}
        <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-interaction/35 via-interaction/20 to-interaction/10 group relative animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[600ms]">
          <div className="bg-interaction relative z-10 h-1" />

          <CardHeader className="pt-4 px-5 relative z-10 pb-0.5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2.5 rounded-lg bg-interaction/15">
                  <span className="text-2xl">💼</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-foreground">Adelanto de Salario</h3>
                  <p className="text-xs text-foreground/70 font-medium">Disponible al instante</p>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pb-4 px-5 space-y-4 relative z-10">
            <div className="bg-gradient-to-br from-interaction/12 to-interaction/5 rounded-lg p-4 text-center border border-interaction/20 py-3">
              <p className="text-foreground/70 mb-2 font-semibold text-base">Monto Garantizado</p>
              <p className="font-bold text-[#07586E] mb-1 filter drop-shadow-lg text-4xl">{formatCurrency(salaryAdvanceAmount)}</p>
              
            </div>

            <Button
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold text-sm h-10 transition-all hover:shadow-md"
              onClick={() => handleProductClick("adelanto")}
            >
              Iniciar solicitud de adelanto
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="w-full text-[#07586E] hover:text-[#07586E] font-medium hover:bg-[#07586E]/10 h-8 text-base"
              onClick={() => handleShowBreakdown("adelanto")}
            >
              <Eye className="h-3.5 w-3.5 mr-1.5" />
              Conoce cómo calculamos el monto
            </Button>
          </CardContent>

          <CardFooter className="pt-0 px-5 relative z-10 pb-2">
          </CardFooter>
        </Card>

        
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
