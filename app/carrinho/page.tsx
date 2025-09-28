"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

export default function CarrinhoPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [recommended, setRecommended] = useState<any[]>([])
  const router = useRouter()

  // 🔹 Carregar carrinho e reagir ao evento "cartUpdated"
  useEffect(() => {
    const loadCart = () => {
      const savedCart = localStorage.getItem("projeto-inovador-cart")
      if (savedCart) {
        setCartItems(JSON.parse(savedCart))
      } else {
        setCartItems([])
      }
    }

    loadCart()
    window.addEventListener("cartUpdated", loadCart)

    return () => {
      window.removeEventListener("cartUpdated", loadCart)
    }
  }, [])

  // 🔹 Atualizar localStorage sempre que mexemos no carrinho
  const updateCart = (items: CartItem[]) => {
    setCartItems(items)
    localStorage.setItem("projeto-inovador-cart", JSON.stringify(items))
    window.dispatchEvent(new Event("cartUpdated"))
  }

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) return removeItem(id)
    const updated = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    )
    updateCart(updated)
  }

  const removeItem = (id: string) => {
    const updated = cartItems.filter((item) => item.id !== id)
    updateCart(updated)
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  // 🔹 Exemplo de produtos recomendados (podes puxar de API ou JSON)
  useEffect(() => {
    setRecommended([
      {
        id: 101,
        name: "Capa Silicone iPhone 15",
        brand: "Apple",
        category: "Acessórios",
        price: 39.99,
        image: "/images/capa-iphone15.jpg",
      },
      {
        id: 102,
        name: "Carregador Rápido 20W USB-C",
        brand: "Apple",
        category: "Carregadores",
        price: 29.99,
        image: "/images/carregador-20w.jpg",
      },
      {
        id: 103,
        name: "Película Vidro iPhone 15 Pro",
        brand: "Belkin",
        category: "Acessórios",
        price: 19.99,
        image: "/images/pelicula-iphone15pro.jpg",
        inStock: false,
      },
      {
        id: 104,
        name: "AirPods Pro 2ª Geração",
        brand: "Apple",
        category: "Áudio",
        price: 279.99,
        image: "/images/airpods-pro2.jpg",
      },
    ])
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Carrinho de Compras</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-md">
            <p className="text-gray-600 text-lg">O seu carrinho está vazio.</p>
            <Button
              className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
              onClick={() => router.push("/produtos")}
            >
              Ver Produtos
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-10">
            {/* 🛒 Tabela Produtos */}
            <div className="lg:col-span-2 overflow-x-auto">
              <table className="w-full text-sm md:text-base border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <thead className="bg-gray-100 text-gray-800">
                  <tr>
                    <th className="p-4 text-left font-semibold">Produto</th>
                    <th className="p-4 text-center font-semibold">Preço</th>
                    <th className="p-4 text-center font-semibold">Quantidade</th>
                    <th className="p-4 text-right font-semibold">Subtotal</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id} className="border-t hover:bg-gray-50">
                      <td className="p-4 flex items-center gap-4">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md border"
                        />
                        <span className="font-medium">{item.name}</span>
                      </td>
                      <td className="p-4 text-center text-yellow-600 font-bold">
                        €{item.price.toFixed(2)}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            className="w-8 h-8 flex items-center justify-center border rounded-full hover:bg-gray-200"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            −
                          </button>
                          <span className="w-6 text-center font-semibold">{item.quantity}</span>
                          <button
                            className="w-8 h-8 flex items-center justify-center border rounded-full hover:bg-gray-200"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="p-4 text-right font-bold text-gray-800">
                        €{(item.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 📦 Resumo do Pedido */}
            <div className="border rounded-xl p-6 shadow-md bg-white h-fit sticky top-24">
              <h2 className="text-lg font-bold mb-4">Resumo do Pedido</h2>

              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-yellow-600">
                  €{getTotalPrice().toFixed(2)}
                </span>
              </div>

              <hr className="my-2" />

              <div className="flex justify-between mb-4">
                <span className="font-bold">Total</span>
                <span className="font-bold text-yellow-600">
                  €{getTotalPrice().toFixed(2)}
                </span>
              </div>

              <input
                type="text"
                placeholder="Código do cupão"
                className="w-full border rounded-md px-3 py-2 mb-3"
              />
              <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black mb-4">
                Aplicar Cupão
              </Button>

              <p className="text-green-600 text-sm mb-4">
                Pedido elegível para envio grátis!
              </p>

              <Button
                onClick={() => router.push("/checkout")}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold py-3 rounded-xl shadow-lg"
              >
                Finalizar Compra
              </Button>
            </div>
          </div>
        )}

        {/* 🔥 Produtos Recomendados */}
        {recommended.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl font-bold mb-6">Talvez se interesse por...</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {recommended.map((product) => (
                <ProductCard key={product.id} {...product} hideCartButton />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
