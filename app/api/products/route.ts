// app/api/products/route.ts
import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const { WC_API_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET } = process.env
const API_BASE = WC_API_URL ? `${WC_API_URL}/wp-json/wc/v3` : null
const authHeader =
  WC_CONSUMER_KEY && WC_CONSUMER_SECRET
    ? "Basic " +
      Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString("base64")
    : null

const stripHtml = (html: string = "") => html.replace(/<[^>]*>/g, "").trim()

const normalize = (p: any) => ({
  id: p.id,
  name: p.name,
  category: p.categories?.[0]?.name || "Outros",
  brand:
    p.attributes?.find((a: any) =>
      ["brand", "marca"].includes(String(a.name).toLowerCase())
    )?.options?.[0] || p.categories?.[0]?.name || "Genérico",
  price: Number(p.price ?? 0) || 0,
  originalPrice:
    p.regular_price && Number(p.regular_price) > 0
      ? Number(p.regular_price)
      : undefined,
  image: p.images?.[0]?.src || "/placeholder.svg",
  description:
    stripHtml(p.short_description) || stripHtml(p.description) || "",
  inStock: p.stock_status === "instock",
  rating: p.average_rating ? Number(p.average_rating) : 0,
  reviews: p.rating_count ?? 0,
  isPromo: !!p.on_sale,
})

export async function GET(req: Request) {
  try {
    if (!API_BASE || !authHeader) {
      throw new Error("⚠️ Variáveis WC_* não configuradas")
    }

    const { searchParams } = new URL(req.url)
    const perPage = searchParams.get("per_page") || "20"
    const page = searchParams.get("page") || "1"

    const res = await fetch(
      `${API_BASE}/products?per_page=${perPage}&page=${page}`,
      {
        headers: { Authorization: authHeader },
        cache: "no-store",
      }
    )

    if (!res.ok) throw new Error(`WooCommerce API error ${res.status}`)

    const data = await res.json()
    if (!Array.isArray(data)) return NextResponse.json([], { status: 200 })

    return NextResponse.json(data.map(normalize))
  } catch (err: any) {
    console.warn("⚠️ WooCommerce falhou, fallback para products.json:", err.message)

    try {
      const filePath = path.join(process.cwd(), "public/data/products.json")
      const file = fs.readFileSync(filePath, "utf-8")
      const json = JSON.parse(file)
      return NextResponse.json(json.products || json)
    } catch (csvErr: any) {
      console.error("❌ Erro a ler fallback:", csvErr.message)
      return NextResponse.json({ error: "Sem produtos disponíveis" }, { status: 500 })
    }
  }
}
