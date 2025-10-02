"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { ContactForm } from "@/components/contact-form"
import { ContactInfo } from "@/components/contact-info"
import { MapSection } from "@/components/map-section"
import { Footer } from "@/components/footer"
import { Chatbot } from "@/components/chatbot"

export default function ContactPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Header com controlo do estado da sidebar */}
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex">
        {/* Sidebar controlada pelo estado */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? "ml-64" : "ml-0"
          }`}
        >
          <div className="container mx-auto px-6 py-8">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold mb-2">Contactos</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Entre em contacto connosco para esclarecimentos, suporte técnico ou
                informações sobre os nossos produtos e serviços.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
              <ContactForm />
              <ContactInfo />
            </div>

            <MapSection />
          </div>
        </main>
      </div>

      <Footer />
      <Chatbot />
    </div>
  )
}
