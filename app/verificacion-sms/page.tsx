"use client"

import type React from "react"
import { useState, useRef, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useScrollToTop } from "@/hooks/use-scroll-to-top"
import { AppFooter } from "@/components/app-footer"
import { ArrowLeft, Shield, CheckCircle, RefreshCw, Smartphone, AlertCircle, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const mockUser = {
  name: "Carlos Mendoza",
  phone: "987****45",
}

function VerificacionSMSContent() {
  useScrollToTop()
  const router = useRouter()
  const searchParams = useSearchParams()

  const amount = Number(searchParams.get("monto")) || 1000
  const term = Number(searchParams.get("plazo")) || 6
  const productType = (searchParams.get("tipo") as "adelanto" | "prestamo") || "prestamo"
  const monthlyPayment = Number(searchParams.get("cuota")) || 180
  const currentStep = Number(searchParams.get("step")) || 3

  const [code, setCode] = useState(["", "", "", "", "", ""])
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState("")
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [showExitConfirmation, setShowExitConfirmation] = useState(false)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
    }).format(value)
  }

  const handleBackClick = () => {
    router.back()
  }

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value.slice(-1)
    setCode(newCode)
    setError("")

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    const newCode = [...code]
    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i]
    }
    setCode(newCode)
    inputRefs.current[Math.min(pastedData.length, 5)]?.focus()
  }

  const handleVerify = async () => {
    const fullCode = code.join("")
    if (fullCode.length !== 6) {
      setError("Ingresa el código completo de 6 dígitos")
      return
    }

    setIsVerifying(true)
    setError("")

    await new Promise((resolve) => setTimeout(resolve, 2000))

    if (fullCode === "123456") {
      router.push(`/solicitud-exitosa?monto=${amount}&plazo=${term}&tipo=${productType}&cuota=${monthlyPayment}`)
    } else {
      setError("Código incorrecto. Por favor, verifica e intenta nuevamente.")
      setCode(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    }

    setIsVerifying(false)
  }

  const handleResend = async () => {
    setIsResending(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsResending(false)
    setCountdown(60)
    setCanResend(false)
    setCode(["", "", "", "", "", ""])
    setError("")
    inputRefs.current[0]?.focus()
  }

  const isCodeComplete = code.every((digit) => digit !== "")

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

      <main className="px-4 py-6">
        <div className="mb-6 p-4 bg-primary/5 rounded-lg border border-primary/20 animate-in fade-in slide-in-from-top-4 duration-500 delay-150">
          <p className="text-xs text-muted-foreground mb-1">Confirmando solicitud</p>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-foreground">
              {productType === "prestamo" ? "Préstamo Personal" : "Adelanto de Salario"}
            </span>
            <span className="font-bold text-primary">{formatCurrency(amount)}</span>
          </div>
        </div>

        <Card className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-primary/10">
                <Smartphone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Ingresa el código SMS</h2>
                <p className="text-sm text-muted-foreground">
                  Enviamos un código de 6 dígitos al número {mockUser.phone}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center gap-2">
              {code.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className={`w-12 h-14 text-center text-xl font-bold ${
                    error ? "border-destructive focus-visible:ring-destructive" : digit ? "border-primary" : ""
                  }`}
                  disabled={isVerifying}
                />
              ))}
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <div className="text-center">
              {canResend ? (
                <Button variant="ghost" className="text-primary" onClick={handleResend} disabled={isResending}>
                  {isResending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Reenviando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reenviar código
                    </>
                  )}
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Reenviar código en <span className="font-semibold text-primary">{countdown}s</span>
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-700 text-center font-medium">
            <span className="font-semibold">Demo:</span> Usa el código{" "}
            <span className="font-mono font-bold">123456</span> para verificar
          </p>
        </div>

        <div className="mt-4 p-4 bg-secondary/30 rounded-lg">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Verificación segura de Monet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Este código es único y expira en 5 minutos. Nunca compartas tu código con terceros.
              </p>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t shadow-lg">
        <Button
          className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90"
          disabled={!isCodeComplete || isVerifying}
          onClick={handleVerify}
        >
          {isVerifying ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Verificando...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Verificar y confirmar
            </>
          )}
        </Button>
        <p className="text-[10px] text-muted-foreground text-center mt-2">
          Al verificar, se procesará tu solicitud de {productType === "prestamo" ? "préstamo" : "adelanto"}
        </p>
      </div>

      {/* Diálogo de confirmación al salir */}
      <Dialog open={showExitConfirmation} onOpenChange={setShowExitConfirmation}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">¿Abandonar verificación?</DialogTitle>
          </DialogHeader>
          <p className="text-foreground/75 text-sm leading-relaxed">
            ¿Estás seguro de que no deseas continuar con tu solicitud en estos momentos? Podrás intentar de nuevo después.
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

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}

export default function VerificacionSMSPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <VerificacionSMSContent />
    </Suspense>
  )
}
