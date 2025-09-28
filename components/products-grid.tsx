"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Star, ShoppingCart, Heart } from "lucide-react"
import { useEffect, useState } from "react"
import type { Product } from "@/types/product"

interface ProductsGridProps {
  products?: Product[]
  loading?: boolean
}

function ProductsGridImpl({
  products: propProducts = [],
  loading: propLoading = false,
}: ProductsGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<string[]>([])

  // 🔹 Adicionar ao carrinho
  const addToCart = (product: Product) => {
    const cartItem = {
      id: String(product.id), // 👈 sempre string
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    }

    const existingCart = localStorage.getItem("projeto-inovador-cart")
    const cartItems = existingCart ? JSON.parse(existingCart) : []
    const idx = cartItems.findIndex((item: any) => item.id === cartItem.id)

    if (idx >= 0) cartItems[idx].quantity += 1
    else cartItems.push(cartItem)

    localStorage.setItem("projeto-inovador-cart", JSON.stringify(cartItems))
    window.dispatchEvent(new Event("cartUpdated"))
    alert(`✅ ${product.name} foi adicionado ao carrinho!`)
  }

  // 🔹 Toggle favoritos
  const toggleFavorite = (id: number | string) => {
    const idStr = String(id) // 👈 força sempre string
    const storageKey = "projeto-inovador-favorites-guest"
    const existing = JSON.parse(localStorage.getItem(storageKey) || "[]")

    let updated: string[]
    if (existing.includes(idStr)) {
      updated = existing.filter((favId: string) => favId !== idStr)
    } else {
      updated = [...existing, idStr]
    }

    localStorage.setItem(storageKey, JSON.stringify(updated))
    setFavorites(updated)
    window.dispatchEvent(new Event("favoritesUpdated"))
  }

  // 🔹 Carregar favoritos ao iniciar
  useEffect(() => {
    const favs: string[] = JSON.parse(
      localStorage.getItem("projeto-inovador-favorites-guest") || "[]"
    )
    setFavorites(favs)
  }, [])

  // 🔹 Carregar produtos passados por props
  useEffect(() => {
    setProducts(propProducts)
    setFilteredProducts(propProducts)
    setLoading(propLoading)
  }, [propProducts, propLoading])

  // 🔹 Filtro de pesquisa
  useEffect(() => {
    let filtered = [...products]
    if (searchTerm) {
      const q = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
    }
    setFilteredProducts(filtered)
  }, [products, searchTerm])

  const handleSort = (value: string) => {
    setSortBy(value)
    const sorted = [...filteredProducts].sort((a, b) => {
      switch (value) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "name":
        default:
          return a.name.localeCompare(b.name)
      }
    })
    setFilteredProducts(sorted)
  }

  // 🔹 Loading state (skeleton)
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="overflow-hidden animate-pulse">
            <div className="h-56 bg-gray-200" />
            <CardContent className="p-5">
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-6 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded mb-4" />
              <div className="h-8 bg-gray-200 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Barra de pesquisa e ordenação */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Pesquisar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-200 focus:border-yellow-500 focus:ring-yellow-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Ordenar por:</span>
          <Select value={sortBy} onValueChange={handleSort}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Nome" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Nome</SelectItem>
              <SelectItem value="price-low">Preço: Baixo → Alto</SelectItem>
              <SelectItem value="price-high">Preço: Alto → Baixo</SelectItem>
              <SelectItem value="rating">Avaliação</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid de produtos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card
            key={product.id}
            className="group hover:shadow-2xl transition-all duration-500 overflow-hidden border-0 shadow-lg bg-white rounded-2xl hover:-translate-y-2"
          >
            <div className="relative overflow-hidden rounded-t-2xl">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>

            <CardContent className="p-6">
              <Badge
                variant="outline"
                className="text-xs font-semibold text-yellow-600 border-yellow-200 bg-yellow-50 px-3 py-1 rounded-full mb-2"
              >
                {product.category}
              </Badge>

              <h3 className="font-bold text-lg mb-1 line-clamp-2 group-hover:text-yellow-600 transition-colors duration-300">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500 mb-2 font-medium uppercase tracking-wide">
                {product.brand}
              </p>

              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-sm font-bold text-gray-700 ml-1">
                  {product.rating}
                </span>
              </div>

              <div className="mb-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-yellow-600">
                    {`${product.price.toFixed(2)}€`}
                  </span>
                  {product.originalPrice &&
                    product.originalPrice > product.price && (
                      <span className="text-sm text-gray-400 line-through font-medium">
                        {product.originalPrice.toFixed(2)}€
                      </span>
                    )}
                </div>
              </div>

              <div className="flex gap-2 mt-2">
                <Link href={`/produto/${product.id}`} className="flex-1">
                  <Button className="w-full font-bold py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-black">
                    Ver Detalhes
                  </Button>
                </Link>

                {/* Botão Carrinho */}
                <Button
                  size="lg"
                  variant="outline"
                  className="px-4 py-3 rounded-xl border-2 border-yellow-200 hover:border-yellow-300 hover:bg-yellow-50"
                  onClick={() => addToCart(product)}
                >
                  <ShoppingCart className="w-5 h-5 text-yellow-600" />
                </Button>

                {/* Botão Favoritos */}
                <Button
                  size="lg"
                  variant="outline"
                  className={`px-4 py-3 rounded-xl border-2 ${
                    favorites.includes(String(product.id))
                      ? "bg-red-100 border-red-300"
                      : "border-yellow-200 hover:border-yellow-300 hover:bg-yellow-50"
                  }`}
                  onClick={() => toggleFavorite(product.id)}
                >
                  <Heart
                    className={`w-5 h-5 ${
                      favorites.includes(String(product.id))
                        ? "fill-red-500 text-red-500"
                        : "text-yellow-600"
                    }`}
                  />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ProductsGridImpl
