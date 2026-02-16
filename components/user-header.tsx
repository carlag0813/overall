"use client"

import { useState } from "react"
import { ChevronDown, UserX, CreditCard, Bell, Clock } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

interface UserHeaderProps {
  userName: string
  employeeId: string
  unreadNotifications?: number
  className?: string
}

export function UserHeader({ userName, employeeId, unreadNotifications = 0, className }: UserHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className={`gradient-executive px-4 pt-3 pb-6 relative animate-in fade-in slide-in-from-top-4 duration-300 ${className || ""}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo-overcash.png"
            alt="OverCash Logo"
            width={120}
            height={40}
            className="h-14 w-auto"
            priority
          />
          <div className="h-5 w-px bg-white/20" />
          <p className="text-xs text-white/80 font-medium tracking-wide">
            Respaldado por <span className="font-bold text-white">Overall</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <ChevronDown className={`h-6 w-6 transition-transform ${isMenuOpen ? "rotate-180" : ""}`} />
            </Button>

            {/* Mini menú desplegable */}
            {isMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-56 bg-card rounded-lg shadow-md border border-border z-50 overflow-hidden">
                  <div className="py-1">
                    <Link
                      href="/prestamo-vigente"
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-secondary transition-colors font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <CreditCard className="h-4 w-4 text-warning" />
                      <span>Préstamo Vigente</span>
                    </Link>
                    <Link
                      href="/bloqueo-licencia"
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-secondary transition-colors font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <UserX className="h-4 w-4 text-destructive" />
                      <span>Bloqueo por Licencia</span>
                    </Link>
                    <Link
                      href="/antiguedad-insuficiente"
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-secondary transition-colors font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Clock className="h-4 w-4 text-warning" />
                      <span>Antigüedad no cumple</span>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          <Link href="/notificaciones">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 relative">
              <Bell className="h-6 w-6" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-destructive rounded-full text-xs font-bold text-white flex items-center justify-center">
                  {unreadNotifications > 9 ? "9+" : unreadNotifications}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Avatar className="h-14 w-14 border-2 border-white/20">
          <AvatarFallback className="bg-white/10 text-white font-semibold text-lg">{initials}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-white font-semibold text-xl">{userName}</h1>
          <div className="flex gap-4 mt-1">
            <p className="text-white/60 text-xs font-medium">Cuenta: {employeeId}</p>
            <p className="text-white/60 text-xs font-medium">Banco: BCP</p>
          </div>
        </div>
      </div>
    </header>
  )
}
