import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// 🔹 Normalizador comum
const normalize = (p: any) => ({
  id: Number(p.id),
  name: p.name,
  categories: Array.isArray(p.categories)
    ? p.categories
    : p.category
    ? [p.category]
    : ["Outros"],
  brand: p.brand || "Genérico",
  price: Number(p.price ?? 0),
  originalPrice: p.originalPrice && Number(p.originalPrice) > 0
    ? Number(p.originalPrice)
    : undefined,
  image: p.image || "/placeholder.svg",
  description: p.description || "",
  inStock: p.inStock !== undefined ? p.inStock : true,
  rating: Number(p.rating ?? 0),
  reviews: Number(p.reviews ?? 0),
  isPromo: Boolean(p.isPromo),
})

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public/data/products.json")
    const file = fs.readFileSync(filePath, "utf-8")
    const json = JSON.parse(file)
    const list = Array.isArray(json) ? json : json.products

    return NextResponse.json(list.map(normalize))
  } catch (err: any) {
    console.error("❌ Erro a carregar products.json:", err.message)
    return NextResponse.json([], { status: 500 })
  }
}
