"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function CheckoutSuccessPage() {
  const [order, setOrder] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Vai buscar a última encomenda guardada no localStorage
    const savedOrders = JSON.parse(localStorage.getItem("projeto_inovador_orders") || "[]")
    if (savedOrders.length > 0) {
      setOrder(savedOrders[savedOrders.length - 1])
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-6 py-12 flex flex-col items-center justify-center text-center">
        <Card className="max-w-lg w-full shadow-xl border-0 rounded-3xl bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-green-600">
              🎉 Encomenda Confirmada!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order ? (
              <>
                <p className="text-gray-700">
                  Obrigado pela sua compra! A sua encomenda foi registada com sucesso.
                </p>
                <div className="text-left space-y-1 bg-gray-50 p-4 rounded-xl">
                  <p>
                    <strong>ID da Encomenda:</strong> #{order.id}
                  </p>
                  <p>
                    <strong>Data:</strong>{" "}
                    {new Date(order.date).toLocaleDateString("pt-PT")}
                  </p>
                  <p>
                    <strong>Total:</strong> {order.total} €
                  </p>
                  <p>
                    <strong>Estado:</strong> {order.status}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-gray-600">
                Não encontrámos nenhuma encomenda recente.
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button
                onClick={() => router.push("/")}
                className="bg-yellow-500 hover:bg-yellow-600 text-black flex-1"
              >
                Voltar à Loja
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/conta?tab=encomendas")}
                className="flex-1"
              >
                Ver Encomendas
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
