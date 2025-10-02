import { NextResponse } from "next/server"

// 👇 força esta rota a ser sempre dinâmica (não tenta build estático)
export const dynamic = "force-dynamic"

const WC_API_URL = process.env.WC_API_URL
const WC_KEY = process.env.WC_CONSUMER_KEY
const WC_SECRET = process.env.WC_CONSUMER_SECRET

function authHeader() {
  return "Basic " + Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64")
}

async function wcFetch(path: string) {
  if (!WC_API_URL || !WC_KEY || !WC_SECRET) {
    throw new Error("❌ Credenciais WooCommerce em falta (.env)")
  }

  const url = `${WC_API_URL.replace(/\/$/, "")}${path}`
  const res = await fetch(url, {
    headers: { Authorization: authHeader(), "Content-Type": "application/json" },
    cache: "no-store", // nunca cache em build
  })

  const txt = await res.text()
  let json: any = null
  try {
    json = txt ? JSON.parse(txt) : null
  } catch {
    // resposta não era JSON válido
  }

  if (!res.ok) throw new Error(json?.message || `Woo error [${res.status}]`)
  return json
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get("email")
    if (!email) return NextResponse.json([])

    // procurar cliente pelo email
    const customers = await wcFetch(
      `/customers?email=${encodeURIComponent(email)}&per_page=1`
    )
    if (!Array.isArray(customers) || customers.length === 0) {
      return NextResponse.json([])
    }

    const customerId = customers[0].id

    // encomendas do cliente
    const orders = await wcFetch(
      `/orders?customer=${customerId}&orderby=date&order=desc&per_page=20`
    )

    return NextResponse.json(orders)
  } catch (e: any) {
    console.error("❌ erro orders:", e?.message || e)
    // devolve array vazio em vez de crashar o build
    return NextResponse.json([], { status: 200 })
  }
}
