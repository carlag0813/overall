"use client"

import { useState } from "react"
import { ChevronUp, ChevronDown, CheckCircle2, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { UserHeader } from "@/components/user-header"
import { ProductCards } from "@/components/product-cards"
import { AppFooter } from "@/components/app-footer"

const mockUser = {
  name: "Carlos Mendoza",
  employeeId: "EMP-2024-0847",
  netSalary: 2500,
  seniority: 8,
  hasActiveLoan: true,
  legalDeductions: 150,
  judicialDeductions: 250,
  thirdPartyDeductions: 100,
  projectedLBS: 580,
  recentRequestCount: 2,
  bankAccount: "BCP ****1234",
  activeLoans: [
    { description: "Préstamo Personal #1247", amount: 850 },
    { description: "Adelanto Mayo 2024", amount: 200 },
  ],
  accumulatedNet: [
    { description: "Días trabajados (15)", amount: 2100 },
    { description: "Horas extra", amount: 380 },
    { description: "Bonificación", amount: 280 },
  ],
}

const mockLoanData = {
  id: "PR-2024-001",
  totalLoanAmount: 1575,
  pendingAmount: 525,
  remainingInstallments: 3,
  totalInstallments: 6,
  monthlyPayment: 262.5,
  nextPaymentDate: "15 Feb 2026",
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

function ActiveLoanCard() {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const progressPercentage = ((mockLoanData.totalInstallments - mockLoanData.remainingInstallments) / mockLoanData.totalInstallments) * 100
  const nextQuota = mockLoanData.quotas.find((q) => !q.paid)

  return (
    <Card className="border-teal-200/50 shadow-md rounded-2xl overflow-hidden mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 md:px-6 py-4 flex items-start justify-between hover:bg-teal-50/30 transition-colors"
      >
        <div className="flex items-start gap-3 flex-1 text-left">
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
        <div className="flex items-center gap-3 flex-shrink-0 ml-3">
          <div className="text-right">
            <p className="text-xs text-foreground/60 mb-1">Progreso</p>
            <p className="text-xl font-bold text-teal-600">{progressPercentage.toFixed(0)}%</p>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-teal-600" />
          ) : (
            <ChevronDown className="h-5 w-5 text-teal-600" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-teal-100/50 px-4 md:px-6 py-4 space-y-4">
          {/* Barra de progreso */}
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

          {/* ID de operación */}
          <div className="text-xs text-foreground/50 text-center pt-2 border-t border-teal-100/50">
            ID: {mockLoanData.id}
          </div>
        </div>
      )}
    </Card>
  )
}

export default function PrestamoVigentePage() {
  const calculateAvailableAmount = (basePercentage: number) => {
    const maxFromSalary = mockUser.netSalary * basePercentage
    const totalDeductions = mockUser.legalDeductions + mockUser.judicialDeductions + mockUser.thirdPartyDeductions
    const availableBase = mockUser.netSalary - totalDeductions
    const available = Math.min(maxFromSalary, availableBase)
    return Math.min(Math.max(0, available), mockUser.netSalary * 0.5)
  }

  const salaryAdvanceAmount = calculateAvailableAmount(0.5)
  const personalLoanAmount = calculateAvailableAmount(0.5)
  const unreadNotifications = 2

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <UserHeader 
        userName={mockUser.name} 
        employeeId={mockUser.employeeId} 
        unreadNotifications={unreadNotifications}
        className="animate-in fade-in slide-in-from-top-4 duration-700"
      />

      <main className="flex-1 px-4 py-5 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 flex flex-col overflow-y-auto max-h-[calc(100vh-120px)] space-y-6">
        {/* Card de Operación Activa (Expandible) */}
        <div>
          <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wide px-1 mb-2">Tu préstamo activo</p>
          <ActiveLoanCard />
        </div>

        {/* Cards de Acceso (Igual al HOME) */}
        <ProductCards
          salaryAdvanceAmount={salaryAdvanceAmount}
          personalLoanAmount={personalLoanAmount}
          netSalary={mockUser.netSalary}
          legalDeductions={mockUser.legalDeductions}
          judicialDeductions={mockUser.judicialDeductions}
          thirdPartyDeductions={mockUser.thirdPartyDeductions}
        />
      </main>

      <AppFooter />
    </div>
  )
}
