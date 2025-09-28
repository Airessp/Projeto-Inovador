"use client"

import { useState, useEffect } from "react"
import { X, Plus, Minus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const router = useRouter()

  const loadCart = () => {
    const savedCart = localStorage.getItem("projeto-inovador-cart")
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    } else {
      setCartItems([])
    }
  }

  useEffect(() => {
    loadCart()

    const handleCartUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<CartItem[]>
      if (customEvent.detail) {
        setCartItems(customEvent.detail)
      } else {
        loadCart()
      }
    }

    window.addEventListener("cartUpdated", handleCartUpdate)
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate)
    }
  }, [])

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id)
      return
    }
    const updatedItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    )
    saveCart(updatedItems)
  }

  const removeItem = (id: string) => {
    const updatedItems = cartItems.filter((item) => item.id !== id)
    saveCart(updatedItems)
  }

  const saveCart = (items: CartItem[]) => {
    setCartItems(items)
    localStorage.setItem("projeto-inovador-cart", JSON.stringify(items))
    window.dispatchEvent(new CustomEvent("cartUpdated", { detail: items }))
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl transform transition-transform duration-300 z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b shadow-sm">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-yellow-600" />
              Carrinho de compras
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-600" />
            </Button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                O seu carrinho está vazio
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 border rounded-xl shadow-sm"
                  >
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm line-clamp-2">{item.name}</h3>
                      <p className="text-yellow-600 font-bold">€{item.price.toFixed(2)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full w-8 h-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full w-8 h-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right font-bold text-gray-800">
                      €{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t p-4 bg-gray-50 shadow-inner">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-700">Subtotal:</span>
                <span className="text-lg font-bold text-yellow-600">
                  €{getTotalPrice().toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-green-600 mb-3">
                Pedido elegível para envio grátis!
              </p>
              <div className="flex flex-col gap-3">
                <Link href="/carrinho" onClick={onClose}>
                  <Button className="w-full border text-yellow-600 border-yellow-500 hover:bg-yellow-50">
                    Ver Carrinho
                  </Button>
                </Link>
                <Button
                  onClick={() => {
                    onClose()
                    router.push("/checkout")
                  }}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-xl shadow-lg"
                >
                  Finalizar Compra
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
