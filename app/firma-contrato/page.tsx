"use client"

import type React from "react"
import { useState, useRef, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useScrollToTop } from "@/hooks/use-scroll-to-top"
import { AppFooter } from "@/components/app-footer"
import {
  ArrowLeft,
  FileText,
  PenTool,
  Trash2,
  CheckCircle,
  Download,
  ZoomIn,
  ZoomOut,
  ChevronDown,
  ChevronUp,
  Building2,
  CreditCard,
  Calendar,
  Percent,
  Banknote,
} from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ContractPDFViewer } from "@/components/contract-pdf-viewer"

const mockUser = {
  name: "Carlos Mendoza",
  bankName: "BCP",
  accountNumber: "************7845",
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
}

function FirmaContratoContent() {
  useScrollToTop()
  const router = useRouter()
  const searchParams = useSearchParams() // Declared searchParams here

  const amount = Number(searchParams.get("monto")) || 1000
  const term = Number(searchParams.get("plazo")) || 6
  const productType = (searchParams.get("tipo") as "adelanto" | "prestamo") || "prestamo"
  const currentStep = Number(searchParams.get("step")) || 2
  const interestRate = productType === "prestamo" ? 0.1268 : 0.0617; // Declared interestRate here

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [pdfExpanded, setPdfExpanded] = useState(true)
  const [zoom, setZoom] = useState(100)
  const [showExitConfirmation, setShowExitConfirmation] = useState(false)
  const [scheduleExpanded, setScheduleExpanded] = useState(false)

  const handleBackClick = () => {
    setShowExitConfirmation(true)
  }
  const TEA = productType === "prestamo" ? 12.68 : 6.17
  const totalInterest = amount * interestRate * term
  const igvOnInterest = totalInterest * 0.18
  const commission = amount * 0.02
  const igvOnCommission = commission * 0.18
  const totalToPay = amount + totalInterest + igvOnInterest + commission + igvOnCommission
  const netAmount = amount // El monto neto siempre es igual al monto solicitado

  const generateAmortizationSchedule = () => {
    const schedule = []
    let balance = amount
    const monthlyInterestRate = interestRate

    for (let i = 1; i <= term; i++) {
      const interest = balance * monthlyInterestRate
      const igv = interest * 0.18
      const principal = totalToPay / term - interest - igv
      balance = Math.max(0, balance - principal)

      const dueDate = new Date()
      dueDate.setMonth(dueDate.getMonth() + i)

      schedule.push({
        month: i,
        dueDate: dueDate.toLocaleDateString("es-PE", { day: "2-digit", month: "short" }),
        principal: principal,
        interest: interest,
        igv: igv,
        payment: totalToPay / term,
        balance: balance,
      })
    }
    return schedule
  }

  const amortizationSchedule = generateAmortizationSchedule()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
    }).format(value)
  }

  const formatCompact = (value: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const currentDate = new Date().toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.strokeStyle = "#1e3a5f"
        ctx.lineWidth = 2
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
      }
    }
  }, [])

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    if ("touches" in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      }
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx) return

    setIsDrawing(true)
    const { x, y } = getCoordinates(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (!isDrawing) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx) return

    const { x, y } = getCoordinates(e)
    ctx.lineTo(x, y)
    ctx.stroke()
    setHasSignature(true)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx || !canvas) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasSignature(false)
  }

  const handleConfirm = () => {
    if (hasSignature && acceptedTerms) {
      router.push(`/verificacion-sms?monto=${amount}&plazo=${term}&tipo=${productType}&cuota=${totalToPay / term}&step=3`)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-to-r from-primary/90 to-primary px-4 py-3 text-primary-foreground sticky top-0 z-10">
        <div className="flex items-center justify-between mb-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-white/20 h-8 w-8"
            onClick={handleBackClick}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-base font-bold flex-1 text-center">
            {productType === "prestamo" ? "Préstamo Personal" : "Adelanto de Salario"}
          </h1>
          <div className="w-10" />
        </div>

        {/* Stepper dinámico - colores según progreso */}
        <div className="flex items-center justify-between text-[11px] font-medium px-1">
          {/* Paso 1: Simulación */}
          <div className="flex flex-col items-center gap-0.5">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 shadow-md font-bold transition-all duration-300 ${
              currentStep >= 1
                ? 'bg-success text-white'
                : 'bg-white/30 text-white/70'
            }`}>
              {currentStep > 1 ? '✓' : '1'}
            </div>
            <span className={`text-[9px] font-semibold transition-colors duration-300 ${
              currentStep >= 1 ? 'text-white' : 'text-white/70'
            }`}>Simulación</span>
          </div>
          <div className={`flex-1 h-0.5 mx-1.5 transition-all duration-300 ${
            currentStep > 1 ? 'bg-success' : 'bg-white/30'
          }`} />
          
          {/* Paso 2: Firma */}
          <div className="flex flex-col items-center gap-0.5">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 shadow-md font-bold transition-all duration-300 ${
              currentStep >= 2
                ? 'bg-success text-white'
                : currentStep === 2 ? 'bg-primary/60 text-white' : 'bg-white/30 text-white/70'
            }`}>
              {currentStep > 2 ? '✓' : '2'}
            </div>
            <span className={`text-[9px] font-semibold transition-colors duration-300 ${
              currentStep >= 2 ? 'text-white' : 'text-white/70'
            }`}>Firma</span>
          </div>
          <div className={`flex-1 h-0.5 mx-1.5 transition-all duration-300 ${
            currentStep > 2 ? 'bg-success' : 'bg-white/30'
          }`} />
          
          {/* Paso 3: Seguridad */}
          <div className="flex flex-col items-center gap-0.5">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 shadow-md font-bold transition-all duration-300 ${
              currentStep >= 3
                ? 'bg-success text-white'
                : currentStep === 3 ? 'bg-primary/60 text-white' : 'bg-white/30 text-white/70'
            }`}>
              {currentStep > 3 ? '✓' : '3'}
            </div>
            <span className={`text-[9px] font-semibold transition-colors duration-300 ${
              currentStep >= 3 ? 'text-white' : 'text-white/70'
            }`}>Seguridad</span>
          </div>
          <div className={`flex-1 h-0.5 mx-1.5 transition-all duration-300 ${
            currentStep > 3 ? 'bg-success' : 'bg-white/30'
          }`} />
          
          {/* Paso 4: Finalizado */}
          <div className="flex flex-col items-center gap-0.5">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 shadow-md font-bold transition-all duration-300 ${
              currentStep >= 4
                ? 'bg-success text-white'
                : currentStep === 4 ? 'bg-primary/60 text-white' : 'bg-white/30 text-white/70'
            }`}>
              {currentStep > 4 ? '✓' : '4'}
            </div>
            <span className={`text-[9px] font-semibold transition-colors duration-300 ${
              currentStep >= 4 ? 'text-white' : 'text-white/70'
            }`}>Finalizado</span>
          </div>
        </div>
      </header>

      <main className="px-4 py-4 pb-32">
        <Card className="mb-4 border-0 shadow-md border-t-4 border-t-attention bg-gradient-to-br from-attention-light/30 to-white animate-in fade-in slide-in-from-top-4 duration-500 delay-150">
          <CardHeader className="py-3 pb-2">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-foreground text-sm">Resumen de tu solicitud</h2>
              <span className="text-xs bg-attention/15 text-attention px-2 py-0.5 rounded-full font-medium">
                Préstamo
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {/* Monto destacado */}
            <div className="flex items-center justify-between p-2.5 bg-attention-light/50 rounded-lg border border-attention/30">
              <div className="flex items-center gap-2">
                <Banknote className="h-4 w-4 text-attention" />
                <span className="text-xs text-muted-foreground">Monto que recibirás</span>
              </div>
              <span className="font-bold text-attention">{formatCurrency(netAmount)}</span>
            </div>

            {/* Grid compacto 2 columnas - Plazo solo para Préstamo */}
            {productType === "prestamo" && (
            <div className="w-full p-3 bg-attention-light/60 rounded-lg border border-attention/40 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-attention" />
                <p className="text-xs text-foreground/70">Plazo</p>
              </div>
              <p className="font-semibold text-sm text-attention">{term} meses</p>
            </div>
            )}

            {/* Banco + Cuenta depósito combinados - Información de nómina */}
            <div className="p-3 bg-attention-light/30 rounded-lg border border-attention/40 space-y-2">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-attention" />
                <p className="text-xs text-foreground/70">Información de depósito (cuenta nómina)</p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{mockUser.bankName}</span>
                <span className="font-semibold text-attention">{mockUser.accountNumber}</span>
              </div>
            </div>

            <div className="border-t pt-3 space-y-2">
              {/* Información sobre cronograma por correo - Compacto - Solo para Préstamo */}
              {productType === "prestamo" && (
              <div>
                <button 
                  onClick={() => setScheduleExpanded(!scheduleExpanded)}
                  className="w-full bg-attention-light/30 border border-attention/30 rounded-lg p-3 flex items-center justify-between hover:bg-attention-light/40 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-attention flex-shrink-0" />
                    <p className="text-xs font-semibold text-foreground">Cronograma de cuotas</p>
                  </div>
                  {scheduleExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>

                {scheduleExpanded && (
                  <div className="mt-2 bg-white border border-attention/20 rounded-lg p-3 max-h-96 overflow-y-auto">
                    <div className="space-y-2">
                      {amortizationSchedule.map((payment, index) => (
                        <div key={index} className="flex items-center justify-between text-xs pb-2 border-b border-attention/10 last:border-b-0">
                          <div className="flex-1">
                            <p className="font-semibold text-foreground">Cuota {payment.month}</p>
                            <p className="text-muted-foreground text-[10px]">{payment.dueDate}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-foreground">{formatCurrency(payment.payment)}</p>
                            <p className="text-muted-foreground text-[10px]">Saldo: {formatCurrency(payment.balance)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* PDF Contract Viewer */}
        <Card className="mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 border-0">
          <CardHeader className="py-2.5 bg-gradient-to-r from-attention-light/30 to-white">
            <button onClick={() => setPdfExpanded(!pdfExpanded)} className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-attention" />
                <h2 className="font-semibold text-foreground text-sm">Contrato de {productType === "prestamo" ? "Préstamo" : "Adelanto"}</h2>
              </div>
              {pdfExpanded ? (
                <ChevronUp className="h-4 w-4 text-attention" />
              ) : (
                <ChevronDown className="h-4 w-4 text-attention" />
              )}
            </button>
          </CardHeader>

          {pdfExpanded && (
            <CardContent className="pt-4">
              <ContractPDFViewer
                productType={productType}
                userName={mockUser.name}
                amount={amount}
                term={term}
                monthlyPayment={totalToPay / term}
                TEA={TEA}
                bankName={mockUser.bankName}
                accountNumber={mockUser.accountNumber}
                commission={commission}
                igv={igvOnCommission}
                quotas={amortizationSchedule.map((s) => ({
                  number: s.month,
                  date: s.dueDate,
                  amount: s.payment,
                }))}
                currentDate={currentDate}
              />
            </CardContent>
          )}
        </Card>

        {/* Signature Pad */}
        <Card className="mb-4 border-0 shadow-md border-t-4 border-t-premium bg-gradient-to-br from-premium-light/20 to-white">
          <CardHeader className="py-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PenTool className="h-4 w-4 text-premium" />
                <h2 className="font-semibold text-foreground text-sm">Tu firma</h2>
              </div>
              {hasSignature && (
                <Button variant="ghost" size="sm" onClick={clearSignature} className="text-destructive h-7 text-xs">
                  <Trash2 className="h-3 w-3 mr-1" />
                  Borrar
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div
              className={`relative border-2 border-dashed rounded-lg transition-colors ${hasSignature ? "border-premium bg-premium-light/20" : "border-premium/40 bg-premium-light/10"}`}
            >
              <canvas
                ref={canvasRef}
                width={500}
                height={120}
                className="w-full h-24 touch-none cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
              {!hasSignature && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <p className="text-xs text-premium/70 font-medium">Firma aquí</p>
                </div>
              )}
            </div>
            {hasSignature && (
              <div className="flex items-center gap-1 mt-2 text-premium">
                <CheckCircle className="h-3 w-3" />
                <span className="text-xs font-medium">Firma registrada</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Terms Checkbox */}
        <div className="flex items-start space-x-2 mb-4">
          <Checkbox
            id="terms"
            checked={acceptedTerms}
            onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
            className="mt-0.5"
          />
          <Label htmlFor="terms" className="text-xs text-muted-foreground leading-tight">
            Acepto y apruebo los{" "}
            <button onClick={() => setShowTermsModal(true)} className="text-primary underline underline-offset-2">
              términos y condiciones
            </button>
          </Label>
        </div>
      </main>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t-2 border-t-primary shadow-2xl">
        <Button
          className="w-full font-semibold h-12 bg-primary hover:bg-primary/90 text-white transition-all hover:scale-105 active:scale-95 duration-200 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
          size="lg"
          disabled={!hasSignature || !acceptedTerms}
          onClick={handleConfirm}
        >
          {hasSignature && acceptedTerms ? "Firmar e ingresar código seguridad" : "Dibuja tu firma para continuar"}
        </Button>
      </div>

      {/* Terms Modal */}
      <Dialog open={showTermsModal} onOpenChange={setShowTermsModal}>
        <DialogContent className="max-w-sm max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Términos y Condiciones</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              <strong>1. OBJETO:</strong> El presente documento establece los términos y condiciones para el
              otorgamiento de préstamos personales y adelantos de salario a colaboradores de OVERALL S.A.C.
            </p>
            <p>
              <strong>2. AUTORIZACIÓN DE DESCUENTO:</strong> El colaborador autoriza expresamente el descuento por
              planilla de las cuotas acordadas, incluyendo intereses e IGV aplicable (18% sobre intereses).
            </p>
            <p>
              <strong>3. LIQUIDACIÓN DE BENEFICIOS:</strong> En caso de término de la relación laboral, el saldo
              pendiente será descontado de la liquidación de beneficios sociales del colaborador.
            </p>
            <p>
              <strong>4. MORA:</strong> El incumplimiento en el pago de las cuotas generará intereses moratorios
              conforme a la tasa máxima permitida por el BCRP.
            </p>
            <p>
              <strong>5. DATOS PERSONALES:</strong> El colaborador autoriza el tratamiento de sus datos personales
              conforme a la Ley N° 29733 - Ley de Protección de Datos Personales.
            </p>
          </div>
          <Button onClick={() => setShowTermsModal(false)} className="w-full mt-4">
            Entendido
          </Button>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación al salir */}
      <Dialog open={showExitConfirmation} onOpenChange={setShowExitConfirmation}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">¿Abandonar contrato?</DialogTitle>
          </DialogHeader>
          <p className="text-foreground/75 text-sm leading-relaxed">
            ¿Estás seguro de que no deseas continuar con tu solicitud en estos momentos? Deberás volver a comenzar el proceso.
          </p>
          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              className="flex-1 border-2 border-primary/30 hover:bg-primary/5 text-primary bg-transparent"
              onClick={() => setShowExitConfirmation(false)}
            >
              Continuar
            </Button>
            <Button
              className="flex-1 bg-destructive hover:bg-destructive/90 text-white"
              onClick={() => {
                setShowExitConfirmation(false)
                router.push('/')
              }}
            >
              Abandonar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AppFooter />
    </div>
  )
}

export default function FirmaContratoPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <FirmaContratoContent />
    </Suspense>
  )
}
