"use client"

import type React from "react"
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Banknote,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  FileText,
  Receipt,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Filter,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { AppFooter } from "@/components/app-footer"

type OperationStatus = "activo" | "pagado" | "solicitado" | "en_proceso"
type ProductType = "prestamo" | "adelanto"

interface Operation {
  id: string
  type: ProductType
  amount: number
  balancePending: number
  requestDate: string
  status: OperationStatus
  term?: number
  currentQuota?: number
  nextPaymentDate?: string
  nextPaymentAmount?: number
  nextQuincena?: "1ª" | "2ª"
  interestRate: number
  commission: number
  igv: number
  totalInterest: number
  disbursementDate?: string
  completionDate?: string
  quotas?: Array<{
    number: number
    date: string
    amount: number
    paid: boolean
  }>
}

const mockOperations: Operation[] = [
  {
    id: "OP-2024-001",
    type: "prestamo",
    amount: 3500,
    balancePending: 1200,
    requestDate: "2024-01-10",
    status: "activo",
    term: 6,
    currentQuota: 4,
    nextPaymentDate: "2024-02-10",
    nextPaymentAmount: 650,
    interestRate: 1.0,
    commission: 70,
    igv: 12.6,
    totalInterest: 105,
    disbursementDate: "2024-01-12",
    completionDate: "2024-06-10",
    quotas: [
      { number: 1, date: "2024-01-10", amount: 650, paid: true },
      { number: 2, date: "2024-02-10", amount: 650, paid: true },
      { number: 3, date: "2024-03-10", amount: 650, paid: true },
      { number: 4, date: "2024-04-10", amount: 650, paid: false },
      { number: 5, date: "2024-05-10", amount: 650, paid: false },
      { number: 6, date: "2024-06-10", amount: 650, paid: false },
    ],
  },
  {
    id: "OP-2024-002",
    type: "adelanto",
    amount: 1200,
    balancePending: 0,
    requestDate: "2024-01-05",
    status: "pagado",
    nextPaymentAmount: 0,
    nextPaymentDate: "2024-01-15",
    nextQuincena: "1ª",
    interestRate: 0,
    commission: 18,
    igv: 3.24,
    totalInterest: 0,
    disbursementDate: "2024-01-05",
    completionDate: "2024-01-15",
  },
  {
    id: "OP-2023-015",
    type: "prestamo",
    amount: 2800,
    balancePending: 0,
    requestDate: "2023-11-20",
    status: "pagado",
    term: 4,
    interestRate: 1.0,
    commission: 56,
    igv: 10.08,
    totalInterest: 56,
    disbursementDate: "2023-11-22",
    completionDate: "2024-03-22",
    quotas: [
      { number: 1, date: "2024-11-22", amount: 700, paid: true },
      { number: 2, date: "2023-12-22", amount: 700, paid: true },
      { number: 3, date: "2024-01-22", amount: 700, paid: true },
      { number: 4, date: "2024-02-22", amount: 700, paid: true },
    ],
  },
  {
    id: "OP-2023-014",
    type: "adelanto",
    amount: 800,
    balancePending: 800,
    requestDate: "2023-10-28",
    status: "solicitado",
    nextPaymentAmount: 800,
    nextPaymentDate: "2023-11-15",
    nextQuincena: "2ª",
    interestRate: 0,
    commission: 12,
    igv: 2.16,
    totalInterest: 0,
  },
]

const statusConfig: Record<OperationStatus, { label: string; color: string; icon: React.ReactNode }> = {
  activo: {
    label: "Activo",
    color: "bg-teal-100 text-teal-700 border-teal-200",
    icon: <AlertCircle className="h-2.5 w-2.5" />,
  },
  pagado: {
    label: "Pagado",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: <CheckCircle2 className="h-2.5 w-2.5" />,
  },
  solicitado: {
    label: "Solicitado",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: <Clock className="h-2.5 w-2.5" />,
  },
  en_proceso: {
    label: "En proceso",
    color: "bg-amber-50 text-amber-600 border-amber-300",
    icon: <AlertCircle className="h-2.5 w-2.5" />,
  },
}

function formatCurrency(amount: number): string {
  return `S/ ${amount.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

const ITEMS_PER_PAGE = 5

export default function MiHistorialPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [filterStatus, setFilterStatus] = useState<"activo" | "pagado" | "solicitado">("activo")
  const [filterProduct, setFilterProduct] = useState<"todos" | "prestamo" | "adelanto">("todos")

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const filteredOperations = mockOperations
    .filter((op) => op.status === filterStatus && (filterProduct === "todos" || op.type === filterProduct))
    .sort((a, b) => {
      // Ordenar por próxima fecha de descuento para adelantos
      if (a.type === "adelanto" && b.type === "adelanto" && a.nextPaymentDate && b.nextPaymentDate) {
        return new Date(a.nextPaymentDate).getTime() - new Date(b.nextPaymentDate).getTime()
      }
      return 0
    })

  const totalPages = Math.ceil(filteredOperations.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedOperations = filteredOperations.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const goToPage = (page: number) => {
    setCurrentPage(page)
    setExpandedId(null)
  }

  const handleFilterChange = (filter: "activo" | "pagado" | "solicitado") => {
    setFilterStatus(filter)
    setCurrentPage(1)
    setExpandedId(null)
  }

  const handleProductFilterChange = (filter: "todos" | "prestamo" | "adelanto") => {
    setFilterProduct(filter)
    setCurrentPage(1)
    setExpandedId(null)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header con gradiente teal */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-teal-50 via-teal-50/80 to-amber-50/60 border-b border-teal-200/50 backdrop-blur-sm">
        <div className="px-3 py-3">
          <Link href="/" className="inline-flex items-center gap-2 mb-3 text-sm font-medium text-teal-700 hover:text-teal-800 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
          <h1 className="text-2xl font-bold text-foreground mb-1">Mis Solicitudes </h1>
          <p className="text-sm text-muted-foreground">Consulta el estado de tus operaciones</p>
        </div>
      </div>

      {/* Contenido */}
      <main className="flex-1 p-4 space-y-3">
        {/* Resumen compacto */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-border">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-muted-foreground font-medium">Total Operaciones</p>
              <p className="text-xl font-bold text-primary">{filteredOperations.length}</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-muted-foreground font-medium">Monto Total</p>
              <p className="text-xl font-bold text-primary">
                S/ {filteredOperations.reduce((acc, op) => acc + op.amount, 0).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-teal-600" />
          <div className="flex gap-1.5 flex-1">
            <Button
              variant={filterStatus === "activo" ? "default" : "outline"}
              size="sm"
              className={`h-8 text-xs flex-1 ${
                filterStatus === "activo"
                  ? "bg-teal-600 hover:bg-teal-700 text-white"
                  : "border-teal-200 text-teal-700 hover:bg-teal-50"
              }`}
              onClick={() => handleFilterChange("activo")}
            >
              Activo
            </Button>
            <Button
              variant={filterStatus === "pagado" ? "default" : "outline"}
              size="sm"
              className={`h-8 text-xs flex-1 ${
                filterStatus === "pagado"
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              }`}
              onClick={() => handleFilterChange("pagado")}
            >
              Pagado
            </Button>
            <Button
              variant={filterStatus === "solicitado" ? "default" : "outline"}
              size="sm"
              className={`h-8 text-xs flex-1 ${
                filterStatus === "solicitado"
                  ? "bg-amber-600 hover:bg-amber-700 text-white"
                  : "border-amber-200 text-amber-700 hover:bg-amber-50"
              }`}
              onClick={() => handleFilterChange("solicitado")}
            >
              Solicitudes
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {paginatedOperations.length === 0 ? (
            <Card className="border-border">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground">No hay operaciones para mostrar</p>
              </CardContent>
            </Card>
          ) : (
            paginatedOperations.map((operation) => {
              const isExpanded = expandedId === operation.id
              const status = statusConfig[operation.status]
              const isPrestamo = operation.type === "prestamo"

              return (
                <Card key={operation.id} className="border-teal-100/50 overflow-hidden hover:border-teal-200 transition-colors">
                  <CardContent className="p-0">
                    <button
                      onClick={() => toggleExpand(operation.id)}
                      className="w-full px-3 py-3 flex items-center justify-between hover:bg-teal-50/40 transition-colors"
                    >
                      <div className="flex items-start gap-3 flex-1 text-left">
                        <Banknote className={`h-5 w-5 flex-shrink-0 mt-0.5 ${isPrestamo ? "text-teal-600" : "text-amber-600"}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-foreground">
                              {isPrestamo ? "Préstamo Personal" : "Adelanto de Sueldo"}
                            </span>
                            <Badge variant="outline" className={`text-[10px] px-1.5 py-0.5 h-5 ${status.color}`}>
                              {status.label}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground space-y-0.5">
                            <p>Monto original: <span className="font-semibold text-teal-700">{formatCurrency(operation.amount)}</span></p>
                            <p>Saldo pendiente: <span className="font-semibold text-amber-700">{formatCurrency(operation.balancePending)}</span></p>
                            {!isPrestamo && operation.nextPaymentDate && (
                              <p>Se descontará: <span className="font-semibold text-amber-600">{formatCurrency(operation.nextPaymentAmount || 0)}</span> el {formatDate(operation.nextPaymentDate)}</p>
                            )}
                            {!isPrestamo && operation.nextQuincena && (
                              <p className="text-amber-600 font-semibold">Descuento en la {operation.nextQuincena} quincena</p>
                            )}
                            {isPrestamo && operation.currentQuota && operation.term && (
                              <p>Vas en la cuota <span className="font-semibold text-teal-700">{operation.currentQuota} de {operation.term}</span></p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-2">
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-teal-600" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-teal-600" />
                        )}
                      </div>
                    </button>

                    {/* Desglose expandible */}
                    {isExpanded && (
                      <div className="px-3 pb-3 pt-2 border-t border-teal-100 bg-gradient-to-b from-teal-50/30 to-amber-50/20 animate-in slide-in-from-top-2 duration-200 space-y-3">
                        {/* Próximo descuento para adelantos */}
                        {!isPrestamo && operation.nextPaymentDate && (
                          <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-300/60 rounded-lg p-3">
                            <p className="text-xs font-semibold text-amber-700 mb-2">Próximo Descuento</p>
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-lg font-bold text-amber-700">{formatCurrency(operation.nextPaymentAmount || 0)}</p>
                                <p className="text-xs text-amber-600">{formatDate(operation.nextPaymentDate)} - {operation.nextQuincena} quincena</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Cronograma de cuotas para préstamos */}
                        {isPrestamo && operation.quotas && (
                          <div className="bg-teal-50/60 rounded-lg border border-teal-200/60 p-3">
                            <p className="text-xs font-semibold text-teal-700 mb-2 uppercase tracking-wide">Cronograma de Pagos</p>
                            <div className="max-h-48 overflow-y-auto space-y-1.5">
                              {operation.quotas.map((quota) => (
                                <div key={quota.number} className="flex items-center justify-between text-xs pb-1.5 border-b border-teal-200/40 last:border-b-0">
                                  <div className="flex items-center gap-2 flex-1">
                                    {quota.paid ? (
                                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                                    ) : (
                                      <Clock className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
                                    )}
                                    <span className={`font-semibold ${quota.paid ? "text-teal-600" : "text-teal-700"}`}>
                                      Cuota {quota.number}
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    <p className={`font-semibold ${quota.paid ? "text-teal-600" : "text-teal-700"}`}>{formatCurrency(quota.amount)}</p>
                                    <p className="text-[10px] text-teal-600/70">{formatDate(quota.date)}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Desglose financiero */}
                        <div className="bg-gradient-to-br from-teal-50 to-teal-100/50 rounded-lg border border-teal-200/60 p-3">
                          <p className="text-xs font-semibold text-teal-700 mb-2 uppercase tracking-wide">Desglose Financiero</p>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                            <div className="flex justify-between">
                              <span className="text-teal-700/70">Monto solicitado</span>
                              <span className="font-medium text-teal-700">{formatCurrency(operation.amount)}</span>
                            </div>
                            {operation.totalInterest > 0 && (
                              <div className="flex justify-between">
                                <span className="text-teal-700/70">Intereses</span>
                                <span className="font-medium text-teal-700">{formatCurrency(operation.totalInterest)}</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-amber-700/70">Comisión</span>
                              <span className="font-medium text-amber-700">{formatCurrency(operation.commission)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-amber-700/70">IGV 18%</span>
                              <span className="font-medium text-amber-700">{formatCurrency(operation.igv)}</span>
                            </div>
                          </div>
                          <div className="border-t border-teal-300/50 pt-2 mt-2 flex justify-between text-sm">
                            <span className="font-semibold text-teal-700">Monto neto recibido</span>
                            <span className="font-bold text-teal-700">
                              {formatCurrency(operation.amount)}
                            </span>
                          </div>
                        </div>

                        {/* Documentos y acciones */}
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 h-8 text-xs gap-1.5 bg-transparent border-teal-200 text-teal-700 hover:bg-teal-50"
                              onClick={(e) => {
                                e.stopPropagation()
                                alert(`Descargando comprobante ${operation.id}`)
                              }}
                            >
                              <FileText className="h-3.5 w-3.5" />
                              Comprobante
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 h-8 text-xs gap-1.5 bg-transparent border-amber-200 text-amber-700 hover:bg-amber-50"
                              onClick={(e) => {
                                e.stopPropagation()
                                alert(`Descargando PDF ${operation.id}`)
                              }}
                            >
                              <FileText className="h-3.5 w-3.5" />
                              PDF
                            </Button>
                          </div>
                          <p className="text-[10px] text-teal-700/60 text-center">También te enviamos a tu correo la factura, cronograma y documentos de esta operación.</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>

        {filteredOperations.length > 0 && (
          <div className="flex items-center justify-between pt-3 px-3 border-t border-teal-100/50 bg-gradient-to-b from-teal-50/20 to-transparent">
            <p className="text-xs text-teal-700/70">
              {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredOperations.length)} de{" "}
              {filteredOperations.length}
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 bg-transparent border-teal-200 text-teal-600 hover:bg-teal-50 disabled:opacity-20"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  className={`h-8 w-8 p-0 text-xs ${
                    currentPage === page
                      ? "bg-teal-600 hover:bg-teal-700 text-white"
                      : "border-teal-200 text-teal-600 hover:bg-teal-50"
                  }`}
                  onClick={() => goToPage(page)}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 bg-transparent border-teal-200 text-teal-600 hover:bg-teal-50 disabled:opacity-20"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </main>

      <AppFooter />
    </div>
  )
}
