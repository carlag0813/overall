'use client'

import { X } from 'lucide-react'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer'

interface ArticleModalProps {
  isOpen: boolean
  onClose: () => void
  article: {
    title: string
    description: string
    content: string
    image: string
  } | null
}

export function ArticleModal({ isOpen, onClose, article }: ArticleModalProps) {
  if (!article) return null

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="relative p-4 md:p-6">
          <div className="flex gap-4 md:gap-6">
            {/* Imagen 1:1 a la izquierda */}
            <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Título y descripción a la derecha */}
            <div className="flex-1 flex flex-col justify-center">
              <h2 className="text-xl md:text-2xl font-bold text-foreground leading-tight mb-2">
                {article.title}
              </h2>
              <p className="text-xs md:text-sm text-foreground/70 line-clamp-2">
                {article.description}
              </p>
            </div>

            {/* Botón cerrar */}
            <DrawerClose className="flex-shrink-0 p-2 hover:bg-foreground/10 rounded-full transition-colors">
              <X className="h-5 w-5 text-foreground" />
              <span className="sr-only">Cerrar</span>
            </DrawerClose>
          </div>
        </DrawerHeader>

        {/* Contenido del artículo abajo */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-6">
          <div className="prose prose-sm max-w-none">
            <div className="text-sm md:text-base text-foreground/80 leading-relaxed whitespace-pre-wrap">
              {article.content}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
