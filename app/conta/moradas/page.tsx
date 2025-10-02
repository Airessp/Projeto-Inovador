"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AddressForm } from "@/components/address-form"
import Link from "next/link"

export default function MoradasPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="container mx-auto flex-1 px-4 py-10 max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Moradas</h1>
          <Link href="/conta" className="text-sm text-yellow-600 hover:underline">
            ← Voltar ao Painel
          </Link>
        </div>

        <AddressForm />
      </main>
      <Footer />
    </div>
  )
}
