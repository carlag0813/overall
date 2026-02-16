"use client"

import type React from "react"

import { useState, useMemo } from "react"
import {
  ArrowLeft,
  Briefcase,
  Calculator,
  CreditCard,
  Info,
  Lock,
  AlertTriangle,
  FileText,
  X,
  CheckCircle2,
} from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface LoanSimulatorProps {
  productType: "adelanto" | "prestamo"
  netSalary: number
  hasActiveLoan: boolean
  recentRequestCount: number
  bankAccount: string
  userName: string
  onBack: () => void
  onSubmit: (data: LoanRequestData) => void
}

interface LoanRequestData {
  amount: number
  term: number
  productType: "adelanto" | "prestamo"
  monthlyPayment: number
}

export function LoanSimulator({
  productType,
  netSalary,
  hasActiveLoan,
  recentRequestCount,
  bankAccount,
  userName,
  onBack,
  onSubmit,
}: LoanSimulatorProps) {
  const baseMaxPercentage = productType === "adelanto" ? 0.3 : 0.5
  const frequencyPenalty = recentRequestCount > 3 ? 0.2 : 0
  const effectiveMaxPercentage = Math.max(0.1, baseMaxPercentage - frequencyPenalty)

  const maxAmountByPercentage = netSalary * effectiveMaxPercentage
  const maxAmount = Math.min(maxAmountByPercentage, netSalary * 0.5)

  const [amount, setAmount] = useState(800)
  const [term, setTerm] = useState(productType === "prestamo" ? 3 : 1)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [scrolledToSummary, setScrolledToSummary] = useState(false)

  const calculations = useMemo(() => {
    const monthlyInterestRate = productType === "adelanto" ? 0 : 0.01
    const interest = productType === "adelanto" ? 0 : amount * monthlyInterestRate
    const commission = amount * 0.015 // Comisión 1.5% del monto
    const igv = amount * 0.18 // IGV 18% del monto
    const totalInterest = productType === "adelanto" ? 0 : amount * monthlyInterestRate * term
    const totalToPay = amount + interest + commission + igv
    const monthlyPayment = totalToPay / term
    const netAmount = amount // El monto neto siempre es igual al monto solicitado

    return {
      monthlyInterestRate: monthlyInterestRate * 100,
      interest,
      totalInterest,
      commission,
      igv,
      totalToPay,
      monthlyPayment,
      netAmount,
    }
  }, [amount, term, productType])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const handleAmountChange = (value: number[]) => {
    setAmount(value[0])
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Math.max(0, Number(e.target.value)), maxAmount)
    setAmount(Math.round(value))
  }

  const handleSubmit = () => {
    if (acceptedTerms && !hasActiveLoan) {
      onSubmit({
        amount,
        term,
        productType,
        monthlyPayment: calculations.monthlyPayment,
      })
    }
  }

  const isBlocked = hasActiveLoan

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
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-semibold">
                {productType === "prestamo" ? "Préstamo Personal" : "Adelanto de Salario"}
              </h1>
              <p className="text-xs text-primary-foreground/70">Simulador de cuotas</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 pb-32" onScroll={(e) => {
        const target = e.currentTarget
        const summaryElement = target.querySelector('[data-summary="true"]')
        if (summaryElement) {
          const rect = summaryElement.getBoundingClientRect()
          setScrolledToSummary(rect.top < window.innerHeight * 0.8)
        }
      }}>
        {/* Blocked State */}
        {isBlocked && (
          <Card className="mb-6 border-destructive/30 bg-destructive/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-destructive/10">
                  <Lock className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <h3 className="font-semibold text-destructive mb-1">Simulación no disponible</h3>
                  <p className="text-sm text-muted-foreground">
                    Debes culminar tu préstamo anterior para solicitar uno nuevo.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Frequency Restriction Warning */}
        {recentRequestCount > 3 && !isBlocked && (
          <Card className="mb-6 border-amber-500/30 bg-amber-500/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-amber-500/10">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-medium text-amber-700 mb-1">Límite reducido temporalmente</h3>
                  <p className="text-xs text-muted-foreground">
                    Debido a solicitudes recientes, tu límite se ha reducido del {Math.round(baseMaxPercentage * 100)}%
                    al {Math.round(effectiveMaxPercentage * 100)}% de tu sueldo neto.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Amount Slider Section */}
        <section className={`mb-6 ${isBlocked ? "opacity-50 pointer-events-none" : ""}`}>
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-primary" />
                  <h2 className="font-semibold text-foreground">Monto a solicitar</h2>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[280px]">
                      <p className="text-xs leading-relaxed">
                        El monto máximo es {Math.round(effectiveMaxPercentage * 100)}% de tu sueldo neto (
                        {formatCurrency(netSalary)}) validado por RRHH.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Amount Display */}
              <div className="text-center">
                <div className="relative inline-block">
                  <span className="text-sm text-muted-foreground absolute -left-8 top-1/2 -translate-y-1/2">S/</span>
                  <Input
                    type="number"
                    value={amount}
                    onChange={handleInputChange}
                    className="text-4xl font-bold text-center border-0 border-b-2 border-primary rounded-none bg-transparent w-48 h-auto py-2 focus-visible:ring-0"
                    min={100}
                    max={maxAmount}
                  />
                </div>
              </div>

              {/* Slider */}
              <div className="space-y-3">
                <Slider
                  value={[amount]}
                  onValueChange={handleAmountChange}
                  max={maxAmount}
                  min={100}
                  step={50}
                  className="w-full"
                  rangeColor="bg-premium"
                  thumbBorderColor="ring-premium"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatCurrency(100)}</span>
                  <span className="text-primary font-medium">Máx: {formatCurrency(maxAmount)}</span>
                </div>
              </div>

              {/* Term Slider - Only for Préstamo */}
              {productType === "prestamo" && (
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <span>Plazo de pago</span>
                    </Label>
                    <span className="text-lg font-bold text-interaction">{term} {term === 1 ? "mes" : "meses"}</span>
                  </div>
                  <Slider
                    value={[term]}
                    onValueChange={(v) => setTerm(v[0])}
                    max={12}
                    min={1}
                    step={1}
                    className="w-full"
                    rangeColor="bg-interaction"
                    thumbBorderColor="ring-interaction"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1 mes</span>
                    <span className="text-interaction font-medium">12 meses</span>
                  </div>
                </div>
              )}

              <p className="text-[10px] text-muted-foreground text-center leading-relaxed pt-2 border-t">
                El monto disponible se calcula sobre tu sueldo neto validado por RRHH y no puede exceder el{" "}
                {productType === "prestamo" ? "50%" : "30%"} de dicho monto.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Cost Breakdown Card */}
        <section className={`mb-6 ${isBlocked ? "opacity-50 pointer-events-none" : ""} transition-all duration-700 ${scrolledToSummary ? "opacity-100" : "opacity-0"}`} data-summary="true">
          <Card className="bg-secondary/30">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <h2 className="font-semibold text-foreground">Resumen de tu solicitud</h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Solicitarás (monto a recibir)</span>
                  <span className="font-bold text-primary text-base">{formatCurrency(amount)}</span>
                </div>

                {productType === "prestamo" && (
                  <>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-muted-foreground">+ Interés</span>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          {calculations.monthlyInterestRate}%
                        </Badge>
                      </div>
                      <span className="text-sm font-medium">{formatCurrency(calculations.interest)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">+ Comisión (1.5%)</span>
                      <span className="text-sm font-medium">{formatCurrency(calculations.commission)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">+ IGV (18%) <span className="text-[10px] text-muted-foreground/70">(Impuesto al gobierno)</span></span>
                      <span className="text-sm font-medium">{formatCurrency(calculations.igv)}</span>
                    </div>
                  </>
                )}

                {productType === "adelanto" && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">+ Comisión (1.5%)</span>
                      <span className="text-sm font-medium">{formatCurrency(calculations.commission)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">+ IGV (18%) <span className="text-[10px] text-muted-foreground/70">(Impuesto al gobierno)</span></span>
                      <span className="text-sm font-medium">{formatCurrency(calculations.igv)}</span>
                    </div>
                  </>
                )}

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-foreground">Total a descontar</span>
                  <span className="text-lg font-bold text-primary">{formatCurrency(calculations.totalToPay)}</span>
                </div>

                {productType === "prestamo" && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Cuota mensual</span>
                    <span className="font-semibold text-accent">{formatCurrency(calculations.monthlyPayment)}</span>
                  </div>
                )}
              </div>

              {/* Deposit Account */}
              <div className="mt-4 p-3 bg-background rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <CreditCard className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Cuenta de depósito</p>
                    <p className="text-sm font-medium">{bankAccount}</p>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Legal Checkbox */}
        <section className={`mb-6 ${isBlocked ? "opacity-50 pointer-events-none" : ""}`}>
          <div className="flex items-start gap-3 p-4 bg-secondary/20 rounded-lg">
            <Checkbox
              id="terms"
              checked={acceptedTerms}
              onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
              disabled={isBlocked}
            />
            <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
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
        </section>
      </main>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t shadow-lg">
        <Button
          className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90"
          disabled={!acceptedTerms || isBlocked}
          onClick={handleSubmit}
        >
          {isBlocked ? (
            <>
              <Lock className="h-4 w-4 mr-2" />
              No disponible
            </>
          ) : (
            "Continuar"
          )}
        </Button>
        <p className="text-[10px] text-muted-foreground text-center mt-2">
          Al continuar, revisarás y firmarás tu contrato
        </p>
      </div>

      {/* Terms & Conditions Modal */}
      <Dialog open={showTermsModal} onOpenChange={setShowTermsModal}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Términos y Condiciones
            </DialogTitle>
            <DialogClose className="absolute right-4 top-4">
              <X className="h-4 w-4" />
            </DialogClose>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <section>
              <h4 className="font-semibold text-foreground mb-2">1. Autorización de Descuento</h4>
              <p>
                Al aceptar estos términos, autorizo expresamente a Overall a descontar de mi remuneración mensual las
                cuotas correspondientes al préstamo o adelanto solicitado, conforme a las condiciones pactadas.
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-foreground mb-2">2. Tasa de Interés</h4>
              <p>
                Para préstamos personales, se aplica una tasa de interés mensual del 1% (12% TEA) calculada sobre el
                saldo deudor. Los adelantos de salario no generan intereses.
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-foreground mb-2">3. Comisiones</h4>
              <p>
                Se aplica una comisión única de transacción del 2% sobre el monto del préstamo, la cual será descontada
                del monto desembolsado.
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-foreground mb-2">4. Condiciones de Pago</h4>
              <p>
                El pago se realizará mediante descuento automático de planilla. En caso de cese laboral, el saldo
                pendiente será descontado de la liquidación de beneficios sociales.
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-foreground mb-2">5. Restricciones</h4>
              <p>
                No se podrá solicitar un nuevo préstamo mientras exista uno vigente. El monto máximo está sujeto a
                evaluación crediticia y descuentos judiciales aplicables.
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-foreground mb-2">6. Protección de Datos</h4>
              <p>
                La información proporcionada será tratada conforme a la Ley de Protección de Datos Personales. Overall
                se compromete a mantener la confidencialidad de tu información financiera.
              </p>
            </section>
          </div>
          <div className="mt-4">
            <Button className="w-full" onClick={() => setShowTermsModal(false)}>
              Entendido
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
