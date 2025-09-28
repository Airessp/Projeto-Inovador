"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { RepairCategories } from "@/components/repair-categories"
import { Footer } from "@/components/footer"
import { Chatbot } from "@/components/chatbot"

export default function RepairsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
          <div className="container mx-auto px-6 py-8">
            <div className="mb-12 text-center">
              <h1 className="text-4xl font-black mb-4 text-gray-900">Serviços de Reparação</h1>
              <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
                Reparamos os seus dispositivos com qualidade profissional e garantia total. Selecione o seu dispositivo
                e obtenha um orçamento instantâneo.
              </p>
            </div>

            <RepairCategories />
          </div>
        </main>
      </div>
      <Footer />
      <Chatbot />
    </div>
  )
}
