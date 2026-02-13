'use client'

import React, { ReactNode } from 'react'

interface AnimatedCarouselProps {
  currentStep: number
  totalSteps: number
  steps: {
    id: string | number
    label: string
    content: ReactNode
    icon?: ReactNode
    backgroundImage?: string
  }[]
  onStepChange?: (step: number) => void
  showStepIndicator?: boolean
  className?: string
}

/**
 * AnimatedCarousel Component
 * 
 * Enhanced carousel with step indicators and smooth transitions.
 * Perfect for multi-step wizards and simulators.
 */
export function AnimatedCarousel({
  currentStep,
  totalSteps,
  steps,
  onStepChange,
  showStepIndicator = true,
  className = '',
}: AnimatedCarouselProps) {
  return (
    <div className={`w-full ${className}`}>
      {/* Step Content with Staggered Animations */}
      <div className="relative min-h-[400px]">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isPrev = stepNumber < currentStep
          const isNext = stepNumber > currentStep

          return (
            <div
              key={step.id}
              className={`
                absolute inset-0 w-full transition-all duration-500 ease-out rounded-xl overflow-hidden
                ${isActive 
                  ? 'opacity-100 translate-x-0 pointer-events-auto'
                  : isNext
                    ? 'opacity-0 translate-x-full pointer-events-none'
                    : 'opacity-0 -translate-x-full pointer-events-none'
                }
              `}
              style={{
                animation: isActive 
                  ? `slideInRight 500ms cubic-bezier(0.4, 0, 0.2, 1) forwards`
                  : 'none',
                backgroundImage: step.backgroundImage ? `url(${step.backgroundImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Overlay para mejorar legibilidad del contenido */}
              <div className="absolute inset-0 bg-black/20" />
              <div className="relative animate-in fade-in slide-in-from-right-8 duration-500">
                {step.content}
              </div>
            </div>
          )
        })}
      </div>

      {/* Step Indicator */}
      {showStepIndicator && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {steps.map((step, index) => {
            const stepNumber = index + 1
            const isActive = stepNumber === currentStep
            const isCompleted = stepNumber < currentStep

            return (
              <button
                key={step.id}
                onClick={() => onStepChange?.(stepNumber)}
                className={`
                  flex items-center justify-center w-10 h-10 rounded-full font-semibold 
                  transition-all duration-300 text-sm
                  ${isActive
                    ? 'bg-primary text-white shadow-lg scale-110'
                    : isCompleted
                      ? 'bg-success text-white hover:shadow-md'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }
                `}
              >
                {isCompleted ? '✓' : stepNumber}
              </button>
            )
          })}
        </div>
      )}

      {/* Step Label */}
      <div className="text-center mt-4 animate-in fade-in duration-300 delay-200">
        <p className="text-sm text-muted-foreground">
          Paso {currentStep} de {totalSteps}
        </p>
        <p className="text-lg font-semibold text-foreground">
          {steps[currentStep - 1]?.label}
        </p>
      </div>
    </div>
  )
}

/**
 * Keyframe animation for slide-in effect from right
 * Add this to your global CSS or use Tailwind's theme extension:
 * 
 * @keyframes slideInRight {
 *   from {
 *     opacity: 0;
 *     transform: translateX(100%);
 *   }
 *   to {
 *     opacity: 1;
 *     transform: translateX(0);
 *   }
 * }
 */
