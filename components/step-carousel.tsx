'use client'

import React, { ReactNode } from 'react'

interface StepCarouselProps {
  currentStep: number
  children: ReactNode[]
  className?: string
  containerClassName?: string
  animationDelay?: number
}

/**
 * StepCarousel Component
 * 
 * Displays multiple slides with staggered animations.
 * Each slide appears with a fade-in and slide-in-from-right effect,
 * with a cascading entrance timing.
 * 
 * @param currentStep - The active step/slide index (1-based)
 * @param children - Array of slide components to render
 * @param className - Optional class for individual slides
 * @param containerClassName - Optional class for the container
 * @param animationDelay - Base delay in ms between slide animations (default: 75ms)
 */
export function StepCarousel({
  currentStep,
  children,
  className = '',
  containerClassName = '',
  animationDelay = 75,
}: StepCarouselProps) {
  const slides = React.Children.toArray(children)
  
  return (
    <div className={`relative w-full ${containerClassName}`}>
      {slides.map((slide, index) => {
        const isActive = index + 1 === currentStep
        const delayMs = animationDelay * index
        const delayClass = getDelayClass(delayMs)

        return (
          <div
            key={index}
            className={`
              transition-all duration-500 ease-out
              ${isActive 
                ? `opacity-100 translate-x-0 pointer-events-auto animate-in fade-in slide-in-from-right-8 ${delayClass}`
                : 'opacity-0 translate-x-8 pointer-events-none absolute'
              }
              ${className}
            `}
            style={{
              animationDuration: isActive ? '500ms' : undefined,
              animationDelay: isActive ? `${delayMs}ms` : undefined,
            }}
          >
            {slide}
          </div>
        )
      })}
    </div>
  )
}

/**
 * Helper function to map milliseconds to Tailwind delay classes
 * Supports delays in 50ms increments up to 500ms
 */
function getDelayClass(delayMs: number): string {
  const delays: Record<number, string> = {
    0: 'delay-0',
    50: 'delay-50',
    75: 'delay-75',
    100: 'delay-100',
    150: 'delay-150',
    200: 'delay-200',
    300: 'delay-300',
    500: 'delay-500',
  }
  
  // Find the closest delay class
  const closest = Object.keys(delays)
    .map(Number)
    .reduce((prev, curr) => 
      Math.abs(curr - delayMs) < Math.abs(prev - delayMs) ? curr : prev
    )
  
  return delays[closest] || 'delay-0'
}

/**
 * Alternative: SimpleStepCarousel
 * Simpler version without staggered animations, just fade/slide
 */
export function SimpleStepCarousel({
  currentStep,
  children,
  className = '',
  containerClassName = '',
}: Omit<StepCarouselProps, 'animationDelay'>) {
  const slides = React.Children.toArray(children)
  
  return (
    <div className={`relative w-full ${containerClassName}`}>
      {slides.map((slide, index) => {
        const isActive = index + 1 === currentStep

        return (
          <div
            key={index}
            className={`
              transition-all duration-500 ease-out
              ${isActive 
                ? 'opacity-100 translate-x-0 pointer-events-auto animate-in fade-in slide-in-from-right-6 duration-500'
                : 'opacity-0 translate-x-4 pointer-events-none absolute'
              }
              ${className}
            `}
          >
            {slide}
          </div>
        )
      })}
    </div>
  )
}
