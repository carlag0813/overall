"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export function AppLoader() {
  const [isVisible, setIsVisible] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Solo mostrar loader en la página home
    if (pathname !== "/") return

    // Limpiar el sessionStorage para que siempre se muestre el onboarding
    sessionStorage.removeItem("onboarding-completed-session")
    
    setIsVisible(true)
    
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [pathname])

  if (!isVisible) return null

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-white z-50 pointer-events-none ${
        isVisible ? "animate-in fade-in duration-300" : "animate-out fade-out duration-300"
      }`}
      style={{
        opacity: isVisible ? 1 : 0,
        transition: "opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)"
      }}
    >
      <div className="flex flex-col items-center justify-center gap-6 will-change-transform">
        {/* Logo animado - optimizado */}
        <div className="relative w-20 h-20">
          {/* Círculo externo */}
          <div 
            className="absolute inset-0 rounded-full border-4 border-primary/20" 
            style={{ 
              animation: "spin 3s linear infinite",
              backfaceVisibility: "hidden",
              transform: "translateZ(0)"
            }} 
          />
          
          {/* Círculo medio */}
          <div
            className="absolute inset-2 rounded-full border-4 border-transparent border-t-primary border-r-primary"
            style={{ 
              animation: "spin 2s linear infinite reverse",
              backfaceVisibility: "hidden",
              transform: "translateZ(0)"
            }}
          />
          
          {/* Círculo central */}
          <div className="absolute inset-4 rounded-full bg-primary/10 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-primary" style={{
              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              backfaceVisibility: "hidden"
            }} />
          </div>
        </div>

        {/* Texto */}
        <div className="flex flex-col items-center gap-1">
          <h2 className="text-lg font-semibold text-primary">Cargando</h2>
          <p className="text-xs text-muted-foreground">Overall - Mi Oferta Preaprobada</p>
        </div>

        {/* Barra de progreso - optimizada */}
        <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full"
            style={{
              animation: "expandWidth 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards",
              backfaceVisibility: "hidden",
              transform: "translateZ(0)"
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes expandWidth {
          0% {
            width: 0%;
            transform: translateZ(0);
          }
          100% {
            width: 100%;
            transform: translateZ(0);
          }
        }
        @keyframes spin {
          from {
            transform: rotate(0deg) translateZ(0);
          }
          to {
            transform: rotate(360deg) translateZ(0);
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1) translateZ(0);
          }
          50% {
            opacity: 0.5;
            transform: scale(0.95) translateZ(0);
          }
        }
      `}</style>
    </div>
  )
}
