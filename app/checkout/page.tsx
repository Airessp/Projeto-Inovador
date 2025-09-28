"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createOrder } from "@/lib/woocommerce"

type CartItem = {
  id?: number          // ⚡ WooCommerce product_id (se existir)
  sku?: string
  name: string
  price: number
  quantity: number
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [billing, setBilling] = useState({
    first_name: "",
    last_name: "",
    address_1: "",
    city: "",
    postcode: "",
    country: "PT",
    email: "",
    phone: "",
  })

  const [paymentMethod, setPaymentMethod] = useState("cod")

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("projeto-inovador-cart") || "[]")
    setCart(saved)

    const savedUser = JSON.parse(localStorage.getItem("projeto_inovador_user") || "null")
    if (savedUser) {
      setBilling((b) => ({
        ...b,
        first_name: savedUser.name || "",
        email: savedUser.email || "",
      }))
    }
  }, [])

  const total = useMemo(
    () => cart.reduce((acc, it) => acc + (it.price || 0) * (it.quantity || 1), 0),
    [cart]
  )

  async function handleCheckout() {
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      if (cart.length === 0) {
        setError("O carrinho está vazio.")
        setLoading(false)
        return
      }
      if (!billing.first_name || !billing.address_1) {
        setError("Preencha pelo menos Nome e Morada.")
        setLoading(false)
        return
      }

      // ⚡ mandamos id/sku/name → o servidor resolve product_id válido
      const line_items = cart.map((it) => ({
        product_id: it.id,  // se já tiver
        sku: it.sku,
        name: it.name,
        quantity: it.quantity,
      }))

      const paymentTitles: Record<string, string> = {
        cod: "Pagamento na Entrega",
        mbway: "MBWay",
        multibanco: "Multibanco",
        paypal: "PayPal",
      }

      const payload = {
        payment_method: paymentMethod,
        payment_method_title: paymentTitles[paymentMethod] || "Método de Pagamento",
        set_paid: false,
        billing,
        shipping: billing,
        line_items,
      }

      const order = await createOrder(payload)

      // guardar histórico local
      const savedOrders = JSON.parse(localStorage.getItem("projeto_inovador_orders") || "[]")
      savedOrders.push({
        id: order.id,
        date: order.date_created,
        total: order.total,
        status: order.status,
      })
      localStorage.setItem("projeto_inovador_orders", JSON.stringify(savedOrders))

      // limpar carrinho
      localStorage.removeItem("projeto-inovador-cart")
      setCart([])

      setSuccess("Encomenda criada com sucesso!")
      setTimeout(() => router.push("/checkout/sucesso"), 1200)
    } catch (e: any) {
      console.error("❌ Erro checkout:", e)
      setError(e?.message || "Erro ao criar a encomenda")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">Finalizar Compra</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Morada */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Morada de Faturação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Primeiro Nome"
                  value={billing.first_name}
                  onChange={(e) => setBilling((b) => ({ ...b, first_name: e.target.value }))}
                />
                <Input
                  placeholder="Último Nome"
                  value={billing.last_name}
                  onChange={(e) => setBilling((b) => ({ ...b, last_name: e.target.value }))}
                />
              </div>

              <Input
                placeholder="Morada"
                value={billing.address_1}
                onChange={(e) => setBilling((b) => ({ ...b, address_1: e.target.value }))}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Cidade"
                  value={billing.city}
                  onChange={(e) => setBilling((b) => ({ ...b, city: e.target.value }))}
                />
                <Input
                  placeholder="Código Postal"
                  value={billing.postcode}
                  onChange={(e) => setBilling((b) => ({ ...b, postcode: e.target.value }))}
                />
                <Input
                  placeholder="País"
                  value={billing.country}
                  onChange={(e) => setBilling((b) => ({ ...b, country: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Email"
                  type="email"
                  value={billing.email}
                  onChange={(e) => setBilling((b) => ({ ...b, email: e.target.value }))}
                />
                <Input
                  placeholder="Telefone"
                  value={billing.phone}
                  onChange={(e) => setBilling((b) => ({ ...b, phone: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Resumo */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <p className="text-gray-500">Carrinho vazio.</p>
              ) : (
                <div className="space-y-3">
                  {cart.map((it, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{it.name} × {it.quantity}</span>
                      <span>{(it.price || 0) * (it.quantity || 1)} €</span>
                    </div>
                  ))}
                  <hr className="my-2" />
                  <p className="font-bold flex justify-between">
                    <span>Total (frontend):</span>
                    <span>{total.toFixed(2)} €</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    * O total final é calculado pelo WooCommerce com base nos produtos reais.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Pagamento */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Método de Pagamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {["cod", "mbway", "multibanco", "paypal"].map((m) => (
              <label key={m} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  value={m}
                  checked={paymentMethod === m}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                {m === "cod"
                  ? "Pagamento na Entrega"
                  : m === "mbway"
                  ? "MBWay"
                  : m === "multibanco"
                  ? "Multibanco"
                  : "PayPal"}
              </label>
            ))}
          </CardContent>
        </Card>

        {/* Mensagens */}
        {error && (
          <Alert className="mt-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mt-6 border-green-200 bg-green-50">
            <AlertDescription className="text-green-700">{success}</AlertDescription>
          </Alert>
        )}

        <Button
          className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-black"
          disabled={loading}
          onClick={handleCheckout}
        >
          {loading ? "A processar..." : "Finalizar Compra"}
        </Button>
      </main>

      <Footer />
    </div>
  )
}
