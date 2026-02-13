'use client';

import { useEffect, useState } from "react"

export function useCountAnimation(targetValue: number, duration: number = 300) {
  const [displayValue, setDisplayValue] = useState(targetValue)

  useEffect(() => {
    let startValue = displayValue
    let startTime: number | null = null

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      const current = Math.floor(startValue + (targetValue - startValue) * progress)
      setDisplayValue(current)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    if (displayValue !== targetValue) {
      requestAnimationFrame(animate)
    }
  }, [targetValue, duration])

  return displayValue
}
