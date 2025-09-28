"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function EditAddressPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-10 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Adicionar / Editar Morada</h1>

        <form className="space-y-6">
          <div>
            <Label>Nome *</Label>
            <Input type="text" required />
          </div>
          <div>
            <Label>Email *</Label>
            <Input type="email" required />
          </div>
          <div>
            <Label>Empresa (opcional)</Label>
            <Input type="text" />
          </div>
          <div>
            <Label>Morada *</Label>
            <Input type="text" required />
          </div>
          <div>
            <Label>Localidade *</Label>
            <Input type="text" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Código Postal *</Label>
              <Input type="text" required />
            </div>
            <div>
              <Label>Telefone *</Label>
              <Input type="tel" required />
            </div>
          </div>
          <div>
            <Label>NIF/NIPC *</Label>
            <Input type="text" required />
          </div>

          <Button type="submit" className="w-full bg-yellow-500">
            Guardar Morada
          </Button>
        </form>
      </main>
      <Footer />
    </div>
  )
}
