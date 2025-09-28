"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

type Order = {
  id: number
  date_created: string
  total: string
  status: string
}

export default function EncomendasPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("projeto_inovador_user") || "null")
    if (!u?.email) {
      setError("Sessão inválida. Faça login para ver as suas encomendas.")
      setLoading(false)
      return
    }

    ;(async () => {
      try {
        const res = await fetch(`/api/account/orders?email=${encodeURIComponent(u.email)}`, { cache: "no-store" })
        if (!res.ok) throw new Error("Falha ao carregar encomendas")
        const data = await res.json()
        setOrders(Array.isArray(data) ? data : [])
      } catch (e: any) {
        setError(e?.message || "Erro inesperado")
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-6 py-10 flex-1">
        <h1 className="text-2xl font-bold mb-6">As Minhas Encomendas</h1>

        {loading && <p>A carregar encomendas...</p>}

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {!loading && !error && orders.length === 0 && (
          <p className="text-gray-500">Ainda não tem encomendas.</p>
        )}

        <div className="grid gap-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <CardTitle>
                  Encomenda #{order.id} - {order.status.toUpperCase()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p><b>Data:</b> {new Date(order.date_created).toLocaleDateString("pt-PT")}</p>
                <p><b>Total:</b> {order.total} €</p>
                <Link href={`/conta/encomendas/${order.id}`} className="text-yellow-600 hover:underline text-sm mt-2 inline-block">
                  Ver Detalhes →
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
