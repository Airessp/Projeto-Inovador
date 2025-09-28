import { NextResponse } from "next/server"

const WC_API_URL = process.env.WC_API_URL
const WC_KEY = process.env.WC_CONSUMER_KEY
const WC_SECRET = process.env.WC_CONSUMER_SECRET

function authHeader() {
  return "Basic " + Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64")
}

async function wcFetch(path: string) {
  const url = `${WC_API_URL!.replace(/\/$/, "")}${path}`
  const res = await fetch(url, {
    headers: { Authorization: authHeader(), "Content-Type": "application/json" },
    cache: "no-store",
  })
  const txt = await res.text()
  let json: any = null
  try { json = txt ? JSON.parse(txt) : null } catch {}
  if (!res.ok) throw new Error(json?.message || `Woo error [${res.status}]`)
  return json
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get("email")
    if (!email) return NextResponse.json([])

    // procurar cliente pelo email
    const customers = await wcFetch(`/customers?email=${encodeURIComponent(email)}&per_page=1`)
    if (!Array.isArray(customers) || customers.length === 0) {
      return NextResponse.json([])
    }

    const customerId = customers[0].id
    // encomendas do cliente
    const orders = await wcFetch(`/orders?customer=${customerId}&orderby=date&order=desc&per_page=20`)

    return NextResponse.json(orders)
  } catch (e: any) {
    console.error("❌ erro orders:", e?.message || e)
    return NextResponse.json([], { status: 200 })
  }
}
