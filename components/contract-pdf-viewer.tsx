"use client"

import { useState, useRef } from "react"
import { ZoomIn, ZoomOut, X, Maximize2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ContractPDFViewerProps {
  productType: "prestamo" | "adelanto"
  userName: string
  amount: number
  term: number
  monthlyPayment: number
  TEA: number
  bankName: string
  accountNumber: string
  commission: number
  igv: number
  quotas: Array<{ number: number; date: string; amount: number }>
  currentDate: string
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
  }).format(amount)
}

export function ContractPDFViewer({
  productType,
  userName,
  amount,
  term,
  monthlyPayment,
  TEA,
  bankName,
  accountNumber,
  commission,
  igv,
  quotas,
  currentDate,
}: ContractPDFViewerProps) {
  const [zoom, setZoom] = useState(100)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 200))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 50))
  const toggleFullscreen = () => setIsFullscreen(!isFullscreen)

  const totalToPay = amount + commission + igv + (productType === "prestamo" ? amount * (TEA / 100) * (term / 12) : 0)

  const content = (
    <div
      ref={containerRef}
      className={`${isFullscreen ? "fixed inset-0 z-50 bg-black flex flex-col" : ""}`}
    >
      {/* Toolbar */}
      <div className={`flex items-center justify-between gap-2 p-4 ${isFullscreen ? "bg-gray-900 text-white" : "bg-gray-100 border-b"}`}>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">
            Página {currentPage} de 2 · Zoom: {zoom}%
          </span>
          <Button
            variant="secondary"
            size="sm"
            className="h-8 text-xs gap-2"
            onClick={() => alert("Descargando contrato...")}
          >
            <Download className="h-3.5 w-3.5" />
            Descargar y ver
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomOut}
            className={`h-8 w-8 ${isFullscreen ? "text-white hover:bg-gray-800" : ""}`}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomIn}
            className={`h-8 w-8 ${isFullscreen ? "text-white hover:bg-gray-800" : ""}`}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className={`h-8 w-8 ${isFullscreen ? "text-white hover:bg-gray-800" : ""}`}
          >
            {isFullscreen ? <X className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className={`${isFullscreen ? "flex-1 overflow-auto flex justify-center items-center bg-slate-700 p-2 md:p-4" : "overflow-y-auto max-h-96 bg-slate-700 flex justify-center items-start pt-2 md:pt-4 px-2 md:px-0"}`}>
        <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }} className="bg-white shadow-2xl border border-black w-full md:w-[210mm]">
          {/* Page 1 */}
          {(currentPage === 1 || !isFullscreen) && (
            <div className="w-full md:w-[210mm] h-auto md:h-[297mm] p-6 md:p-12 text-gray-900 text-xs leading-relaxed space-y-4 border-l border-r border-t border-black" style={{ fontSize: "11px" }}>
              {/* Header */}
              <div className="text-center pb-4 border-b-2 border-gray-300">
                <h1 className="text-xl font-bold">OVERALL S.A.C.</h1>
                <p className="text-gray-600">RUC: 20123456789</p>
                <p className="text-gray-600 mt-2 font-semibold">
                  CONTRATO DE {productType === "prestamo" ? "PRÉSTAMO PERSONAL" : "ADELANTO DE SUELDO"}
                </p>
                <p className="text-gray-500 mt-1">N° CONT-2024-0001</p>
              </div>

              {/* Content */}
              <div className="space-y-3 pt-4">
                <p>
                  <strong>Conste por el presente documento:</strong> El contrato de {productType === "prestamo" ? "préstamo personal" : "adelanto de salario"} que celebran <strong>OVERALL S.A.C.</strong> (RUC 20123456789), en adelante LA EMPRESA; y el(la) Sr(a). <strong>{userName}</strong>, en adelante EL COLABORADOR.
                </p>

                <div>
                  <p className="font-bold mb-2">CLÁUSULA PRIMERA - {productType === "prestamo" ? "PRÉSTAMO" : "ADELANTO"}:</p>
                  <p>
                    LA EMPRESA otorga a EL COLABORADOR un {productType === "prestamo" ? "préstamo" : "adelanto"} por <strong>{formatCurrency(amount)}</strong>, a pagarse en <strong>{term} cuotas mensuales</strong> de <strong>{formatCurrency(monthlyPayment)}</strong> cada una. El monto neto a recibir es de <strong>{formatCurrency(amount)}</strong>.
                  </p>
                </div>

                <div>
                  <p className="font-bold mb-2">CLÁUSULA SEGUNDA - {productType === "prestamo" ? "COMISIÓN E INTERESES" : "COMISIÓN"}:</p>
                  <p>
                    Se aplicará una comisión de <strong>{formatCurrency(commission)}</strong> {productType === "prestamo" ? "y un interés del TEA " + TEA + "%" : ""} sobre el monto adelantado. El IGV aplicable es de <strong>{formatCurrency(igv)}</strong>. {productType === "prestamo" ? `El interés total generado es de ${formatCurrency((TEA / 100) * amount * (term / 12))}.` : ""}
                  </p>
                </div>

                <div>
                  <p className="font-bold mb-2">CLÁUSULA TERCERA - AUTORIZACIÓN DE DESCUENTO:</p>
                  <p>
                    EL COLABORADOR autoriza el descuento automático por planilla de las cuotas pactadas, conforme al cronograma establecido en el presente contrato.
                  </p>
                </div>

                <div>
                  <p className="font-bold mb-2">CLÁUSULA CUARTA - DEPÓSITO:</p>
                  <p>
                    El depósito del {productType === "prestamo" ? "préstamo" : "adelanto"} se realizará en la cuenta de {bankName} N° {accountNumber} en un plazo máximo de 24 horas hábiles después de la firma.
                  </p>
                </div>

                <div>
                  <p className="font-bold mb-2">CLÁUSULA QUINTA - INCUMPLIMIENTO:</p>
                  <p>
                    En caso de término de la relación laboral antes de finalizar el cronograma, el saldo pendiente será descontado de la liquidación de beneficios sociales conforme a ley.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-300 text-center">
                  <p className="text-gray-600">Lima, {currentDate}</p>
                </div>

                <div className="mt-8 pt-4 grid grid-cols-2 gap-8 text-center">
                  <div>
                    <p className="border-t border-gray-300 mt-12 pt-2">LA EMPRESA</p>
                  </div>
                  <div>
                    <p className="border-t border-gray-300 mt-12 pt-2">EL COLABORADOR</p>
                  </div>
                </div>

                <p className="text-center text-gray-500 text-[10px] mt-4">Página 1 de 2</p>
              </div>
            </div>
          )}

          {/* Page 2 - Schedule */}
          {(currentPage === 2 || !isFullscreen) && (
            <div className="w-full md:w-[210mm] h-auto md:h-[297mm] p-6 md:p-12 text-gray-900 text-xs leading-relaxed space-y-4 border-l border-r border-b border-black" style={{ fontSize: "11px" }}>
              {/* Header Page 2 */}
              <div className="text-center pb-3 border-b-2 border-gray-300">
                <p className="text-lg font-bold">CRONOGRAMA DE PAGOS</p>
                <p className="text-gray-600">{productType === "prestamo" ? "Préstamo" : "Adelanto"} - {formatCurrency(amount)}</p>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-2 gap-2 md:gap-4 mb-4 md:mb-6 text-xs">
                <div className="bg-gray-50 p-2 md:p-3 rounded border border-gray-200">
                  <p className="text-gray-600 text-[10px] md:text-xs">Monto solicitado:</p>
                  <p className="font-bold text-sm md:text-base">{formatCurrency(amount)}</p>
                </div>
                <div className="bg-gray-50 p-2 md:p-3 rounded border border-gray-200">
                  <p className="text-gray-600 text-[10px] md:text-xs">Monto neto a recibir:</p>
                  <p className="font-bold text-sm md:text-base">{formatCurrency(amount)}</p>
                </div>
                <div className="bg-gray-50 p-2 md:p-3 rounded border border-gray-200">
                  <p className="text-gray-600 text-[10px] md:text-xs">Comisión:</p>
                  <p className="font-bold text-sm md:text-base">{formatCurrency(commission)}</p>
                </div>
                <div className="bg-gray-50 p-2 md:p-3 rounded border border-gray-200">
                  <p className="text-gray-600 text-[10px] md:text-xs">IGV 18%:</p>
                  <p className="font-bold text-sm md:text-base">{formatCurrency(igv)}</p>
                </div>
              </div>

              {/* Table */}
              <table className="w-full text-xs border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 p-1 md:p-2 text-left text-[10px] md:text-xs">Cuota</th>
                    <th className="border border-gray-300 p-1 md:p-2 text-left text-[10px] md:text-xs">Fecha</th>
                    <th className="border border-gray-300 p-1 md:p-2 text-right text-[10px] md:text-xs">Monto</th>
                    <th className="border border-gray-300 p-1 md:p-2 text-center text-[10px] md:text-xs">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {quotas.map((quota) => (
                    <tr key={quota.number} className={quota.number % 2 === 0 ? "bg-gray-50" : ""}>
                      <td className="border border-gray-300 p-1 md:p-2 text-[10px] md:text-xs">{quota.number}</td>
                      <td className="border border-gray-300 p-1 md:p-2 text-[10px] md:text-xs">{quota.date}</td>
                      <td className="border border-gray-300 p-1 md:p-2 text-right text-[10px] md:text-xs">{formatCurrency(quota.amount)}</td>
                      <td className="border border-gray-300 p-1 md:p-2 text-center">
                        <span className="text-[9px] md:text-[10px] px-1.5 md:px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded">Pendiente</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-200 font-bold">
                    <td colSpan={2} className="border border-gray-300 p-1 md:p-2 text-[10px] md:text-xs">
                      TOTAL A PAGAR
                    </td>
                    <td className="border border-gray-300 p-1 md:p-2 text-right text-[10px] md:text-xs">{formatCurrency(totalToPay)}</td>
                    <td className="border border-gray-300 p-1 md:p-2 text-center"></td>
                  </tr>
                </tfoot>
              </table>

              <div className="mt-6 text-[10px] text-gray-600 space-y-2">
                <p>
                  <strong>Nota importante:</strong> Este cronograma es vinculante. El incumplimiento de cualquier cuota puede resultar en acciones legales.
                </p>
                <p>
                  <strong>Forma de pago:</strong> Descuento automático por planilla conforme al cronograma establecido.
                </p>
              </div>

              <div className="mt-8 pt-4 text-center text-gray-500 text-[10px]">
                <p>Página 2 de 2</p>
              </div>
            </div>
          )}
        </div>

        {/* Page Navigation (fullscreen only) */}
        {isFullscreen && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full flex gap-4 items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage(1)}
              className={`text-xs ${currentPage === 1 ? "bg-gray-700" : ""}`}
            >
              Página 1
            </Button>
            <div className="w-px h-4 bg-gray-600" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage(2)}
              className={`text-xs ${currentPage === 2 ? "bg-gray-700" : ""}`}
            >
              Página 2
            </Button>
          </div>
        )}
      </div>
    </div>
  )

  return content
}
