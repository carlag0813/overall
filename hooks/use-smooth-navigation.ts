'use client';

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

export function useSmoothNavigation() {
  const router = useRouter()

  const push = useCallback((url: string, options?: { prefetch?: boolean }) => {
    // Prefetch si está disponible
    if (options?.prefetch !== false) {
      router.prefetch(url)
    }

    // Usar requestAnimationFrame para sincronizar con el navegador
    requestAnimationFrame(() => {
      router.push(url)
    })
  }, [router])

  const back = useCallback(() => {
    router.back()
  }, [router])

  return { push, back, router }
}
