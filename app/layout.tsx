import type React from "react"
import type { Metadata, Viewport } from "next"
import { Montserrat } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AppLoader } from "@/components/app-loader"
import { OnboardingCarousel } from "@/components/onboarding-carousel"
import { FAQButton } from "@/components/faq-button"
import "./globals.css"

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
})

export const metadata: Metadata = {
  title: "Overall - Mi Oferta Preaprobada",
  description: "Accede a tu oferta de adelanto de salario y préstamo personal preaprobado",
  generator: "v0.app",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#004EA8",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${montserrat.className} font-sans antialiased`}>
        <AppLoader />
        <OnboardingCarousel />
        <FAQButton />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
