"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

type Order = {
  id: number
  status: string
  date_created: string
  total: string
  line_items: { id: number; name: string; quantity: number; total: string }[]
  billing: { first_name: string; last_name: string; address_1: string; city: string; postcode: string }
}

export default function EncomendaDetalhesPage() {
  const { id } = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!id) return
    ;(async () => {
      try {
        const res = await fetch(`/api/account/orders/${id}`, { cache: "no-store" })
        if (!res.ok) throw new Error("Erro ao carregar encomenda")
        const data = await res.json()
        setOrder(data)
      } catch (e: any) {
        setError(e?.message || "Erro inesperado")
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-6 py-10 flex-1">
        <Link href="/conta/encomendas" className="text-yellow-600 hover:underline mb-6 block">
          ← Voltar às encomendas
        </Link>

        {loading && <p>A carregar detalhes da encomenda...</p>}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {order && (
          <Card>
            <CardHeader>
              <CardTitle>Encomenda #{order.id}</CardTitle>
              <p className="text-sm text-gray-600">
                Estado: <b>{order.status.toUpperCase()}</b> | Data:{" "}
                {new Date(order.date_created).toLocaleDateString("pt-PT")}
              </p>
            </CardHeader>
            <CardContent>
              <h3 className="font-bold mb-2">Produtos</h3>
              <ul className="mb-4 space-y-1">
                {order.line_items.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>{item.name} × {item.quantity}</span>
                    <span>{item.total} €</span>
                  </li>
                ))}
              </ul>

              <h3 className="font-bold mb-2">Entrega</h3>
              <p>{order.billing.first_name} {order.billing.last_name}</p>
              <p>{order.billing.address_1}</p>
              <p>{order.billing.postcode} {order.billing.city}</p>

              <h3 className="font-bold mt-4">Total</h3>
              <p className="text-lg font-semibold">{order.total} €</p>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  )
}
