"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Banner {
  id: number
  title: string
  description: string
  image: string
}

const banners: Banner[] = [
  {
    id: 1,
    title: "Préstamo Aprobado",
    description: "Acceso a crédito rápido sin complicaciones. Obtén las llaves a tu futuro en minutos.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Feb%2019%2C%202026%2C%2005_07_24%20PM-T3HT2z03L1JG0kTuhBxGAxpYCqQvTA.png",
  },
  {
    id: 2,
    title: "Tu Familia Segura",
    description: "Protege a los tuyos con crédito flexible. Adelanta salario para esos momentos importantes.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Feb%2019%2C%202026%2C%2005_12_52%20PM-eK3ydxodR9rTou2hNjHHFzHlYgX435.png",
  },
  {
    id: 3,
    title: "Confianza Generacional",
    description: "Acceso a crédito para todas las edades. Servicios financieros diseñados para ti.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Feb%2019%2C%202026%2C%2005_09_31%20PM-mkMEymimVN0hro6IYh1TVRnjUbEqCx.png",
  },
]

export function HomeBannerCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [autoSlide, setAutoSlide] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    if (!autoSlide) return

    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length)
        setIsTransitioning(false)
      }, 300)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoSlide])

  const handlePrev = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
      setIsTransitioning(false)
    }, 300)
    setAutoSlide(false)
  }

  const handleNext = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
      setIsTransitioning(false)
    }, 300)
    setAutoSlide(false)
  }

  const banner = banners[currentSlide]

  return (
    <section className="w-full">
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl overflow-hidden shadow-lg border border-primary/20">
        <div className="flex items-center justify-between h-40 md:h-48 px-4 md:px-6 gap-4">
          {/* Imagen a la izquierda con animación */}
          <div className={`flex-shrink-0 w-40 h-24 md:w-48 md:h-32 rounded-2xl overflow-hidden bg-primary/10 shadow-lg transition-all duration-300 ${
            isTransitioning ? "opacity-50 scale-95" : "opacity-100 scale-100"
          }`}>
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Contenido a la derecha con animación */}
          <div className={`flex-1 flex flex-col justify-between h-full py-3 transition-all duration-300 ${
            isTransitioning ? "opacity-30 translate-x-4" : "opacity-100 translate-x-0"
          }`}>
            <div>
              <h3 className="font-bold text-lg md:text-xl text-foreground line-clamp-2 leading-tight">
                {banner.title}
              </h3>
              <p className="text-sm md:text-base text-foreground/70 line-clamp-2 mt-2">
                {banner.description}
              </p>
            </div>

            {/* Indicadores, botón "leer más" y controles */}
            <div className="flex items-center justify-between gap-3 mt-2">
              <div className="flex gap-1.5">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setIsTransitioning(true)
                      setTimeout(() => {
                        setCurrentSlide(index)
                        setIsTransitioning(false)
                      }, 300)
                      setAutoSlide(false)
                    }}
                    className={`rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? "bg-primary w-5 h-2"
                        : "bg-primary/30 w-2 h-2"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              <Button
                size="sm"
                className="h-8 px-3 bg-primary hover:bg-primary/90 text-white font-semibold text-xs gap-1 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <span>Leer más</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>

              <div className="flex gap-1">
                <button
                  onClick={handlePrev}
                  className="p-1.5 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="h-4 w-4 text-primary" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-1.5 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
                  aria-label="Next slide"
                >
                  <ChevronRight className="h-4 w-4 text-primary" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
