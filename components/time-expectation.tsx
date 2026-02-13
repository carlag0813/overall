import { Zap } from "lucide-react"

export function TimeExpectation() {
  return (
    <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700 delay-300">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-success/12 via-success/8 to-success/12 border border-success/20 p-4 transition-all duration-300">
        {/* Efecto de brillo animado */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 hover:opacity-75 transition-opacity duration-500" />
        
        {/* Contenido */}
        <div className="relative flex items-center justify-center gap-3 text-center">
          <div className="flex items-center justify-center">
            
          </div>
          <div>
            <p className="text-sm font-bold text-lime-700">
              ¡Te tomará 3 minutos! ⚡
            </p>
            
          </div>
        </div>
      </div>
    </div>
  )
}
