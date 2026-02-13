"use client"

import { CreditCard, Calendar, AlertCircle, ArrowLeft, Banknote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ActiveLoanBlockBannerProps {
  onDismiss: () => void
  pendingAmount?: number
  remainingInstallments?: number
  totalLoanAmount?: number
}

export function ActiveLoanBlockBanner({
  onDismiss,
  pendingAmount = 1050,
  remainingInstallments = 4,
  totalLoanAmount = 3150,
}: ActiveLoanBlockBannerProps) {
  return (
    <div className="px-4 py-6 space-y-4">
      {/* Botón volver */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onDismiss}
        className="text-muted-foreground hover:text-foreground -ml-2 font-medium"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver al inicio
      </Button>

      <Card className="border-warning/30 bg-warning/5">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-warning/10 rounded-full shrink-0">
              <CreditCard className="h-6 w-6 text-warning" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-foreground text-lg">Operación en curso</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Tienes una operación en curso. Podrás solicitar una nueva al finalizar tus cuotas pendientes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumen del préstamo vigente */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-2 text-foreground">
            <AlertCircle className="h-5 w-5 text-primary" />
            <h4 className="font-semibold">Resumen de tu préstamo</h4>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <CreditCard className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground font-medium">Saldo pendiente</span>
              </div>
              <span className="font-bold text-foreground">S/ {pendingAmount.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground font-medium">Cuotas restantes</span>
              </div>
              <span className="font-bold text-foreground">{remainingInstallments} cuotas</span>
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="space-y-3 pt-3 border-t border-border">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span className="font-medium">Progreso de pago</span>
              <span className="font-semibold">66% completado</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-primary rounded-full" />
            </div>

            {/* Total destacado */}
            <div className="flex items-center justify-between bg-primary/5 rounded-lg p-3 mt-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Banknote className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Total del préstamo</span>
              </div>
              <span className="text-lg font-bold text-primary">S/ {totalLoanAmount.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nota informativa */}
      <p className="text-xs text-muted-foreground text-center px-4">
        Una vez completadas tus cuotas pendientes, podrás acceder nuevamente a las ofertas preaprobadas.
      </p>
    </div>
  )
}
