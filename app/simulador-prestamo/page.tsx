"use client"

import { useState, useMemo, Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useScrollToTop } from "@/hooks/use-scroll-to-top"
import { useCountAnimation } from "@/hooks/use-count-animation"
import type React from "react"
import { AppFooter } from "@/components/app-footer"
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
  ShieldCheck,
  Calendar,
  ChevronUp,
  ChevronDown,
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

const mockUser = {
  name: "Carlos Mendoza",
  netSalary: 1200,
  grossSalary: 1500,
  hasActiveLoan: false,
  recentRequestCount: 2,
  bankAccount: "BCP ****1234",
  existingJudicialDeductions: 75,
  existingOtherDeductions: 50,
}

function SimuladorPrestamoContent() {
  useScrollToTop()
  const router = useRouter()
  const searchParams = useSearchParams()
  const productType = (searchParams.get("tipo") as "adelanto" | "prestamo") || "prestamo"

  const baseMaxPercentage = productType === "adelanto" ? 0.5 : 0.5
  const frequencyPenalty = mockUser.recentRequestCount > 3 ? 0.2 : 0
  const effectiveMaxPercentage = Math.max(0.1, baseMaxPercentage - frequencyPenalty)

  const maxAmountByPercentage = mockUser.netSalary * effectiveMaxPercentage

  const maxMonthlyPayment = mockUser.grossSalary * 0.45

  const totalExistingDeductions = mockUser.existingJudicialDeductions + mockUser.existingOtherDeductions
  const maxTotalDeductions = mockUser.grossSalary * 0.6
  const availableForNewDeduction = Math.max(0, maxTotalDeductions - totalExistingDeductions)

  const maxAmount = Math.min(maxAmountByPercentage, mockUser.netSalary, availableForNewDeduction)

  const [amount, setAmount] = useState(300)
  const [term, setTerm] = useState(productType === "prestamo" ? 3 : 1)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [hasInteractedWithSlider, setHasInteractedWithSlider] = useState(false)
  const [scheduleExpanded, setScheduleExpanded] = useState(false)
  const [scrolledToSummary, setScrolledToSummary] = useState(false)
  const [summaryExpanded, setSummaryExpanded] = useState(false)
  const [showExitConfirmation, setShowExitConfirmation] = useState(false)
  const [currentStep, setCurrentStep] = useState(1) // 1: Simulación, 2: Firma, 3: Seguridad, 4: Finalizado

  // Hook para animación del contador
  const animatedAmount = useCountAnimation(amount, 200)

  const calculations = useMemo(() => {
    // El 'amount' ahora es el MONTO NETO A RECIBIR (lo que el usuario realmente recibe)
    const netAmountToReceive = amount

    // Calcular hacia atrás: cuánto se debe solicitar para recibir 'netAmountToReceive'
    const monthlyInterestRate = productType === "adelanto" ? 0 : 0.01
    const commissionPercentage = productType === "adelanto" ? 0 : 0.02

    // Aproximación iterativa: Solicitud = Neto / (1 - comisión_pct)
    const estimatedBroughtAmount = netAmountToReceive / (1 - commissionPercentage)
    const transactionFee = productType === "adelanto" ? 0 : estimatedBroughtAmount * commissionPercentage

    // Intereses sobre la solicitud bruta
    const totalInterest = estimatedBroughtAmount * monthlyInterestRate * term
    const igvOnInterest = totalInterest * 0.18
    const totalInterestWithIGV = totalInterest + igvOnInterest

    // Total a pagar = solicitud + costos
    const totalToPay = estimatedBroughtAmount + totalInterestWithIGV
    const monthlyPayment = totalToPay / term

    const isPaymentExceedsLimit = monthlyPayment > maxMonthlyPayment

    const newTotalDeductions = totalExistingDeductions + monthlyPayment
    const isDeductionsExceedsLimit = newTotalDeductions > maxTotalDeductions

    return {
      requestedAmount: Math.round(estimatedBroughtAmount),
      netAmountToReceive,
      monthlyInterestRate: monthlyInterestRate * 100,
      totalInterest: Math.round(totalInterest),
      igvOnInterest: Math.round(igvOnInterest),
      totalInterestWithIGV: Math.round(totalInterestWithIGV),
      transactionFee: Math.round(transactionFee),
      totalToPay: Math.round(totalToPay),
      monthlyPayment: Math.round(monthlyPayment),
      isPaymentExceedsLimit,
      isDeductionsExceedsLimit,
      newTotalDeductions: Math.round(newTotalDeductions),
      deductionPercentage: (newTotalDeductions / mockUser.grossSalary) * 100,
    }
  }, [amount, term, productType, maxMonthlyPayment, maxTotalDeductions, totalExistingDeductions])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
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

  const handleAmountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/\D/g, '') // Solo números
    if (inputValue === '') return
    
    const value = parseInt(inputValue, 10)
    const validatedValue = Math.min(Math.max(100, value), maxAmount)
    setAmount(validatedValue)
    setHasInteractedWithSlider(true)
  }

  const handleAmountInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/\D/g, '')
    if (inputValue === '') {
      setAmount(Math.max(100, Math.min(amount, maxAmount)))
    }
  }

  const handleAmountInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Permitir solo números y teclas de control
    if (!/^\d$/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(e.key)) {
      e.preventDefault()
    }
  }

  const generateAmortizationSchedule = () => {
    const schedule = []
    let balance = calculations.requestedAmount
    const monthlyInterestRate = productType === "prestamo" ? 0.01 : 0
    const monthlyPayment = calculations.monthlyPayment

    for (let i = 1; i <= term; i++) {
      const interest = balance * monthlyInterestRate
      const igv = interest * 0.18
      const principal = monthlyPayment - interest - igv
      balance = Math.max(0, balance - principal)

      const dueDate = new Date()
      dueDate.setMonth(dueDate.getMonth() + i)

      schedule.push({
        month: i,
        dueDate: dueDate.toLocaleDateString("es-PE", { day: "2-digit", month: "short" }),
        principal: Math.round(principal),
        interest: Math.round(interest),
        igv: Math.round(igv),
        payment: Math.round(monthlyPayment),
        balance: Math.round(balance),
      })
    }
    return schedule
  }

  const amortizationSchedule = useMemo(() => generateAmortizationSchedule(), [term, calculations, productType])

  const handleBackClick = () => {
    if (hasInteractedWithSlider) {
      setShowExitConfirmation(true)
    } else {
      router.push('/')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Math.max(0, Number(e.target.value)), maxAmount)
    setAmount(Math.round(value))
    setHasInteractedWithSlider(true)
  }

  const handleSubmit = () => {
    setCurrentStep(2)
    router.push(
      `/firma-contrato?tipo=${productType}&monto=${calculations.netAmountToReceive}&plazo=${term}&cuota=${calculations.monthlyPayment}&solicitado=${calculations.requestedAmount}&step=2`
    )
  }

  const isBlocked = mockUser.hasActiveLoan
  const hasValidationErrors = calculations.isPaymentExceedsLimit || calculations.isDeductionsExceedsLimit

  useEffect(() => {
    const handleScroll = () => {
      const summaryElement = document.querySelector('[data-summary="true"]')
      if (summaryElement) {
        const summaryPosition = summaryElement.getBoundingClientRect().top
        const isVisible = summaryPosition <= window.innerHeight
        setScrolledToSummary(isVisible)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <style>{`
        /* Input editable de monto */
        input[type="text"]::-webkit-outer-spin-button,
        input[type="text"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type="text"][inputmode="numeric"] {
          font-family: 'Courier New', monospace;
          letter-spacing: 0.05em;
        }

        /* Estilos optimizados para accesibilidad táctil en móviles */
        input[type="range"] {
          outline: none;
        }

        input[type="range"]::-webkit-slider-runnable-track {
          appearance: none;
          -webkit-appearance: none;
          width: 100%;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          cursor: pointer;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.08);
        }

        input[type="range"]::-moz-range-track {
          background: #e5e7eb;
          border: none;
          border-radius: 4px;
          height: 8px;
          cursor: pointer;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.08);
        }

        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          -webkit-appearance: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: ${productType === "prestamo" ? '#D97706' : '#0072ce'};
          cursor: grab;
          box-shadow: ${productType === "prestamo" ? '0 4px 12px rgba(217, 119, 6, 0.5)' : '0 4px 12px rgba(0, 114, 206, 0.5)'};
          border: 3px solid white;
          transition: all 0.15s ease-out;
          margin-top: -10px;
        }

        input[type="range"]::-webkit-slider-thumb:active {
          cursor: grabbing;
          width: 32px;
          height: 32px;
          box-shadow: ${productType === "prestamo" ? '0 6px 16px rgba(217, 119, 6, 0.7)' : '0 6px 16px rgba(0, 114, 206, 0.7)'};
          margin-top: -12px;
        }

        input[type="range"]::-webkit-slider-thumb:focus {
          outline: 2px solid ${productType === "prestamo" ? '#D97706' : '#0072ce'};
          outline-offset: 2px;
        }

        input[type="range"]::-moz-range-thumb {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: ${productType === "prestamo" ? '#D97706' : '#0072ce'};
          cursor: grab;
          box-shadow: ${productType === "prestamo" ? '0 4px 12px rgba(217, 119, 6, 0.5)' : '0 4px 12px rgba(0, 114, 206, 0.5)'};
          border: 3px solid white;
          transition: all 0.15s ease-out;
        }

        input[type="range"]::-moz-range-thumb:active {
          cursor: grabbing;
          width: 32px;
          height: 32px;
          box-shadow: ${productType === "prestamo" ? '0 6px 16px rgba(217, 119, 6, 0.7)' : '0 6px 16px rgba(0, 114, 206, 0.7)'};
        }

        input[type="range"]::-moz-range-thumb:focus {
          outline: 2px solid ${productType === "prestamo" ? '#D97706' : '#0072ce'};
          outline-offset: 2px;
        }

        input[type="range"]:focus {
          outline: none;
        }

        @media (pointer: coarse) {
          /* Optimizaciones específicas para dispositivos táctiles */
          input[type="range"] {
            -webkit-touch-callout: none;
          }

          input[type="range"]::-webkit-slider-thumb {
            width: 32px;
            height: 32px;
            margin-top: -12px;
          }

          input[type="range"]::-moz-range-thumb {
            width: 32px;
            height: 32px;
          }
        }
      `}</style>
      {/* Header mejorado con Stepper compacto */}
      <div className="bg-gradient-to-r from-primary/90 to-primary px-4 py-3 text-white sticky top-0 z-40">
        <div className="flex items-center justify-between mb-2">
          <button onClick={handleBackClick} className="hover:bg-white/20 p-2 rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
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
      </div>

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
          <Card className="mb-6 border-destructive/30 bg-destructive/5 animate-in fade-in slide-in-from-top-4 duration-500">
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
        {mockUser.recentRequestCount > 3 && !isBlocked && (
          <Card className="mb-6 border-amber-500/30 bg-amber-500/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-attention/10">
                  <AlertTriangle className="h-5 w-5 text-attention" />
                </div>
                <div>
                  <h3 className="font-medium text-attention mb-1">Límite reducido temporalmente</h3>
                  <p className="text-xs text-muted-foreground">
                    Debido a solicitudes recientes, tu límite se ha reducido del {Math.round(baseMaxPercentage * 100)}%
                    al {Math.round(effectiveMaxPercentage * 100)}% de tu sueldo neto.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {productType === "adelanto" && !isBlocked && (
          <Card className="mb-6 border-0 shadow-md border-t-4 border-t-interaction bg-gradient-to-br from-interaction-light/40 to-white">
            <CardContent className="space-y-6 pt-6">
              {/* MONTO QUE RECIBIRÁS - Title mejorado */}
              <div>
                <h2 className="text-sm font-bold text-foreground mb-1">¿Cuánto dinero quieres recibir?</h2>
              </div>

              {/* Amount Display - Input + Slider mejorado */}
              <div className="space-y-4">
                
                {/* Monto grande animado - FUERA DE CAJA */}
                {/* Mostrador de monto editable */}
                <div className="flex flex-col items-center gap-3 py-4 -mt-2">
                  
                  <div className="flex items-baseline justify-center gap-0 min-w-fit">
                    <span className="font-montserrat font-bold text-5xl leading-none text-emerald-900">S/</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="0"
                      value={amount.toLocaleString("es-PE")}
                      onChange={handleAmountInputChange}
                      onBlur={handleAmountInputBlur}
                      onKeyDown={handleAmountInputKeyDown}
                      className="font-montserrat font-bold text-6xl tabular-nums leading-none bg-transparent text-center border-2 border-transparent hover:border-interaction/30 focus:border-interaction rounded-lg px-0.5 transition-all duration-200 outline-none w-fit min-w-[160px] max-w-[220px] text-emerald-900 text-emerald-800"
                      maxLength={10}
                      aria-label="Monto a recibir editable"
                    />
                  </div>
                  
                </div>

                {/* Slider lineal con emoji de moneda y gradiente */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">S/</span>
                    <div className="relative flex-1 flex items-center pointer-events-auto" style={{ minHeight: '60px', paddingTop: '16px', paddingBottom: '16px' }}>
                      {/* Track de fondo - aumentado a 8px para mejor área táctil */}
                      <div className="absolute inset-y-0 left-0 right-0 bg-gray-200 rounded-full pointer-events-none" style={{ top: '50%', transform: 'translateY(-50%)', height: '8px' }} />
                      
                      {/* Track activo con gradiente - optimizado para mejor visualización */}
                      <div
                        className="absolute left-0 h-2 rounded-full transition-all duration-200 pointer-events-none"
                        style={{
                          top: '50%',
                          transform: 'translateY(-50%)',
                          height: '8px',
                          width: `${((amount - 100) / (maxAmount - 100)) * 100}%`,
                          background: productType === "prestamo"
                            ? `linear-gradient(to right, #D97706, ${
                                ((amount - 100) / (maxAmount - 100)) < 0.5
                                  ? '#F59E0B'
                                  : ((amount - 100) / (maxAmount - 100)) < 0.75
                                    ? '#DC2626'
                                    : '#B45309'
                              })`
                            : `linear-gradient(to right, #0072ce, ${
                                ((amount - 100) / (maxAmount - 100)) < 0.5
                                  ? '#0084ff'
                                  : ((amount - 100) / (maxAmount - 100)) < 0.75
                                    ? '#0066cc'
                                    : '#003d99'
                              })`,
                          boxShadow: productType === "prestamo"
                            ? '0 4px 12px rgba(217, 119, 6, 0.4)'
                            : '0 4px 12px rgba(0, 114, 206, 0.4)',
                        }}
                      />

                      {/* Slider invisible para detectar input - Optimizado para móvil */}
                      <input
                        type="range"
                        min="100"
                        max={maxAmount}
                        step="50"
                        value={amount}
                        onChange={(e) => {
                          setAmount(Number(e.target.value))
                          setHasInteractedWithSlider(true)
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 pointer-events-auto"
                        aria-label={`${productType === "prestamo" ? "Monto del préstamo" : "Monto del adelanto"}`}
                        aria-valuemin={100}
                        aria-valuemax={maxAmount}
                        aria-valuenow={amount}
                        aria-valuetext={`S/ ${amount.toLocaleString('es-PE')}`}
                        style={{
                          appearance: 'none',
                          WebkitAppearance: 'none',
                          MozAppearance: 'none',
                          background: 'transparent',
                          touchAction: 'manipulation',
                          WebkitTouchCallout: 'none',
                          WebkitUserSelect: 'none',
                          MozUserSelect: 'none',
                          userSelect: 'none',
                        }}
                      />

                      {/* Thumb con emoji de moneda - Zona táctil expandida */}
                      <div
                        className="absolute z-5 filter drop-shadow-lg transition-all duration-200 pointer-events-none"
                        style={{
                          left: `${((amount - 100) / (maxAmount - 100)) * 100}%`,
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                          fontSize: '24px',
                          width: '40px',
                          height: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        aria-hidden="true"
                      >
                        💰
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-foreground text-right min-w-fit">
                      {formatCompact(amount)}
                    </span>
                  </div>

                  {/* Labels de rango */}
                  <div className="flex items-end justify-between px-1">
                    <div className="text-left">
                      <p className="text-[10px] text-muted-foreground">Mínimo</p>
                      <p className="text-xs font-semibold text-foreground">S/ {formatCompact(100)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground">Máximo</p>
                      <p className="text-xs font-bold text-interaction">S/ {formatCompact(maxAmount)}</p>
                    </div>
                  </div>
                </div>

                {/* Info card - Rango disponible */}
                <div className="bg-interaction/5 border border-interaction/20 rounded-lg p-3">
                  <p className="text-xs text-foreground/80">
                    <span className="font-semibold text-interaction">✓ Aprobado:</span> Puedes solicitar de{" "}
                    <span className="font-bold text-interaction">{formatCurrency(100)}</span> hasta{" "}
                    <span className="font-bold text-interaction">{formatCurrency(maxAmount)}</span>
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1.5">Basado en tu sueldo y límites legales</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {productType === "prestamo" && !isBlocked && (
          <Card className="mb-6 border-0 shadow-md border-t-4 border-t-premium bg-gradient-to-br from-premium-light/30 to-white animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
            <CardContent className="space-y-6 pt-6">
              {/* MONTO QUE RECIBIRÁS */}
              <div>
                <h2 className="text-sm font-bold text-foreground mb-1">¿Cuánto dinero quieres recibir?</h2>
              </div>

              {/* Amount Display - Input + Slider */}
              <div className="space-y-4">
                
                {/* Monto grande animado - FUERA DE CAJA */}
                {/* Mostrador de monto editable */}
                <div className="flex flex-col items-center gap-3 py-4 -mt-2">
                  <p className="text-xs text-muted-foreground/70 font-medium">Monto a recibir</p>
                  <div className="flex items-baseline justify-center gap-0 min-w-fit">
                    <span className="font-montserrat font-bold text-5xl text-amber-600 leading-none">S/</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="0"
                      value={amount.toLocaleString("es-PE")}
                      onChange={handleAmountInputChange}
                      onBlur={handleAmountInputBlur}
                      onKeyDown={handleAmountInputKeyDown}
                      className="font-montserrat font-bold text-6xl text-amber-600 tabular-nums leading-none bg-transparent text-center border-2 border-transparent hover:border-amber-600/30 focus:border-amber-600 rounded-lg px-0.5 transition-all duration-200 outline-none w-fit min-w-[160px] max-w-[220px]"
                      maxLength={10}
                      aria-label="Monto a recibir editable"
                    />
                  </div>
                  
                </div>

                {/* Slider lineal con emoji de moneda y gradiente púrpura */}
                <div className="pt-2 space-y-4">
                  {/* Slider */}
                  <div className="flex items-center gap-2">
                    
                    <div className="relative flex-1 flex items-center pointer-events-auto" style={{ minHeight: '60px', paddingTop: '16px', paddingBottom: '16px' }}>
                      {/* Track de fondo - aumentado a 8px para mejor área táctil */}
                      <div className="absolute inset-y-0 left-0 right-0 bg-gray-200 rounded-full pointer-events-none" style={{ top: '50%', transform: 'translateY(-50%)', height: '8px' }} />
                      
                      {/* Track activo con gradiente púrpura */}
                      <div
                        className="absolute left-0 rounded-full transition-all duration-200 pointer-events-none"
                        style={{
                          top: '50%',
                          transform: 'translateY(-50%)',
                          height: '8px',
                          width: `${((amount - 100) / (maxAmount - 100)) * 100}%`,
                          background: `linear-gradient(to right, #5B4A9F, ${
                            ((amount - 100) / (maxAmount - 100)) < 0.5
                              ? '#7B68BE'
                              : ((amount - 100) / (maxAmount - 100)) < 0.75
                                ? '#6B5CAF'
                                : '#4B3A8F'
                          })`,
                          boxShadow: '0 4px 12px rgba(91, 74, 159, 0.4)',
                        }}
                      />

                      {/* Slider invisible para detectar input - Optimizado para móvil */}
                      <input
                        type="range"
                        min="100"
                        max={maxAmount}
                        step="50"
                        value={amount}
                        onChange={(e) => {
                          setAmount(Number(e.target.value))
                          setHasInteractedWithSlider(true)
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 pointer-events-auto"
                        aria-label={`${productType === "prestamo" ? "Monto del préstamo" : "Monto del adelanto"}`}
                        aria-valuemin={100}
                        aria-valuemax={maxAmount}
                        aria-valuenow={amount}
                        aria-valuetext={`S/ ${amount.toLocaleString('es-PE')}`}
                        style={{
                          appearance: 'none',
                          WebkitAppearance: 'none',
                          MozAppearance: 'none',
                          background: 'transparent',
                          touchAction: 'manipulation',
                          WebkitTouchCallout: 'none',
                          WebkitUserSelect: 'none',
                          MozUserSelect: 'none',
                          userSelect: 'none',
                        }}
                      />

                      {/* Thumb con emoji de moneda - Zona táctil expandida */}
                      <div
                        className="absolute z-5 filter drop-shadow-lg transition-all duration-200 pointer-events-none"
                        style={{
                          left: `${((amount - 100) / (maxAmount - 100)) * 100}%`,
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                          fontSize: '24px',
                          width: '40px',
                          height: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        aria-hidden="true"
                      >
                        💰
                      </div>
                    </div>
                    
                  </div>

                  {/* Labels de rango */}
                  <div className="flex items-end justify-between px-1">
                    <div className="text-left">
                      <p className="text-[10px] text-muted-foreground">Mínimo</p>
                      <p className="text-xs font-semibold text-foreground">S/ {formatCompact(100)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground">Máximo</p>
                      <p className="text-xs font-bold text-interaction">S/ {formatCompact(maxAmount)}</p>
                    </div>
                  </div>
                </div>

                {/* Info card - Rango disponible */}
                <div className="bg-interaction/5 border border-interaction/20 rounded-lg p-3">
                  <p className="text-xs text-foreground/80">
                    <span className="font-semibold text-interaction">✓ Aprobado:</span> Puedes solicitar de{" "}
                    <span className="font-bold text-interaction">{formatCurrency(100)}</span> hasta{" "}
                    <span className="font-bold text-interaction">{formatCurrency(maxAmount)}</span>
                  </p>
                  <p className="text-muted-foreground mt-1.5 text-xs font-bold">Basado en tu sueldo y límites legales</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Plazo - Solo para Préstamo */}
        {productType === "prestamo" && (
          <div className="space-y-4 pt-4 border-t border-border/50 pb-4">
            <div className="my-6">
              <Label className="flex items-center gap-2 font-semibold text-foreground mb-3">
                <span>¿En cuántos meses quieres pagar?</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3.5 w-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">A mayor plazo, menor cuota mensual, pero pagarás más intereses</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>

              {/* Slider compacto de plazo con teal */}
              <div className="space-y-3">
                <Slider
                  value={[term]}
                  onValueChange={(value) => {
                    setTerm(value[0])
                    setHasInteractedWithSlider(true)
                  }}
                  max={6}
                  min={3}
                  step={1}
                  className="w-full"
                  rangeColor="bg-interaction"
                  thumbBorderColor="ring-interaction"
                />
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs text-muted-foreground">3 meses</span>
                  <span className="text-sm font-bold text-primary">{term} {term === 1 ? "mes" : "meses"}</span>
                  <span className="text-xs text-muted-foreground">6 meses</span>
                </div>
              </div>
            </div>

            {/* Cronograma de cuotas - Optimizado */}
            <div className="bg-gradient-to-b from-primary/5 to-transparent rounded-lg p-3.5 border border-primary/10 space-y-3">
              <button
                onClick={() => setScheduleExpanded(!scheduleExpanded)}
                className="flex items-center justify-between w-full group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground text-sm">Así será tu cronograma de cuotas</p>
                    <p className="text-muted-foreground text-xs">en base a tu solicitud</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right flex-shrink-0 pl-2">
                    <p className="text-sm font-bold text-primary">{formatCompact(calculations.monthlyPayment)}</p>
                  </div>
                  {scheduleExpanded ? (
                    <ChevronUp className="h-4 w-4 text-primary transition-transform" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  )}
                </div>
              </button>

              {/* Expandible con tabla mejorada */}
              {scheduleExpanded && (
                <div className="animate-in slide-in-from-top-2 duration-200 space-y-3">
                  {/* Cards compactas por mes */}
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    {amortizationSchedule.map((row, idx) => (
                      <div
                        key={row.month}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex-shrink-0">
                            {row.month}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-foreground">{row.dueDate}</p>
                            <div className="flex gap-1.5 mt-0.5">
                              <span className="text-[10px] text-muted-foreground">Capital: {formatCompact(row.principal)}</span>
                              <span className="text-[10px] text-muted-foreground">Int+IGV: {formatCompact(row.interest + row.igv)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 pl-2">
                          <p className="text-sm font-bold text-primary">{formatCompact(row.payment)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Resumen total */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-premium text-primary-foreground font-semibold border border-premium/50">
                    <div>
                      <p className="text-xs opacity-90">Solicitarás</p>
                      <p className="text-sm">{formatCompact(calculations.requestedAmount)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs opacity-90">Intereses + IGV</p>
                      <p className="text-sm">{formatCompact(calculations.totalInterestWithIGV)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs opacity-90">Total a pagar</p>
                      <p className="text-base">{formatCompact(calculations.totalToPay)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cost Breakdown Card - AHORA EXPANDIBLE */}
        <section className={`mb-6 ${isBlocked ? "opacity-50 pointer-events-none" : ""} transition-all duration-700 ${scrolledToSummary ? "opacity-100" : "opacity-0"}`} data-summary="true">
          <div className="bg-gradient-to-b from-primary/5 to-transparent rounded-lg p-3.5 border border-primary/10">
            {/* Header expandible */}
            <button
              onClick={() => setSummaryExpanded(!summaryExpanded)}
              className="w-full flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5 text-left">
                <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Resumen de tu solicitud</p>
                  <p className="text-muted-foreground text-xs">Conoce el detalle</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isRefreshing && (
                  <div className="flex items-center gap-2 mr-2">
                    <div className="flex gap-1">
                      <div className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                      <div className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                      <div className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                    </div>
                    <span className="text-xs text-primary font-semibold">Actualizando...</span>
                  </div>
                )}
                {summaryExpanded ? (
                  <ChevronUp className="h-4 w-4 text-primary transition-transform" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                )}
              </div>
            </button>

            {/* Contenido expandible */}
            {summaryExpanded && (
              <div className="animate-in slide-in-from-top-2 duration-200 space-y-3 mt-4 border-t border-primary/10 pt-4">
                {/* Solicitarás */}
                <div className="flex items-start justify-between text-xs gap-2 pb-2 border-b border-primary/10">
                  <div className="flex-1">
                    <span className="font-semibold text-foreground">Solicitarás</span>
                    <p className="text-[10px] text-foreground/70">(monto a recibir)</p>
                  </div>
                  <p className="font-bold text-foreground whitespace-nowrap">
                    {formatCurrency(amount)}
                  </p>
                </div>

                {/* Interés */}
                <div className="flex items-start justify-between text-xs gap-2 pb-2 border-b border-primary/10">
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-foreground">+ Interés</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3 text-foreground/50 hover:text-primary" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="text-xs">
                              El banco cobra 1% cada mes por dejarte usar el dinero. Es como una renta del efectivo.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <p className="text-[10px] text-foreground/70">(costo de pedir dinero prestado)</p>
                  </div>
                  <p className="font-bold text-foreground whitespace-nowrap">
                    {productType === "prestamo" ? formatCurrency(calculations.totalInterest) : "—"}
                  </p>
                </div>

                {/* IGV */}
                {productType === "prestamo" && (
                  <div className="flex items-start justify-between text-xs gap-2 pb-2 border-b border-primary/10">
                    <div className="flex-1">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-foreground">+ IGV (18%)</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-3 w-3 text-foreground/50 hover:text-primary" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p className="text-xs">
                                El gobierno cobra impuesto (IGV) solo sobre los intereses, no sobre tu monto principal.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <p className="text-[10px] text-foreground/70">(impuesto al gobierno)</p>
                    </div>
                    <p className="font-bold text-foreground whitespace-nowrap">
                      {formatCurrency(calculations.igvOnInterest)}
                    </p>
                  </div>
                )}

                {/* Comisión */}
                {productType === "prestamo" && (
                  <div className="flex items-start justify-between text-xs gap-2 pb-2 border-b border-primary/10">
                    <div className="flex-1">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-foreground">- Comisión (2%)</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-3 w-3 text-foreground/50 hover:text-primary" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p className="text-xs">
                                Cobro por la gestión y procesamiento de tu préstamo.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <p className="text-[10px] text-foreground/70">(cobro por gestión)</p>
                    </div>
                    <p className="font-bold text-foreground whitespace-nowrap">
                      {formatCurrency(calculations.transactionFee)}
                    </p>
                  </div>
                )}

                {/* Total a pagar - DESTACADO */}
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-3.5 mt-2">
                  <p className="text-[10px] text-foreground/70 mb-1.5 font-semibold">Total a pagar</p>
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(calculations.totalToPay)}
                  </p>
                </div>

                {/* Descuento de quincena */}
                {productType === "prestamo" && (
                  <div className="bg-amber-50/50 border border-amber-200/50 rounded-lg p-2.5 flex items-start gap-2">
                    <span className="text-lg">📅</span>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground/90 text-sm">Se descontará automáticamente de la segunda quincena de tu sueldo el día 16/07/2026.  </p>
                      
                    </div>
                  </div>
                )}

                {/* Descuento de quincena - Adelanto */}
                {productType === "adelanto" && (
                  <div className="bg-blue-50/50 border border-blue-200/50 rounded-lg p-2.5 flex items-start gap-2">
                    <span className="text-lg">📅</span>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground/90 text-sm">Se descontará automáticamente de la segunda quincena de tu sueldo el día 16/07/2026.</p>
                      
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* DESGLOSE DE COSTOS - Diseño superior */}
        {productType === "prestamo" && (
          <div className="space-y-2.5 pt-3 border-t border-border/50">
            
          </div>
        )}

        {/* Legal Checkbox - REMOVIDO: Ahora está solo en Firma */}
      </main>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t shadow-lg">
        <Button
          className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90"
          disabled={!hasInteractedWithSlider}
          onClick={handleSubmit}
        >
          {isBlocked ? (
            <>
              <Lock className="h-4 w-4 mr-2" />
              No disponible
            </>
          ) : hasValidationErrors ? (
            <>
              <AlertTriangle className="h-4 w-4 mr-2" />
              Ajusta los valores
            </>
          ) : (
            "Ver contrato"
          )}
        </Button>
        <p className="text-[10px] text-muted-foreground text-center mt-2">
          Al continuar, revisarás y firmarás tu contrato
        </p>
      </div>

      {/* Diálogo de confirmación al salir */}
      <Dialog open={showExitConfirmation} onOpenChange={setShowExitConfirmation}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">¿Abandonar solicitud?</DialogTitle>
          </DialogHeader>
          <p className="text-foreground/75 text-sm leading-relaxed">
            ¿Estás seguro de que no deseas continuar con tu solicitud en estos momentos? Podrás volver a simular cuando lo necesites.
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

export default function SimuladorPrestamoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Cargando...</div>}>
      <SimuladorPrestamoContent />
    </Suspense>
  )
}
