"use client"

import { useState } from "react"
import { ArrowLeft, CheckCircle2, XCircle, AlertTriangle, Clock, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface Notification {
  id: string
  type: "success" | "error" | "rejected" | "pending"
  title: string
  message: string
  date: string
  time: string
  isRead: boolean
  details?: {
    amount?: number
    reference?: string
    account?: string
  }
}

interface NotificationsViewProps {
  onBack: () => void
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
}

export function NotificationsView({ onBack, notifications, onMarkAsRead }: NotificationsViewProps) {
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-6 w-6 text-emerald-500" />
      case "error":
        return <XCircle className="h-6 w-6 text-destructive" />
      case "rejected":
        return <AlertTriangle className="h-6 w-6 text-amber-500" />
      case "pending":
        return <Clock className="h-6 w-6 text-primary" />
    }
  }

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "bg-emerald-50 border-emerald-200"
      case "error":
        return "bg-red-50 border-red-200"
      case "rejected":
        return "bg-amber-50 border-amber-200"
      case "pending":
        return "bg-blue-50 border-blue-200"
    }
  }

  const getStatusLabel = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return { text: "Exitosa", color: "bg-emerald-100 text-emerald-700" }
      case "error":
        return { text: "Fallida", color: "bg-red-100 text-red-700" }
      case "rejected":
        return { text: "Rechazada", color: "bg-amber-100 text-amber-700" }
      case "pending":
        return { text: "En proceso", color: "bg-blue-100 text-blue-700" }
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification)
    if (!notification.isRead) {
      onMarkAsRead(notification.id)
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  // Vista de detalle de notificación
  if (selectedNotification) {
    const status = getStatusLabel(selectedNotification.type)
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-primary px-4 pt-12 pb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => setSelectedNotification(null)}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-primary-foreground font-semibold text-lg">Detalle de notificación</h1>
          </div>
        </header>

        <main className="px-4 py-6">
          <Card className={`border ${getNotificationColor(selectedNotification.type)}`}>
            <CardContent className="p-5">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 rounded-full bg-background">{getNotificationIcon(selectedNotification.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${status.color}`}>
                      {status.text}
                    </span>
                  </div>
                  <h2 className="font-semibold text-foreground text-lg">{selectedNotification.title}</h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    {selectedNotification.date} • {selectedNotification.time}
                  </p>
                </div>
              </div>

              <div className="border-t border-border pt-4 mt-4">
                <p className="text-foreground leading-relaxed">{selectedNotification.message}</p>
              </div>

              {selectedNotification.details && (
                <div className="border-t border-border pt-4 mt-4 space-y-3">
                  <h3 className="font-medium text-foreground text-sm">Detalles de la operación</h3>
                  {selectedNotification.details.amount && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Monto</span>
                      <span className="font-semibold text-foreground">
                        S/ {selectedNotification.details.amount.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {selectedNotification.details.reference && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Referencia</span>
                      <span className="font-mono text-foreground">{selectedNotification.details.reference}</span>
                    </div>
                  )}
                  {selectedNotification.details.account && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Cuenta destino</span>
                      <span className="text-foreground">{selectedNotification.details.account}</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {selectedNotification.type === "error" && (
            <Card className="mt-4 border-muted">
              <CardContent className="p-4">
                <h3 className="font-medium text-foreground text-sm mb-2">¿Necesitas ayuda?</h3>
                <p className="text-muted-foreground text-sm">
                  Si el problema persiste, por favor contacta a soporte técnico o intenta nuevamente más tarde.
                </p>
                <Button variant="outline" className="w-full mt-3 bg-transparent" size="sm">
                  Contactar soporte
                </Button>
              </CardContent>
            </Card>
          )}

          {selectedNotification.type === "rejected" && (
            <Card className="mt-4 border-muted">
              <CardContent className="p-4">
                <h3 className="font-medium text-foreground text-sm mb-2">¿Tienes dudas sobre el rechazo?</h3>
                <p className="text-muted-foreground text-sm">
                  Puedes comunicarte con RRHH para conocer más detalles sobre esta decisión.
                </p>
                <a href="mailto:rrhh@overall.com" className="block mt-3">
                  <Button variant="outline" className="w-full bg-transparent" size="sm">
                    Escribir a RRHH
                  </Button>
                </a>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    )
  }

  // Vista de lista de notificaciones
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary px-4 pt-12 pb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/10"
            onClick={onBack}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex-1">
            <h1 className="text-primary-foreground font-semibold text-lg">Notificaciones</h1>
            {unreadCount > 0 && <p className="text-primary-foreground/70 text-sm">{unreadCount} sin leer</p>}
          </div>
        </div>
      </header>

      <main className="px-4 py-4">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="font-medium text-foreground mb-1">Sin notificaciones</h2>
            <p className="text-muted-foreground text-sm">No tienes notificaciones por el momento</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const status = getStatusLabel(notification.type)
              return (
                <Card
                  key={notification.id}
                  className={`border cursor-pointer transition-all hover:shadow-md ${
                    !notification.isRead ? "border-primary/30 bg-primary/5" : "border-border"
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="shrink-0">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${status.color}`}>
                            {status.text}
                          </span>
                          {!notification.isRead && <span className="w-2 h-2 bg-primary rounded-full" />}
                        </div>
                        <h3 className="font-medium text-foreground text-sm truncate">{notification.title}</h3>
                        <p className="text-muted-foreground text-xs mt-0.5 line-clamp-2">{notification.message}</p>
                        <p className="text-muted-foreground/70 text-xs mt-2">
                          {notification.date} • {notification.time}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
