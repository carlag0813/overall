"use client"

import React from "react"
import { useState, useEffect } from "react"
import { ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"

interface OnboardingSlide {
  id: number
  title: string
  subtitle: string
  description: string
  image: string
  gradient: string
  buttonText: string
}

const slides: OnboardingSlide[] = [
  {
    id: 1,
    title: "¡Bienvenido/a!",
    subtitle: "Tu plataforma de crédito flexible",
    description: "Acceso a crédito inmediato. Rápido, seguro y 100% digital.",
    image: "/images/carrusel1.png",
    gradient: "from-[#6B5AE8] via-[#5B4A9F] to-[#4B3A8F]",
    buttonText: "Siguiente",
  },
  {
    id: 2,
    title: "Préstamo Descuento de Planilla",
    subtitle: "Simula tus montos y cuotas",
    description: "Sin aprobadores ni esperas. Recibe tu dinero de inmediato.",
    image: "/images/carrusel2.png",
    gradient: "from-[#D97706] via-[#F59E0B] to-[#FFF1B9]",
    buttonText: "Siguiente",
  },
  {
    id: 3,
    title: "Adelanto de Salario",
    subtitle: "Adelanta hasta 50% del salario",
    description: "Sin aprobadores. Solo firmas tú. Recibe tu dinero de inmediato.",
    image: "/images/carrusel3.png",
    gradient: "from-[#7FE5DE] via-[#5FD5D0] to-[#2FC9BD]",
    buttonText: "Comenzar",
  },
]

export function OnboardingCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Solo mostrar carrusel en la página home
    if (pathname !== "/") return

    // Verificar si es la primera carga del onboarding
    const onboardingCompleted = sessionStorage.getItem("onboarding-completed-session")
    
    if (!onboardingCompleted) {
      const timer = setTimeout(() => {
        setHasSeenOnboarding(false)
        setIsVisible(true)
      }, 2700)

      return () => clearTimeout(timer)
    }
  }, [pathname])

  const handleSlideChange = (newSlide: number) => {
    if (isTransitioning) return
    
    setIsTransitioning(true)
    requestAnimationFrame(() => {
      setCurrentSlide(newSlide)
      setTimeout(() => {
        setIsTransitioning(false)
      }, 300)
    })
  }

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      handleSlideChange(currentSlide + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrev = () => {
    if (currentSlide > 0) {
      handleSlideChange(currentSlide - 1)
    }
  }

  const handleComplete = () => {
    setIsTransitioning(true)
    requestAnimationFrame(() => {
      setTimeout(() => {
        setIsVisible(false)
        sessionStorage.setItem("onboarding-completed-session", "true")
        window.dispatchEvent(new Event("onboarding-complete"))
        // Navegar al home después de cerrar el onboarding
        router.push("/")
      }, 300)
    })
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    setTouchEnd(e.changedTouches[0].clientX)
    handleSwipe()
  }

  const handleSwipe = () => {
    const swipeThreshold = 50
    const difference = touchStart - touchEnd
    
    // Swipe hacia la izquierda (dedo va a la izquierda) = avanzar
    if (difference > swipeThreshold) {
      handleNext()
    }
    
    // Swipe hacia la derecha (dedo va a la derecha) = retroceder
    if (difference < -swipeThreshold) {
      handlePrev()
    }
    
    // Reset de valores de touch
    setTouchStart(0)
    setTouchEnd(0)
  }

  if (!isVisible || hasSeenOnboarding) return null

  const slide = slides[currentSlide]

  return (
    <div
      className="fixed inset-0 z-40 overflow-hidden"
      style={{
        backgroundImage: `url('${slide.image}')`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#1f2937',
        backfaceVisibility: "hidden",
        WebkitBackgroundSize: 'contain',
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Overlay oscuro muy sutil - solo para mejorar contraste de textos */}
      <div className="absolute inset-0 bg-black/5" style={{backfaceVisibility: "hidden"}} />

      {/* Contenido pantalla completa - Estructura optimizada para mobile */}
      <div 
        className="relative h-screen w-screen flex flex-col"
        style={{
          backfaceVisibility: "hidden",
        }}
      >
        {/* Contenido dinámico que cambia según el slide */}
        <div className="flex-1 flex flex-col p-6 overflow-hidden">
          {/* Slide 1: Contenido centrado */}
          {currentSlide === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center gap-8">
              <div className={`text-center text-white space-y-4 max-w-md mx-auto ${
                isTransitioning ? "opacity-0 scale-95 translate-y-8" : "opacity-100 scale-100 translate-y-0"
              }`}
              style={{
                transition: "opacity 600ms cubic-bezier(0.34, 1.56, 0.64, 1), transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                backfaceVisibility: "hidden",
                transform: "translateZ(0)"
              }}>
                <h1 className="text-4xl font-bold leading-tight text-balance animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                  ¡Bienvenido/a!
                </h1>
                <div className="space-y-2 text-white/90">
                  <p className="text-base font-medium animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">Tu plataforma de crédito flexible.</p>
                  <p className="text-base font-medium animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">Acceso a crédito inmediato.</p>
                  <p className="text-base font-medium animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">Rápido, seguro y 100% digital.</p>
                </div>
              </div>

              {/* Botones de navegación para slide 1 */}
              <div className="flex items-center justify-center mt-6">
                <Button
                  onClick={handleNext}
                  disabled={isTransitioning}
                  className="rounded-full text-white bg-white/20 hover:bg-white/30 disabled:opacity-20 disabled:cursor-not-allowed h-12 w-12"
                  style={{
                    transition: "background-color 200ms cubic-bezier(0.4, 0, 0.2, 1)",
                    backfaceVisibility: "hidden"
                  }}
                >
                  <ChevronRight className="w-7 h-7" />
                </Button>
              </div>
            </div>
          )}

          {/* Slide 2: Contenido desde el centro hacia arriba */}
          {currentSlide === 1 && (
            <div className="flex flex-col items-center justify-start gap-8 pt-12">
              <div className={`text-center text-white space-y-4 max-w-md mx-auto ${
                isTransitioning ? "opacity-0 scale-95 translate-y-8" : "opacity-100 scale-100 translate-y-0"
              }`}
              style={{
                transition: "opacity 600ms cubic-bezier(0.34, 1.56, 0.64, 1), transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                backfaceVisibility: "hidden",
                transform: "translateZ(0)"
              }}>
                <h1 className="text-3xl font-bold leading-tight text-balance text-amber-800 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                  Préstamo Descuento de Planilla
                </h1>
                <div className="space-y-2 text-left text-amber-800">
                  <p className="text-sm font-medium animate-in fade-in slide-in-from-left-8 duration-700 delay-200">Simula tus montos y cuotas.</p>
                  <p className="text-sm font-medium animate-in fade-in slide-in-from-left-8 duration-700 delay-300">Sin aprobadores ni esperas.</p>
                  <p className="text-sm font-medium animate-in fade-in slide-in-from-left-8 duration-700 delay-400">Recibe tu dinero de inmediato.</p>
                </div>
              </div>

              {/* Botones de navegación para slide 2 */}
              <div className="flex items-center justify-center mt-6">
                <Button
                  onClick={handleNext}
                  disabled={isTransitioning}
                  className="rounded-full text-white bg-white/20 hover:bg-white/30 disabled:opacity-20 disabled:cursor-not-allowed h-12 w-12"
                  style={{
                    transition: "background-color 200ms cubic-bezier(0.4, 0, 0.2, 1)",
                    backfaceVisibility: "hidden"
                  }}
                >
                  <ChevronRight className="w-7 h-7" />
                </Button>
              </div>
            </div>
          )}

          {/* Slide 3: Contenido desde el centro hacia abajo */}
          {currentSlide === 2 && (
            <div className="flex-1 flex flex-col items-center justify-end gap-8 pb-4">
              <div className={`text-center text-white space-y-4 max-w-md mx-auto ${
                isTransitioning ? "opacity-0 scale-95 translate-y-8" : "opacity-100 scale-100 translate-y-0"
              }`}
              style={{
                transition: "opacity 600ms cubic-bezier(0.34, 1.56, 0.64, 1), transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                backfaceVisibility: "hidden",
                transform: "translateZ(0)"
              }}>
                <h1 className="text-3xl font-bold leading-tight text-balance text-white animate-in fade-in slide-in-from-top-4 duration-700 delay-100">
                  Adelanto de Salario
                </h1>
                <div className="space-y-2 text-left text-white/90">
                  <p className="text-sm font-medium animate-in fade-in slide-in-from-right-8 duration-700 delay-200">Adelanta hasta 50% del salario.</p>
                  <p className="text-sm font-medium animate-in fade-in slide-in-from-right-8 duration-700 delay-300">Sin aprobadores. Solo firmas tú.</p>
                  <p className="text-sm font-medium animate-in fade-in slide-in-from-right-8 duration-700 delay-400">Recibe tu dinero de inmediato.</p>
                </div>
              </div>

              {/* Botón solo en el 3er slide */}
              <Button
                onClick={handleComplete}
                disabled={isTransitioning}
                className="bg-white text-primary font-bold py-3 px-6 rounded-full text-base hover:bg-white/95 shadow-lg hover:shadow-xl disabled:opacity-50 w-auto"
                style={{
                  transition: "background-color 200ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1)",
                  backfaceVisibility: "hidden"
                }}
              >
                ¡Entendido!
              </Button>
            </div>
          )}
        </div>

        {/* Rayitas indicadoras - SIEMPRE al final de la pantalla */}
        <div className="px-6 pb-8 flex gap-1.5">
          {slides.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 flex-1 rounded-full ${
                idx === currentSlide ? "bg-white" : "bg-white/30"
              }`}
              style={{
                transition: "background-color 300ms cubic-bezier(0.4, 0, 0.2, 1)",
                backfaceVisibility: "hidden"
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
