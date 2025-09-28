"use client"

import { ProductCard } from "@/components/product-card"
import { useState, useEffect } from "react"

export function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const response = await fetch("/data/products.json")
        const data = await response.json()

        // Garante que apanha o array certo
        const productsArray = Array.isArray(data) ? data : data.products
        if (!Array.isArray(productsArray)) {
          console.error("[v0] Products data is not an array:", data)
          setFeaturedProducts([])
          return
        }

        const featured = productsArray.slice(0, 4)
        setFeaturedProducts(featured)
      } catch (error) {
        console.error("[v0] Error loading featured products:", error)
        setFeaturedProducts([])
      }
    }

    loadFeaturedProducts()
  }, [])

  if (featuredProducts.length === 0) {
    return (
      <section className="py-12 px-6">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">
            Produtos Mais Procurados
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-32 rounded-lg mb-3"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-3 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 px-6">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">
          Produtos Mais Procurados
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              compact={true} // 🔹 Garante que no modo homepage também há botão
            />
          ))}
        </div>
      </div>
    </section>
  )
}
