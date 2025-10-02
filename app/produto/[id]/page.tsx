"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ProductCard } from "@/components/product-card"
import { RatingStars } from "@/components/rating-stars"
import { PriceDisplay } from "@/components/price-display"
import { Footer } from "@/components/footer"
import { Chatbot } from "@/components/chatbot"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Truck, Shield, RotateCcw, Heart, Share2, ShoppingCart } from "lucide-react"
import Link from "next/link"

type Product = {
  id: number
  name: string
  categories: string[]
  brand?: string
  price: number
  originalPrice?: number
  image: string
  description?: string
  inStock: boolean
  stock?: number
  rating?: number
  reviews?: number
  isPromo?: boolean
}

export default function ProductPage() {
  const { id } = useParams()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      if (!id) return
      try {
        setLoading(true)

        // 🔹 Buscar produto específico
        const res = await fetch(`/api/products/${id}`, { cache: "no-store" })
        if (!res.ok) throw new Error("Erro ao carregar produto")
        const current: Product = await res.json()
        setProduct(current)

        // 🔹 Buscar todos para relacionados
        const allRes = await fetch("/api/products", { cache: "no-store" })
        const all: Product[] = await allRes.json()

        if (current) {
          const sameCat = all.filter(
            (x) =>
              x.categories?.some(
                (c) => c.toLowerCase() === current.categories?.[0]?.toLowerCase()
              ) && String(x.id) !== String(current.id)
          )
          setRelatedProducts(sameCat.slice(0, 4))
        }
      } catch (e) {
        console.error("Erro a carregar produto:", e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  // 🔹 Ações
  const addToCart = () => {
    if (!product) return
    const savedCart = localStorage.getItem("projeto-inovador-cart")
    const cart = savedCart ? JSON.parse(savedCart) : []
    const idx = cart.findIndex((i: any) => String(i.id) === String(product.id))
    if (idx >= 0) cart[idx].quantity += 1
    else cart.push({ ...product, quantity: 1 })
    localStorage.setItem("projeto-inovador-cart", JSON.stringify(cart))
    window.dispatchEvent(new Event("cartUpdated"))
    alert("✅ Produto adicionado ao carrinho!")
  }

  const addToFavorites = () => {
    if (!product) return
    const user = localStorage.getItem("projeto-inovador-user") || "guest"
    const key = `projeto-inovador-favorites-${user}`
    const favs: (string | number)[] = JSON.parse(localStorage.getItem(key) || "[]")

    if (!favs.includes(product.id)) {
      favs.push(product.id)
      localStorage.setItem(key, JSON.stringify(favs))
      window.dispatchEvent(new Event("favoritesUpdated"))
      alert("❤️ Produto adicionado aos favoritos!")
    } else {
      alert("⚠️ Este produto já está nos favoritos.")
    }
  }

  const shareProduct = () => {
    if (!product) return
    const url = `${window.location.origin}/produtos/${product.id}`
    navigator.clipboard.writeText(url)
    alert(`🔗 Link copiado: ${url}`)
  }

  // 🔹 Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">A carregar produto...</p>
        </div>
      </div>
    )
  }

  // 🔹 Não encontrado
  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
            <p className="text-muted-foreground mb-4">
              O produto que procura não existe ou foi removido.
            </p>
            <Button asChild>
              <Link href="/produtos">Voltar aos Produtos</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // 🔹 Página de detalhes
  return (
    <div className="min-h-screen bg-background">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
          <div className="container mx-auto px-6 py-8">
            <BreadcrumbNav
              items={[
                { label: "Produtos", href: "/produtos" },
                {
                  label: product.categories?.[0] || "Outros",
                  href: `/produtos?categoria=${(product.categories?.[0] || "outros").toLowerCase()}`,
                },
                { label: product.name },
              ]}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
              {/* Imagem */}
              <div className="space-y-4">
                <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Detalhes */}
              <div className="space-y-6">
                <div>
                  <Badge variant="outline" className="mb-2">
                    {product.categories?.[0] || "Outros"}
                  </Badge>
                  <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                  <p className="text-muted-foreground">{product.brand}</p>
                </div>

                <div className="flex items-center gap-4">
                  <RatingStars rating={product.rating || 4} size="lg" />
                  <span className="text-sm text-muted-foreground">
                    ({product.reviews || 0} avaliações)
                  </span>
                </div>

                <PriceDisplay price={product.price} originalPrice={product.originalPrice} size="lg" />
                <p className="text-muted-foreground">
                  {product.description || "Sem descrição disponível."}
                </p>

                <div className="flex gap-3">
                  <Button size="lg" className="flex-1" onClick={addToCart}>
                    <ShoppingCart className="w-5 h-5 mr-2" /> Adicionar ao Carrinho
                  </Button>
                  <Button size="lg" variant="outline" onClick={addToFavorites}>
                    <Heart className="w-5 h-5" />
                  </Button>
                  <Button size="lg" variant="outline" onClick={shareProduct}>
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                  <div className="text-center">
                    <Truck className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium">Entrega Grátis</p>
                    <p className="text-xs text-muted-foreground">Compras +50€</p>
                  </div>
                  <div className="text-center">
                    <Shield className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium">Garantia</p>
                    <p className="text-xs text-muted-foreground">2 anos</p>
                  </div>
                  <div className="text-center">
                    <RotateCcw className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium">Devolução</p>
                    <p className="text-xs text-muted-foreground">14 dias</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Especificações */}
            <Card className="mb-12">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Especificações Técnicas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Marca</span>
                    <span className="text-muted-foreground">{product.brand || "Genérica"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Categoria</span>
                    <span className="text-muted-foreground">{product.categories?.[0] || "Outros"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Disponibilidade</span>
                    <span className="text-muted-foreground">
                      {product.inStock ? "Em Stock" : "Esgotado"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Avaliação</span>
                    <span className="text-muted-foreground">{product.rating || 4}/5 estrelas</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Relacionados */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Produtos Relacionados</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((rp) => (
                  <ProductCard key={rp.id} {...rp} compact />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
      <Chatbot />
    </div>
  )
}
