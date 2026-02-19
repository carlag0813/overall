"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
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
    title: "Préstamos sin complicaciones",
    description: "Acceso a crédito rápido con tasas competitivas. Simula y obtén tu dinero en minutos.",
    image: "https://images.unsplash.com/photo-1579621970563-ebec5855cfb3?w=400&h=400&fit=crop",
  },
  {
    id: 2,
    title: "Adelanta tu salario",
    description: "No esperes hasta fin de mes. Accede a parte de tu salario cuando lo necesites.",
    image: "https://images.unsplash.com/photo-1533995405776-24667b8c5f0a?w=400&h=400&fit=crop",
  },
  {
    id: 3,
    title: "Gestiona tus finanzas",
    description: "Visualiza todas tus operaciones en un solo lugar. Control total de tus créditos.",
    image: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=400&h=400&fit=crop",
  },
]

export function HomeBannerCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [autoSlide, setAutoSlide] = useState(true)

  useEffect(() => {
    if (!autoSlide) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoSlide])

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
    setAutoSlide(false)
  }

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
    setAutoSlide(false)
  }

  const banner = banners[currentSlide]

  return (
    <section className="w-full">
      <div className="bg-gradient-to-br from-primary/5 to-primary/2 rounded-2xl overflow-hidden shadow-lg">
        <div className="flex items-center justify-between h-32 md:h-40 px-4 md:px-6 gap-4">
          {/* Imagen a la izquierda */}
          <div className="flex-shrink-0 w-28 h-28 md:w-32 md:h-32 rounded-xl overflow-hidden bg-primary/10">
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Contenido a la derecha */}
          <div className="flex-1 flex flex-col justify-between h-full py-2">
            <div>
              <h3 className="font-bold text-base md:text-lg text-foreground line-clamp-2 leading-tight">
                {banner.title}
              </h3>
              <p className="text-xs md:text-sm text-foreground/70 line-clamp-2 mt-1">
                {banner.description}
              </p>
            </div>

            {/* Indicadores y botones */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex gap-1.5">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentSlide(index)
                      setAutoSlide(false)
                    }}
                    className={`h-1.5 rounded-full transition-all ${
                      index === currentSlide
                        ? "bg-primary w-4"
                        : "bg-primary/30 w-1.5"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              <div className="flex gap-1">
                <button
                  onClick={handlePrev}
                  className="p-1 hover:bg-primary/10 rounded-lg transition-colors"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="h-4 w-4 text-primary" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-1 hover:bg-primary/10 rounded-lg transition-colors"
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
