'use client'

import React, { useState } from 'react'
import { AnimatedCarousel } from '@/components/animated-carousel'

/**
 * Ejemplo de uso del carrusel con imágenes de fondo
 * Este componente muestra cómo integrar el AnimatedCarousel
 * con las imágenes de fondo para cada slide
 */
export function CarouselExample() {
  const [currentStep, setCurrentStep] = useState(1)

  const carouselSteps = [
    {
      id: 'step-1',
      label: 'Selecciona tu producto',
      backgroundImage: '/images/carrusel1.png',
      content: (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Paso 1: Elige tu producto</h3>
          <p className="text-white/80 max-w-md">
            Selecciona entre nuestros productos de préstamo o adelanto de sueldo adaptados a tus necesidades.
          </p>
        </div>
      ),
    },
    {
      id: 'step-2',
      label: 'Ingresa los montos',
      backgroundImage: '/images/carrusel2.png',
      content: (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Paso 2: Define los montos</h3>
          <p className="text-white/80 max-w-md">
            Especifica cuánto dinero deseas recibir y en cuántas cuotas prefieres pagarlo.
          </p>
        </div>
      ),
    },
    {
      id: 'step-3',
      label: 'Confirma y solicita',
      backgroundImage: '/images/carrusel3.png',
      content: (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Paso 3: Confirma tu solicitud</h3>
          <p className="text-white/80 max-w-md">
            Revisa todos los detalles y envía tu solicitud. Te contactaremos con la respuesta en minutos.
          </p>
        </div>
      ),
    },
  ]

  return (
    <div className="w-full">
      <AnimatedCarousel
        currentStep={currentStep}
        totalSteps={carouselSteps.length}
        steps={carouselSteps}
        onStepChange={setCurrentStep}
        showStepIndicator={true}
        className="rounded-xl"
      />
    </div>
  )
}
