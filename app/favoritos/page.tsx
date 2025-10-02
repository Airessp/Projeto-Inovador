"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import type { Product } from "@/types/product"

type User = {
  id?: number
  email?: string
  name?: string
}

export default function FavoritosPage() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [storageKey, setStorageKey] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // 🔹 Definir chave única por utilizador
  useEffect(() => {
    try {
      const user: User | null = JSON.parse(
        localStorage.getItem("projeto_inovador_user") || "null"
      )

      if (user?.id) {
        setStorageKey(`projeto-inovador-favorites-${user.id}`)
      } else if (user?.email) {
        setStorageKey(`projeto-inovador-favorites-${user.email}`)
      } else {
        setStorageKey("projeto-inovador-favorites-guest")
      }
    } catch (err) {
      console.error("Erro ao ler utilizador do localStorage:", err)
      setStorageKey("projeto-inovador-favorites-guest")
    }
  }, [])

  // 🔹 Carregar favoritos + produtos
  useEffect(() => {
    if (!storageKey) return

    try {
      const favs: string[] = JSON.parse(localStorage.getItem(storageKey) || "[]")
      console.log("⭐ Favoritos carregados:", favs)
      setFavorites(favs.map((id) => String(id))) // força sempre string
    } catch (err) {
      console.error("Erro ao ler favoritos:", err)
      setFavorites([])
    }

    fetch("/data/products.json") // 👈 corrigido
      .then((res) => res.json())
      .then((data) => {
        console.log("📦 Produtos carregados:", data.products)
        setProducts(data.products || [])
        setLoading(false)
      })
      .catch((err) => {
        console.error("Erro ao carregar produtos:", err)
        setLoading(false)
      })
  }, [storageKey])

  // 🔹 Toggle favorito
  const toggleFavorite = (id: number | string) => {
    if (!storageKey) return
    const idStr = String(id)

    let updatedFavs: string[]
    if (favorites.includes(idStr)) {
      updatedFavs = favorites.filter((favId) => favId !== idStr)
    } else {
      updatedFavs = [...favorites, idStr]
    }

    setFavorites(updatedFavs)
    localStorage.setItem(storageKey, JSON.stringify(updatedFavs))
    window.dispatchEvent(new Event("favoritesUpdated"))
  }

  // 🔹 Filtrar só produtos favoritos
  const favoriteProducts = products.filter((p) =>
    favorites.includes(String(p.id)) // comparar sempre como string
  )

  console.log("✅ Produtos favoritos filtrados:", favoriteProducts)

  return (
    <div className="min-h-screen flex flex-col">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="flex-1 container mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">Lista de Desejos</h1>

        {loading ? (
          <p className="text-gray-500 text-lg">A carregar...</p>
        ) : !storageKey ? (
          <p className="text-gray-500 text-lg">
            A carregar informações do utilizador...
          </p>
        ) : favoriteProducts.length === 0 ? (
          <p className="text-gray-500 text-lg">
            Ainda não tem nenhum produto na lista de desejos.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favoriteProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                id={Number(product.id)}
                hideCartButton
                extraButton={
                  <Button
                    size="sm"
                    className="w-full mt-2 bg-yellow-500 hover:bg-yellow-600 text-black"
                    onClick={() => toggleFavorite(product.id)}
                  >
                    {favorites.includes(String(product.id))
                      ? "Remover dos Favoritos"
                      : "Adicionar aos Favoritos"}
                  </Button>
                }
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
