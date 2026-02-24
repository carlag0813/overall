"use client"

import { CreditCard, Calendar, ArrowLeft, ChevronRight, CheckCircle2, Clock } from "lucide-react"
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
  const progressPercentage = ((mockLoanData.totalInstallments - mockLoanData.remainingInstallments) / mockLoanData.totalInstallments) * 100
  const nextQuota = mockLoanData.quotas.find((q) => !q.paid)

  return (
    <div className="min-h-screen bg-background">
      {/* Header limpio y coherente con HOME */}
      <header className="bg-gradient-to-r from-teal-600 to-teal-700 px-4 pt-4 pb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-teal-50 hover:bg-teal-700/50 -ml-2 mb-3">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </Link>
        <h1 className="text-teal-50 font-semibold text-lg">Préstamo Vigente</h1>
        <p className="text-teal-100 text-xs mt-1">ID: {mockLoanData.id}</p>
      </header>

      <div className="px-4 py-6 space-y-4">
        {/* Card única compacta con toda la información */}
        <Card className="border-teal-200/50 shadow-md rounded-2xl overflow-hidden">
          <CardContent className="p-5 md:p-6 space-y-5">
            {/* Encabezado con estado */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2 bg-teal-100 rounded-full flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="h-4 w-4 text-teal-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-teal-600 font-semibold uppercase tracking-wide">Operación activa</p>
                  <p className="text-sm md:text-base font-semibold text-foreground mt-1">
                    {mockLoanData.totalInstallments - mockLoanData.remainingInstallments} de {mockLoanData.totalInstallments} cuotas pagadas
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-foreground/60 mb-1">Progreso</p>
                <p className="text-xl font-bold text-teal-600">{progressPercentage.toFixed(0)}%</p>
              </div>
            </div>

            {/* Barra de progreso compacta */}
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            {/* Grid compacto: 2 columnas en mobile, 4 en desktop */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {/* Monto original */}
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-50/50 rounded-lg p-3 border border-emerald-200/40">
                <p className="text-xs text-foreground/60 font-medium mb-1">Monto original</p>
                <p className="font-bold text-emerald-700">{formatCurrency(mockLoanData.totalLoanAmount)}</p>
              </div>

              {/* Saldo pendiente */}
              <div className="bg-gradient-to-br from-amber-50 to-amber-50/50 rounded-lg p-3 border border-amber-200/40">
                <p className="text-xs text-foreground/60 font-medium mb-1">Saldo pendiente</p>
                <p className="font-bold text-amber-700">{formatCurrency(mockLoanData.pendingAmount)}</p>
              </div>

              {/* Cuota mensual */}
              <div className="bg-gradient-to-br from-teal-50 to-teal-50/50 rounded-lg p-3 border border-teal-200/40">
                <p className="text-xs text-foreground/60 font-medium mb-1">Cuota mensual</p>
                <p className="font-bold text-teal-700">{formatCurrency(mockLoanData.monthlyPayment)}</p>
              </div>

              {/* Cuotas restantes */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-50/50 rounded-lg p-3 border border-blue-200/40">
                <p className="text-xs text-foreground/60 font-medium mb-1">Cuotas restantes</p>
                <p className="font-bold text-blue-700">{mockLoanData.remainingInstallments} de {mockLoanData.totalInstallments}</p>
              </div>
            </div>

            {/* Próximo pago destacado */}
            {nextQuota && (
              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-lg p-4 border border-amber-200/50">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <Clock className="h-5 w-5 text-amber-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-amber-700/70 font-medium">Próximo pago</p>
                      <p className="text-sm md:text-base font-semibold text-amber-900 truncate">Cuota {nextQuota.number} • {nextQuota.date}</p>
                    </div>
                  </div>
                  <p className="font-bold text-amber-700 text-lg flex-shrink-0">{formatCurrency(nextQuota.amount)}</p>
                </div>
              </div>
            )}

            {/* Más detalles (expandible) */}
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer py-2 text-sm font-medium text-foreground hover:text-teal-600 transition-colors">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Ver cronograma de cuotas
                </span>
                <ChevronRight className="h-4 w-4 group-open:rotate-90 transition-transform" />
              </summary>
              <div className="pt-3 space-y-2 border-t border-teal-100/50 mt-3">
                {mockLoanData.quotas.map((quota) => (
                  <div key={quota.number} className="flex items-center justify-between p-2 rounded hover:bg-teal-50/50 transition-colors">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {quota.paid ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <Clock className="h-4 w-4 text-amber-500 flex-shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className={`text-xs font-semibold ${quota.paid ? "text-emerald-700" : "text-foreground"}`}>
                          Cuota {quota.number}
                        </p>
                        <p className="text-[10px] text-foreground/50">{quota.date}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-bold flex-shrink-0 ${quota.paid ? "text-emerald-700" : "text-amber-700"}`}>
                      {formatCurrency(quota.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </details>
          </CardContent>
        </Card>

        {/* Sección de nuevas solicitudes (sin cambios, solo spacing coherente) */}
        <div className="space-y-3 mt-6">
          <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wide px-1">Puedes seguir solicitando</p>
          
          <Card className="border-teal-200/50 rounded-2xl overflow-hidden">
            <CardContent className="p-4">
              <Link href="/">
                <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold h-10 rounded-xl gap-2">
                  <span>Ir al inicio</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Nota informativa */}
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-center mt-6">
          <p className="text-xs text-teal-700 font-medium leading-relaxed">
            ✓ Una vez completadas tus {mockLoanData.totalInstallments} cuotas, podrás acceder nuevamente a nuestras ofertas preaprobadas.
          </p>
        </div>
      </div>

      <AppFooter />
    </div>
  )
}
