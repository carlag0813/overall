"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
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
} from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ContractSignatureProps {
  amount: number
  term: number
  productType: "adelanto" | "prestamo"
  monthlyPayment: number
  userName: string
  onBack: () => void
  onConfirm: () => void
}

export function ContractSignature({
  amount,
  term,
  productType,
  monthlyPayment,
  userName,
  onBack,
  onConfirm,
}: ContractSignatureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [pdfExpanded, setPdfExpanded] = useState(true)
  const [zoom, setZoom] = useState(100)

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

  // Canvas setup
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
      onConfirm()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-primary text-primary-foreground px-4 py-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary-foreground/10">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-semibold">Firma de Contrato</h1>
              <p className="text-xs text-primary-foreground/70">Revisa y firma tu solicitud</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 pb-36">
        {/* Contract Summary Badge */}
        <div className="mb-4 flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
          <div>
            <p className="text-xs text-muted-foreground">
              {productType === "prestamo" ? "Préstamo Personal" : "Adelanto de Salario"}
            </p>
            <p className="font-bold text-primary text-lg">{formatCurrency(amount)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Cuota mensual</p>
            <p className="font-semibold text-foreground">{formatCurrency(monthlyPayment)}</p>
          </div>
        </div>

        {/* PDF Contract Viewer */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <button onClick={() => setPdfExpanded(!pdfExpanded)} className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <h2 className="font-semibold text-foreground">
                  Contrato de {productType === "prestamo" ? "Préstamo" : "Adelanto"}
                </h2>
              </div>
              {pdfExpanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </CardHeader>

          {pdfExpanded && (
            <CardContent className="space-y-4">
              {/* Zoom Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-transparent"
                    onClick={() => setZoom(Math.max(80, zoom - 10))}
                  >
                    <ZoomOut className="h-3 w-3" />
                  </Button>
                  <span className="text-xs text-muted-foreground w-12 text-center">{zoom}%</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-transparent"
                    onClick={() => setZoom(Math.min(150, zoom + 10))}
                  >
                    <ZoomIn className="h-3 w-3" />
                  </Button>
                </div>
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  <Download className="h-3 w-3" />
                  Descargar
                </Button>
              </div>

              {/* PDF Content (Lorem Ipsum) */}
              <div
                className="bg-white border rounded-lg p-6 max-h-[400px] overflow-y-auto shadow-inner"
                style={{ fontSize: `${zoom}%` }}
              >
                <div className="text-center mb-6">
                  <h3 className="font-bold text-lg text-gray-900">
                    CONTRATO DE {productType === "prestamo" ? "PRÉSTAMO PERSONAL" : "ADELANTO DE SALARIO"}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    N° CONT-2024-
                    {Math.floor(Math.random() * 10000)
                      .toString()
                      .padStart(4, "0")}
                  </p>
                </div>

                <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
                  <p>
                    Conste por el presente documento, el contrato de{" "}
                    {productType === "prestamo" ? "préstamo personal" : "adelanto de salario"} que celebran de una parte{" "}
                    <strong>OVERALL S.A.C.</strong>, con RUC N° 20123456789, debidamente representada por su Gerente
                    General, a quien en adelante se le denominará "LA EMPRESA"; y de otra parte el(la) Sr(a).{" "}
                    <strong>{userName}</strong>, identificado(a) con DNI N° **********, a quien en adelante se le
                    denominará "EL TRABAJADOR".
                  </p>

                  <p className="font-semibold text-gray-900">PRIMERA: ANTECEDENTES</p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                    cillum dolore eu fugiat nulla pariatur.
                  </p>

                  <p className="font-semibold text-gray-900">SEGUNDA: OBJETO DEL CONTRATO</p>
                  <p>
                    Por el presente contrato, LA EMPRESA otorga a EL TRABAJADOR un{" "}
                    {productType === "prestamo" ? "préstamo personal" : "adelanto de salario"} por el monto de{" "}
                    <strong>{formatCurrency(amount)}</strong>, el cual será desembolsado en la cuenta bancaria
                    registrada por EL TRABAJADOR.
                  </p>
                  <p>
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
                    est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
                    laudantium.
                  </p>

                  <p className="font-semibold text-gray-900">TERCERA: PLAZO Y FORMA DE PAGO</p>
                  <p>
                    El plazo de devolución del presente {productType === "prestamo" ? "préstamo" : "adelanto"} es de{" "}
                    <strong>
                      {term} {term === 1 ? "mes" : "meses"}
                    </strong>
                    , mediante descuento automático de planilla con una cuota mensual de{" "}
                    <strong>{formatCurrency(monthlyPayment)}</strong>.
                  </p>
                  <p>
                    Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur
                    magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum
                    quia dolor sit amet.
                  </p>

                  <p className="font-semibold text-gray-900">CUARTA: INTERESES Y COMISIONES</p>
                  <p>
                    {productType === "prestamo"
                      ? "El préstamo devengará un interés mensual del 1% (Tasa Efectiva Anual del 12%), calculado sobre el saldo deudor. Adicionalmente, se aplicará una comisión única de transacción del 2% sobre el monto del préstamo."
                      : "El adelanto de salario no genera intereses. Se aplicará una comisión administrativa mínima por la gestión del desembolso."}
                  </p>
                  <p>
                    Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut
                    aliquid ex ea commodi consequatur. Quis autem vel eum iure reprehenderit qui in ea voluptate velit
                    esse quam nihil molestiae consequatur.
                  </p>

                  <p className="font-semibold text-gray-900">QUINTA: INCUMPLIMIENTO</p>
                  <p>
                    At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum
                    deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non
                    provident.
                  </p>
                  <p>
                    Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et
                    harum quidem rerum facilis est et expedita distinctio.
                  </p>

                  <p className="font-semibold text-gray-900">SEXTA: TERMINACIÓN ANTICIPADA</p>
                  <p>
                    Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod
                    maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.
                  </p>

                  <p className="font-semibold text-gray-900">SÉPTIMA: PROTECCIÓN DE DATOS</p>
                  <p>
                    Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et
                    voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente
                    delectus.
                  </p>

                  <p className="font-semibold text-gray-900">OCTAVA: DISPOSICIONES FINALES</p>
                  <p>
                    Ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores
                    repellat. Las partes se someten a la jurisdicción de los jueces y tribunales de Lima para resolver
                    cualquier controversia derivada del presente contrato.
                  </p>

                  <div className="mt-8 pt-4 border-t">
                    <p className="text-center text-gray-500">Lima, {currentDate}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Digital Signature Section */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PenTool className="h-4 w-4 text-primary" />
                <h2 className="font-semibold text-foreground">Tu firma manuscrita</h2>
              </div>
              {hasSignature && (
                <Button variant="ghost" size="sm" className="text-xs text-destructive gap-1" onClick={clearSignature}>
                  <Trash2 className="h-3 w-3" />
                  Borrar
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Dibuja tu firma en el recuadro de abajo usando el dedo o mouse
            </p>
          </CardHeader>
          <CardContent>
            <div className="relative border-2 border-dashed border-primary/30 rounded-lg bg-white overflow-hidden">
              <canvas
                ref={canvasRef}
                width={600}
                height={200}
                className="w-full h-[150px] touch-none cursor-crosshair"
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
                  <p className="text-muted-foreground/50 text-sm">Firma aquí</p>
                </div>
              )}
            </div>

            {/* Signature validation indicator */}
            <div className="mt-3 flex items-center gap-2">
              {hasSignature ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-green-600">Firma registrada correctamente</span>
                </>
              ) : (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
                  <span className="text-xs text-muted-foreground">Pendiente de firma</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Legal Checkbox */}
        <div className="flex items-start gap-3 p-4 bg-secondary/20 rounded-lg">
          <Checkbox
            id="contract-terms"
            checked={acceptedTerms}
            onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
          />
          <Label htmlFor="contract-terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
            Autorizo el descuento por planilla y acepto los{" "}
            <button
              type="button"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
              onClick={() => setShowTermsModal(true)}
            >
              términos y condiciones
            </button>
          </Label>
        </div>
      </main>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t shadow-lg">
        <Button
          className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90"
          disabled={!hasSignature || !acceptedTerms}
          onClick={handleConfirm}
        >
          {!hasSignature ? (
            "Dibuja tu firma para continuar"
          ) : !acceptedTerms ? (
            "Acepta los términos para continuar"
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Firmar y solicitar
            </>
          )}
        </Button>
        <p className="text-[10px] text-muted-foreground text-center mt-2">
          Al confirmar, tu solicitud será procesada inmediatamente
        </p>
      </div>

      {/* Terms Modal */}
      <Dialog open={showTermsModal} onOpenChange={setShowTermsModal}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Términos y Condiciones
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <section>
              <h4 className="font-semibold text-foreground mb-2">1. Autorización de Descuento</h4>
              <p>
                Al aceptar estos términos, autorizo expresamente a Overall a descontar de mi remuneración mensual las
                cuotas correspondientes al préstamo o adelanto solicitado.
              </p>
            </section>
            <section>
              <h4 className="font-semibold text-foreground mb-2">2. Validez de Firma Digital</h4>
              <p>
                La firma manuscrita digital tiene la misma validez legal que una firma física, conforme a la normativa
                vigente de firmas electrónicas.
              </p>
            </section>
            <section>
              <h4 className="font-semibold text-foreground mb-2">3. Protección de Datos</h4>
              <p>
                La información y firma proporcionada será tratada conforme a la Ley de Protección de Datos Personales.
              </p>
            </section>
          </div>
          <Button className="w-full mt-4" onClick={() => setShowTermsModal(false)}>
            Entendido
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
