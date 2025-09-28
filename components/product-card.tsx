"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart } from "lucide-react"

interface ProductCardProps {
  id: number
  name: string
  brand?: string
  category?: string
  price: number
  originalPrice?: number | null
  rating?: number
  image: string
  inStock?: boolean
  isPromo?: boolean
  compact?: boolean
  hideCartButton?: boolean
  extraButton?: React.ReactNode   // 👈 novo
}

export function ProductCard({
  id,
  name,
  brand,
  category,
  price,
  originalPrice,
  rating,
  image,
  inStock = true,
  isPromo = false,
  compact = false,
  hideCartButton = false,
  extraButton,
}: ProductCardProps) {
  const addToCart = () => {
    const savedCart = localStorage.getItem("projeto-inovador-cart")
    let cart = savedCart ? JSON.parse(savedCart) : []

    const existingItem = cart.find((item: any) => item.id === id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({
        id,
        name,
        price,
        image,
        quantity: 1,
      })
    }

    localStorage.setItem("projeto-inovador-cart", JSON.stringify(cart))
    window.dispatchEvent(new Event("cartUpdated"))
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow overflow-hidden rounded-lg border">
      <div className="relative">
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          className={`w-full object-cover group-hover:scale-105 transition-transform ${
            compact ? "h-32" : "h-48"
          }`}
        />
        {isPromo && (
          <Badge className="absolute top-3 left-3 bg-yellow-500 text-black">
            Promoção
          </Badge>
        )}
        {!inStock && (
          <Badge variant="secondary" className="absolute top-3 right-3">
            Esgotado
          </Badge>
        )}
      </div>

      <CardContent className={compact ? "p-3" : "p-4"}>
        {category && (
          <div className="mb-2">
            <Badge
              variant="outline"
              className="text-xs border-yellow-500 text-yellow-700"
            >
              {category}
            </Badge>
          </div>
        )}

        <h3
          className={`font-semibold mb-1 line-clamp-2 ${
            compact ? "text-sm" : "text-base"
          }`}
        >
          {name}
        </h3>

        {brand && <p className="text-xs text-muted-foreground mb-2">{brand}</p>}

        {rating && (
          <div className="flex items-center gap-1 mb-3">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-muted-foreground">{rating}</span>
          </div>
        )}

        <div className="mb-3">
          <div className="flex items-center gap-2">
            <span className="text-yellow-600 font-bold">{price}€</span>
            {originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {originalPrice}€
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Link href={`/produto/${id}`} className="flex-1">
            <Button
              size="sm"
              variant="outline"
              className="w-full border-yellow-500 text-yellow-600 hover:bg-yellow-100"
            >
              Ver Detalhes
            </Button>
          </Link>

          {!hideCartButton && inStock && (
            <Button
              size="sm"
              onClick={addToCart}
              className="px-3 bg-yellow-500 hover:bg-yellow-600 text-black"
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* 👇 botão extra aparece debaixo do Ver Detalhes */}
        {extraButton && <div className="mt-2">{extraButton}</div>}
      </CardContent>
    </Card>
  )
}
