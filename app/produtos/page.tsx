"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import ProductsGrid from "@/components/products-grid"
import { Footer } from "@/components/footer"
import { Chatbot } from "@/components/chatbot"
import type { Product } from "@/types/product"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedBrand, setSelectedBrand] = useState<string>("")
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 2000,
  })
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const searchParams = useSearchParams()

  // 🔹 Buscar produtos da API
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/products", { cache: "no-store" })
        if (!res.ok) throw new Error("Erro a carregar produtos")
        const data: Product[] = await res.json()

        // 🔹 Normalizar stock corretamente
        const normalized = data.map((p) => ({
          ...p,
          inStock:
            p.stock !== undefined
              ? p.stock > 0
              : p.inStock !== undefined
              ? p.inStock
              : true,
        }))

        setProducts(normalized)
        setFilteredProducts(normalized)
      } catch (e) {
        console.error("Erro ao carregar produtos:", e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // 🔹 Aplicar filtros e pesquisa
  useEffect(() => {
    let filtered = [...products]

    const categoria = searchParams.get("categoria")
    const brand = searchParams.get("brand")

    if (categoria) {
      setSelectedCategory(categoria)
      const catLower = categoria.toLowerCase()

      // ⚡ Casos especiais
      if (catLower === "apple") {
        filtered = filtered.filter((p) => p.brand?.toLowerCase() === "apple")
      } else if (catLower === "portateis") {
        filtered = filtered.filter(
          (p) =>
            p.category?.toLowerCase() === "computadores" &&
            (p.name.toLowerCase().includes("macbook") ||
              p.name.toLowerCase().includes("laptop") ||
              p.name.toLowerCase().includes("notebook") ||
              p.description.toLowerCase().includes("portátil"))
        )
      } else if (catLower === "desktops") {
        filtered = filtered.filter(
          (p) =>
            p.category?.toLowerCase() === "computadores" &&
            !(
              p.name.toLowerCase().includes("macbook") ||
              p.name.toLowerCase().includes("laptop") ||
              p.name.toLowerCase().includes("notebook") ||
              p.description.toLowerCase().includes("portátil")
            )
        )
      } else if (catLower === "memorias") {
        filtered = filtered.filter(
          (p) =>
            p.category?.toLowerCase() === "componentes" &&
            (p.name.toLowerCase().includes("ram") ||
              p.name.toLowerCase().includes("ddr"))
        )
      } else if (catLower === "placas-graficas") {
        filtered = filtered.filter(
          (p) =>
            p.category?.toLowerCase() === "componentes" &&
            (p.name.toLowerCase().includes("rtx") ||
              p.name.toLowerCase().includes("gpu") ||
              p.name.toLowerCase().includes("graphics"))
        )
      } else if (catLower !== "all") {
        // Normal: filtra por categoria direta
        filtered = filtered.filter(
          (p) => p.category?.toLowerCase() === catLower
        )
      }

      // 🔸 Se houver brand junto, filtra também
      if (brand) {
        setSelectedBrand(brand)
        if (brand.toLowerCase() !== "outros") {
          filtered = filtered.filter(
            (p) => p.brand?.toLowerCase() === brand.toLowerCase()
          )
        } else {
          const excluidos = [
            "apple",
            "samsung",
            "xiaomi",
            "google",
            "oneplus",
            "hp",
            "dell",
            "asus",
            "sony",
            "microsoft",
          ]
          filtered = filtered.filter(
            (p) => !excluidos.includes(p.brand?.toLowerCase())
          )
        }
      }
    } else {
      setSelectedCategory("all")
      setSelectedBrand("")
    }

    // 🔸 Pesquisa
    const query = searchParams.get("q")
    if (query) {
      const q = query.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q)
      )
    }

    // 🔸 Promoções
    const promo = searchParams.get("promo")
    if (promo === "true") {
      filtered = filtered.filter(
        (p) => p.isPromo || (p.originalPrice && p.price < p.originalPrice)
      )
    }

    // 🔸 Filtro de preço
    filtered = filtered.filter(
      (p) => p.price >= priceRange.min && p.price <= priceRange.max
    )

    setFilteredProducts(filtered)
  }, [products, searchParams, priceRange])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onPriceChange={(min, max) => setPriceRange({ min, max })}
        />
        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? "ml-64" : "ml-0"
          }`}
        >
          <div className="container mx-auto px-6 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2 text-gray-900">
                {searchParams.get("promo") === "true"
                  ? "Ofertas Especiais 🔥"
                  : searchParams.get("q")
                  ? `Resultados para "${searchParams.get("q")}" `
                  : "Produtos"}
              </h1>
              <p className="text-gray-600">
                {searchParams.get("promo") === "true"
                  ? "Aproveita já as promoções exclusivas"
                  : "Explore a nossa vasta gama de produtos tecnológicos"}
              </p>
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                <span>{filteredProducts.length} produtos encontrados</span>
                {selectedCategory !== "all" && (
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                    Categoria: {selectedCategory}
                  </span>
                )}
                {selectedBrand && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Marca: {selectedBrand}
                  </span>
                )}
                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                  Preço: €{priceRange.min} - €{priceRange.max}
                </span>
                {searchParams.get("q") && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    Pesquisa: "{searchParams.get("q")}"
                  </span>
                )}
              </div>
            </div>

            <ProductsGrid products={filteredProducts} loading={loading} />
          </div>
        </main>
      </div>
      <Footer />
      <Chatbot />
    </div>
  )
}
