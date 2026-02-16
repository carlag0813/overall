"use client"

import { useState, useEffect } from "react"
import { useScrollToTop } from "@/hooks/use-scroll-to-top"
import { UserHeader } from "@/components/user-header"
import { AccountSummary } from "@/components/account-summary"
import { ProductCards } from "@/components/product-cards"
import { IneligibleModal } from "@/components/ineligible-modal"
import { AppFooter } from "@/components/app-footer"

const mockUser = {
  name: "Carlos Mendoza",
  employeeId: "EMP-2024-0847",
  netSalary: 1200,
  seniority: 8,
  hasActiveLoan: false,
  legalDeductions: 80,
  judicialDeductions: 150,
  thirdPartyDeductions: 50,
  projectedLBS: 280,
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

export default function PreApprovedOfferPage() {
  useScrollToTop()
  const [showIneligibleModal, setShowIneligibleModal] = useState(false)
  const [ineligibleReason, setIneligibleReason] = useState<"active_loan" | "insufficient_seniority">("active_loan")
  const [showContent, setShowContent] = useState(true)

  useEffect(() => {
    // Verificar si el onboarding ya fue completado en esta sesión
    const onboardingCompleted = sessionStorage.getItem("onboarding-completed-session")
    
    if (onboardingCompleted) {
      setShowContent(true)
    }

    const handleOnboardingComplete = () => {
      setShowContent(true)
    }

    window.addEventListener("onboarding-complete", handleOnboardingComplete)
    return () => window.removeEventListener("onboarding-complete", handleOnboardingComplete)
  }, [])

  const calculateAvailableAmount = (basePercentage: number) => {
    const maxFromSalary = mockUser.netSalary * basePercentage
    const totalDeductions = mockUser.legalDeductions + mockUser.judicialDeductions + mockUser.thirdPartyDeductions
    const availableBase = mockUser.netSalary - totalDeductions
    const available = Math.min(maxFromSalary, availableBase)
    return Math.min(Math.max(0, available), mockUser.netSalary * 0.5)
  }

  const salaryAdvanceAmount = calculateAvailableAmount(0.5)
  const personalLoanAmount = calculateAvailableAmount(0.5)

  const pendingPayment = mockUser.activeLoans.reduce((sum, loan) => sum + loan.amount, 0)
  const pendingReceivable = mockUser.accumulatedNet.reduce((sum, item) => sum + item.amount, 0)

  // Contador de notificaciones no leídas (valor estático para demo)
  const unreadNotifications = 2

  return (
    <div className="min-h-screen bg-background">
      <UserHeader 
        userName={mockUser.name} 
        employeeId={mockUser.employeeId} 
        unreadNotifications={unreadNotifications}
        className={showContent ? "animate-in fade-in slide-in-from-top-4 duration-700" : "hidden"}
      />

      <main className={`px-4 pb-8 ${showContent ? "animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150" : "hidden"}`}>
        <ProductCards
          salaryAdvanceAmount={salaryAdvanceAmount}
          personalLoanAmount={personalLoanAmount}
          netSalary={mockUser.netSalary}
          legalDeductions={mockUser.legalDeductions}
          judicialDeductions={mockUser.judicialDeductions}
          thirdPartyDeductions={mockUser.thirdPartyDeductions}
        />

        <AccountSummary
          pendingPayment={pendingPayment}
          pendingReceivable={pendingReceivable}
          activeLoans={mockUser.activeLoans}
          accumulatedNet={mockUser.accumulatedNet}
        />
      </main>

      <IneligibleModal
        isOpen={showIneligibleModal}
        onClose={() => setShowIneligibleModal(false)}
        reason={ineligibleReason}
      />

      <AppFooter />
    </div>
  )
}
