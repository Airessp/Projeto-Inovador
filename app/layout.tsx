import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

import { TooltipProvider } from "@/components/ui/tooltip" // 🔹 importa o provider do shadcn

export const metadata: Metadata = {
  title: "Projeto Inovador",
  description:
    "Loja online de electrónicos, smartphones, computadores e serviços de reparação.",
  generator: "TorrentLite",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {/* 🔹 Providers globais (necessário para dropdowns/tooltips Radix) */}
        <TooltipProvider delayDuration={100}>
          <Suspense fallback={null}>{children}</Suspense>
        </TooltipProvider>
        <Analytics />
      </body>
    </html>
  )
}
