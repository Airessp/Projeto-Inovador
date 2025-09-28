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

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    if (!id) {
      return NextResponse.json({ message: "ID inválido" }, { status: 400 })
    }

    // buscar a encomenda pelo ID
    const order = await wcFetch(`/orders/${id}`)

    return NextResponse.json(order)
  } catch (e: any) {
    console.error("❌ erro order detail:", e?.message || e)
    return NextResponse.json(
      { message: e?.message || "Erro ao carregar encomenda" },
      { status: 400 }
    )
  }
}
