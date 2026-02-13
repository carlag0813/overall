"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface AccountSummaryProps {
  pendingPayment: number
  pendingReceivable: number
  activeLoans?: { description: string; amount: number }[]
  accumulatedNet?: { description: string; amount: number }[]
}

export function AccountSummary({
  pendingPayment,
  pendingReceivable,
  activeLoans = [],
  accumulatedNet = [],
}: AccountSummaryProps) {
  const [showPaymentDetails, setShowPaymentDetails] = useState(false)
  const [showReceivableDetails, setShowReceivableDetails] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(amount)
  }

  return (
    <section className="mt-4 mb-4 space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[750ms]">
      {/* Pending Payment Card */}
      
    </section>
  )
}
