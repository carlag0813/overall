"use client"

import { CreditCard, Calendar, AlertCircle, ArrowLeft, Banknote, ChevronDown, ChevronUp, CheckCircle2, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AppFooter } from "@/components/app-footer"
import { useState } from "react"

const mockLoanData = {
  id: "PR-2024-001",
  totalLoanAmount: 1575,
  pendingAmount: 525,
  remainingInstallments: 3,
  totalInstallments: 6,
  monthlyPayment: 262.5,
  startDate: "15 Oct 2025",
  endDate: "15 Mar 2026",
  nextPaymentDate: "15 Feb 2026",
  interestRate: 1.0,
  totalInterest: 52.5,
  commission: 31.5,
  igv: 5.67,
  quotas: [
    { number: 1, date: "15 Oct 2025", amount: 262.5, paid: true },
    { number: 2, date: "15 Nov 2025", amount: 262.5, paid: true },
    { number: 3, date: "15 Dec 2025", amount: 262.5, paid: true },
    { number: 4, date: "15 Jan 2026", amount: 262.5, paid: false },
    { number: 5, date: "15 Feb 2026", amount: 262.5, paid: false },
    { number: 6, date: "15 Mar 2026", amount: 262.5, paid: false },
  ],
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
  }).format(amount)
}

export default function PrestamoVigentePage() {
  const [scheduleExpanded, setScheduleExpanded] = useState(false)
  const [breakdownExpanded, setBreakdownExpanded] = useState(false)
  
  const progressPercentage = ((mockLoanData.totalInstallments - mockLoanData.remainingInstallments) / mockLoanData.totalInstallments) * 100
  const nextQuota = mockLoanData.quotas.find((q) => !q.paid)

  return (
    <div className="min-h-screen bg-background">
      {/* Header mejorado con gradiente teal */}
      <header className="bg-gradient-to-r from-teal-600 to-teal-700 px-4 pt-12 pb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-teal-50 hover:bg-teal-700/50 -ml-2 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Button>
        </Link>
        <h1 className="text-teal-50 font-semibold text-lg">Préstamo Vigente</h1>
        <p className="text-teal-100 text-xs mt-1">ID: {mockLoanData.id}</p>
      </header>

      <div className="px-4 py-6 space-y-4">
        {/* Banner principal mejorado */}
        <Card className="border-0 bg-gradient-to-br from-teal-50 to-emerald-50 shadow-md">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-teal-100 rounded-full shrink-0">
                <CheckCircle2 className="h-6 w-6 text-teal-600" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-teal-900 text-base">Operación activa</h3>
                <p className="text-teal-800 text-xs leading-relaxed">
                  Tu préstamo está en curso. Vas pagando {mockLoanData.totalInstallments - mockLoanData.remainingInstallments} de {mockLoanData.totalInstallments} cuotas. Quedan {mockLoanData.remainingInstallments} por pagar.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Próxima cuota destacada */}
        {nextQuota && (
          <Card className="border-0 bg-gradient-to-br from-amber-50 to-orange-50 shadow-md border-l-4 border-l-amber-600">
            <CardContent className="p-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-amber-900 text-sm">Próximo Pago</h4>
                  <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-semibold">Cuota {nextQuota.number}</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-bold text-amber-700">{formatCurrency(nextQuota.amount)}</span>
                  <span className="text-xs text-amber-600 font-medium">{nextQuota.date}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resumen del préstamo vigente mejorado */}
        <Card className="border-teal-100 shadow-sm">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-2 text-foreground">
              <CreditCard className="h-4 w-4 text-teal-600" />
              <h4 className="font-semibold text-sm">Resumen de tu préstamo</h4>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-teal-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <Banknote className="h-4 w-4 text-teal-600" />
                  </div>
                  <span className="text-sm text-muted-foreground">Saldo pendiente</span>
                </div>
                <span className="font-semibold text-teal-700 text-base">{formatCurrency(mockLoanData.pendingAmount)}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-teal-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Calendar className="h-4 w-4 text-amber-600" />
                  </div>
                  <span className="text-sm text-muted-foreground">Cuotas restantes</span>
                </div>
                <span className="font-semibold text-amber-700 text-base">
                  {mockLoanData.remainingInstallments} de {mockLoanData.totalInstallments}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-teal-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <CreditCard className="h-4 w-4 text-teal-600" />
                  </div>
                  <span className="text-sm text-muted-foreground">Cuota mensual</span>
                </div>
                <span className="font-semibold text-foreground">{formatCurrency(mockLoanData.monthlyPayment)}</span>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  </div>
                  <span className="text-sm text-muted-foreground">Total del préstamo</span>
                </div>
                <span className="font-semibold text-emerald-700 text-base">{formatCurrency(mockLoanData.totalLoanAmount)}</span>
              </div>
            </div>

            {/* Barra de progreso mejorada */}
            <div className="space-y-3 pt-4 border-t border-teal-100">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className="font-medium">Progreso de pago</span>
                <span className="font-semibold text-teal-700">{progressPercentage.toFixed(0)}% completado</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-sm">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cronograma de cuotas expandible */}
        <Card className="border-teal-100 shadow-sm">
          <button
            onClick={() => setScheduleExpanded(!scheduleExpanded)}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-teal-50/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-teal-600" />
              <h4 className="font-semibold text-sm text-foreground">Cronograma de Cuotas</h4>
            </div>
            {scheduleExpanded ? (
              <ChevronUp className="h-4 w-4 text-teal-600" />
            ) : (
              <ChevronDown className="h-4 w-4 text-teal-600" />
            )}
          </button>

          {scheduleExpanded && (
            <CardContent className="px-5 pb-5 pt-0 border-t border-teal-100">
              <div className="max-h-96 overflow-y-auto space-y-2">
                {mockLoanData.quotas.map((quota) => (
                  <div key={quota.number} className="flex items-center justify-between p-3 bg-teal-50/40 rounded-lg hover:bg-teal-50 transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      {quota.paid ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <Clock className="h-4 w-4 text-amber-500 flex-shrink-0" />
                      )}
                      <div>
                        <p className={`text-xs font-semibold ${quota.paid ? "text-emerald-700" : "text-foreground"}`}>
                          Cuota {quota.number}
                        </p>
                        <p className="text-[10px] text-muted-foreground">{quota.date}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold ${quota.paid ? "text-emerald-700" : "text-amber-700"}`}>
                      {formatCurrency(quota.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Fechas del préstamo mejorado */}
        <Card className="border-teal-100 shadow-sm">
          <CardContent className="p-5 space-y-3">
            <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4 text-teal-600" />
              Fechas del préstamo
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-teal-50 to-teal-100/50 rounded-lg p-4 border border-teal-200">
                <p className="text-[10px] text-teal-700/70 mb-1 font-medium">Inicio del préstamo</p>
                <p className="font-semibold text-teal-700 text-sm">{mockLoanData.startDate}</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-lg p-4 border border-emerald-200">
                <p className="text-[10px] text-emerald-700/70 mb-1 font-medium">Fin del préstamo</p>
                <p className="font-semibold text-emerald-700 text-sm">{mockLoanData.endDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nota informativa mejorada */}
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 text-center">
          <p className="text-xs text-teal-700 font-medium">
            ✓ Una vez completadas tus {mockLoanData.totalInstallments} cuotas, podrás acceder nuevamente a nuestras ofertas preaprobadas.
          </p>
        </div>
      </div>

      <AppFooter />
    </div>
  )
}
