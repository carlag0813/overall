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
        <DrawerHeader className="relative p-0">
          <div className="w-full h-48 md:h-56 overflow-hidden rounded-t-2xl">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <DrawerClose className="absolute right-4 top-4 p-2 bg-white/80 hover:bg-white rounded-full transition-colors z-10">
            <X className="h-5 w-5 text-foreground" />
            <span className="sr-only">Cerrar</span>
          </DrawerClose>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6">
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {article.title}
            </h2>
            
            <p className="text-sm md:text-base text-foreground/70 leading-relaxed">
              {article.description}
            </p>

            <div className="prose prose-sm max-w-none">
              <div className="text-sm md:text-base text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {article.content}
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
