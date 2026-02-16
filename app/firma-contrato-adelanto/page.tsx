"use client"

import type React from "react"
import { useState, useRef, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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
  Banknote,
  Percent,
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

function FirmaContratoAdelantoContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const amount = Number(searchParams.get("monto")) || 600
  const productType = "adelanto"
  const transactionFee = amount * 0.05 // 5% comisión por adelanto

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [pdfExpanded, setPdfExpanded] = useState(true)
  const [zoom, setZoom] = useState(100)
  const [detailsExpanded, setDetailsExpanded] = useState(false)

  // Cálculos para adelanto de sueldo
  const commission = amount * 0.05 // 5% comisión por adelanto
  const igv = commission * 0.18 // 18% del IGV sobre la comisión
  const netAmount = amount // El monto neto siempre es igual al monto solicitado

  // Fecha de descuento: próxima quincena
  const today = new Date()
  const nextPayday = new Date()
  if (today.getDate() <= 15) {
    nextPayday.setDate(15)
  } else {
    nextPayday.setMonth(nextPayday.getMonth() + 1)
    nextPayday.setDate(1)
  }
  const paymentDate = nextPayday.toLocaleDateString("es-PE", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
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
      router.push(`/verificacion-sms?monto=${amount}&plazo=1&tipo=${productType}&cuota=${amount}`)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-primary text-primary-foreground px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary/80 h-8 w-8"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <h1 className="font-semibold">Firma de Contrato</h1>
          </div>
        </div>
      </header>

      <main className="px-4 py-4 pb-32">
        {/* Card unificada de resumen */}
        <Card className="mb-4 border-primary/20">
          <CardHeader className="py-3 pb-2">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-foreground text-sm">Resumen de tu adelanto</h2>
              <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full font-medium">
                Adelanto de Salario
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {/* Monto solicitado destacado */}
            <div className="flex items-center justify-between p-2.5 bg-primary/5 rounded-lg">
              <div className="flex items-center gap-2">
                <Banknote className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">Monto a recibir</span>
              </div>
              <span className="font-bold text-primary text-lg">{formatCurrency(amount)}</span>
            </div>

            {/* Grid compacto 2x2 */}
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2 bg-secondary/30 rounded-lg">
                <Percent className="h-3 w-3 text-muted-foreground mx-auto mb-0.5" />
                <p className="text-[10px] text-muted-foreground">Comisión</p>
                <p className="font-semibold text-xs">{formatCurrency(commission)}</p>
              </div>
              <div className="p-2 bg-secondary/30 rounded-lg">
                <Calendar className="h-3 w-3 text-muted-foreground mx-auto mb-0.5" />
                <p className="text-[10px] text-muted-foreground">Descuento</p>
                <p className="font-semibold text-xs">Quincena</p>
              </div>
            </div>

            {/* Banco y cuenta inline */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 text-xs py-1.5 px-2 bg-secondary/20 rounded">
                <Building2 className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Banco:</span>
                <span className="font-medium">{mockUser.bankName}</span>
              </div>
              <div className="flex items-center gap-2 text-xs py-1.5 px-2 bg-secondary/20 rounded">
                <CreditCard className="h-3 w-3 text-muted-foreground" />
                <span className="font-medium truncate">{mockUser.accountNumber}</span>
              </div>
            </div>

            {/* Fecha de descuento destacada */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-amber-800">Descuento único en planilla</p>
                  <p className="text-xs text-amber-700 mt-0.5">{paymentDate}</p>
                  <p className="text-[10px] text-amber-600 mt-1">
                    El monto total de {formatCurrency(amount)} será descontado en tu próxima quincena.
                  </p>
                </div>
              </div>
            </div>

            {/* Detalles expandibles */}
            <div className="border-t pt-3">
              <button
                onClick={() => setDetailsExpanded(!detailsExpanded)}
                className="flex items-center justify-between w-full"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-medium">Ver detalle del adelanto</span>
                </div>
                {detailsExpanded ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>

              {detailsExpanded && (
                <div className="mt-3 space-y-2 animate-in slide-in-from-top-1 duration-150">
                  <div className="flex justify-between text-xs py-1.5 px-2 bg-secondary/10 rounded">
                    <span className="text-muted-foreground">Monto solicitado</span>
                    <span className="font-medium">{formatCurrency(amount)}</span>
                  </div>
                  <div className="flex justify-between text-xs py-1.5 px-2 bg-secondary/10 rounded">
                    <span className="text-muted-foreground">Comisión de transacción (5%)</span>
                    <span className="font-medium text-amber-600">+{formatCurrency(commission)}</span>
                  </div>
                  <div className="flex justify-between text-xs py-1.5 px-2 bg-secondary/10 rounded">
                    <span className="text-muted-foreground">IGV 18%</span>
                    <span className="font-medium text-amber-600">+{formatCurrency(igv)}</span>
                  </div>
                  <div className="flex justify-between text-xs py-1.5 px-2 bg-primary/10 rounded">
                    <span className="font-medium">Monto neto a recibir</span>
                    <span className="font-bold text-primary">{formatCurrency(netAmount)}</span>
                  </div>
                  <div className="flex justify-between text-xs py-1.5 px-2 bg-amber-50 rounded border border-amber-200">
                    <span className="text-amber-700">Descuento en planilla</span>
                    <span className="font-bold text-amber-700">{formatCurrency(amount + commission + igv)}</span>
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-2">
                    * Sin intereses. Solo aplica comisión por transacción.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* PDF Contract Viewer */}
        <Card className="mb-4 border-0 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
          <CardHeader className="py-2.5 bg-gradient-to-r from-attention-light/30 to-white">
            <button onClick={() => setPdfExpanded(!pdfExpanded)} className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-attention" />
                <h2 className="font-semibold text-foreground text-sm">Contrato de Adelanto</h2>
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
                productType="adelanto"
                userName={mockUser.name}
                amount={amount}
                term={1}
                monthlyPayment={amount + commission + igv}
                TEA={0}
                bankName={mockUser.bankName}
                accountNumber={mockUser.accountNumber}
                commission={commission}
                igv={igv}
                quotas={[
                  {
                    number: 1,
                    date: nextPayday.toLocaleDateString("es-PE", { day: "2-digit", month: "short" }),
                    amount: amount + commission + igv,
                  },
                ]}
                currentDate={currentDate}
              />
            </CardContent>
          )}
        </Card>

        {/* Signature Pad */}
        <Card className="mb-4">
          <CardHeader className="py-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PenTool className="h-4 w-4 text-primary" />
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
              className={`relative border-2 border-dashed rounded-lg ${hasSignature ? "border-primary" : "border-muted-foreground/30"}`}
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
                  <p className="text-xs text-muted-foreground">Firma aquí</p>
                </div>
              )}
            </div>
            {hasSignature && (
              <div className="flex items-center gap-1 mt-2 text-primary">
                <CheckCircle className="h-3 w-3" />
                <span className="text-xs">Firma registrada</span>
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
            <button onClick={() => setShowTermsModal(true)} className="text-primary underline font-medium">
              términos y condiciones
            </button>{" "}
            del adelanto de salario.
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
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Términos y Condiciones - Adelanto de Salario</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted-foreground">
            <section>
              <h4 className="font-semibold text-foreground mb-2">1. Definición del Servicio</h4>
              <p>
                El adelanto de salario es un beneficio que permite al colaborador acceder de forma anticipada a una
                porción de su remuneración devengada, sin generar intereses.
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-foreground mb-2">2. Comisión por Transacción</h4>
              <p>
                Se aplica una comisión del 5% sobre el monto adelantado para cubrir los gastos administrativos de la
                operación. Esta comisión se descuenta del monto a depositar.
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-foreground mb-2">3. Autorización de Descuento</h4>
              <p>
                El colaborador autoriza expresamente el descuento del monto total del adelanto en su próxima
                remuneración quincenal. Esta autorización es irrevocable una vez firmado el contrato.
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-foreground mb-2">4. Límites y Restricciones</h4>
              <p>
                El monto máximo del adelanto está sujeto a los límites establecidos por la política de la empresa y las
                restricciones legales vigentes sobre descuentos en planilla.
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-foreground mb-2">5. Cese Laboral</h4>
              <p>
                En caso de término de la relación laboral antes de la fecha de descuento, el saldo pendiente será
                descontado de la liquidación de beneficios sociales del colaborador.
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-foreground mb-2">6. Protección de Datos</h4>
              <p>
                La información proporcionada será tratada conforme a la Ley de Protección de Datos Personales y
                utilizada únicamente para los fines del presente servicio.
              </p>
            </section>
          </div>
        </DialogContent>
      </Dialog>

      <AppFooter />
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  )
}

export default function FirmaContratoAdelantoPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <FirmaContratoAdelantoContent />
    </Suspense>
  )
}
