'use client'

interface StepperProps {
  currentStep: number
  steps: string[]
}

export function StepperBanner({ currentStep, steps }: StepperProps) {
  return (
    <div className="flex items-center justify-between text-[11px] font-medium px-1">
      {steps.map((step, idx) => (
        <div key={idx} className="flex flex-col items-center gap-0.5">
          {/* Círculo del paso */}
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 shadow-md font-bold ${
              currentStep >= idx + 1 ? 'bg-success text-white' : 'bg-white/30 text-white/70'
            }`}
            style={{
              transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1)',
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)',
            }}
          >
            {currentStep > idx + 1 ? '✓' : idx + 1}
          </div>

          {/* Etiqueta del paso */}
          <span
            className={`text-[9px] font-semibold ${currentStep >= idx + 1 ? 'text-white' : 'text-white/70'}`}
            style={{
              transition: 'color 300ms cubic-bezier(0.4, 0, 0.2, 1)',
              backfaceVisibility: 'hidden',
            }}
          >
            {step}
          </span>

          {/* Línea conectora */}
          {idx < steps.length - 1 && (
            <div
              className={`absolute left-0 right-0 h-0.5 mx-1.5 top-2.5 -z-10 ${
                currentStep > idx + 1 ? 'bg-success' : 'bg-white/30'
              }`}
              style={{
                transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                backfaceVisibility: 'hidden',
                transform: 'translateZ(0)',
                width: `calc(100% - 0.375rem)`,
              }}
            />
          )}
        </div>
      ))}
    </div>
  )
}
