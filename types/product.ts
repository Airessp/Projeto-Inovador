export type Product = {
  id: number
  name: string
  category?: string         // 🔹 deixamos opcional
  categories?: string[]     // 🔹 novo, array
  brand: string
  price: number
  originalPrice?: number
  image: string
  description: string
  inStock?: boolean
  stock?: number
  rating: number
  reviews: number
  isPromo?: boolean
}
