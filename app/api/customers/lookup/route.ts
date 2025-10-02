import { NextResponse } from "next/server"

const { WC_API_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET } = process.env

if (!WC_API_URL || !WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
  console.error("❌ Faltam credenciais WooCommerce no .env.local")
}

const BASE = (WC_API_URL || "").replace(/\/$/, "")
const AUTH =
  "Basic " +
  Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString("base64")

function ep(path: string) {
  return BASE.endsWith("/wc/v3")
    ? `${BASE}${path}`
    : `${BASE}/wp-json/wc/v3${path}`
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email) {
      return NextResponse.json({ error: "email required" }, { status: 400 })
    }

    const url = ep(`/customers?email=${encodeURIComponent(email)}&per_page=1`)
    const res = await fetch(url, {
      headers: { Authorization: AUTH, "Content-Type": "application/json" },
      cache: "no-store",
    })

    const text = await res.text()
    let json: any = null
    try {
      json = text ? JSON.parse(text) : null
    } catch {
      console.warn("⚠️ Resposta Woo não era JSON:", text?.slice(0, 200))
    }

    if (!res.ok) {
      return NextResponse.json(
        {
          error:
            json?.message || json?.error || `WooCommerce error [${res.status}]`,
          details: json || text,
        },
        { status: res.status }
      )
    }

    if (!Array.isArray(json) || json.length === 0) {
      return NextResponse.json({ notFound: true }, { status: 404 })
    }

    return NextResponse.json(json[0], { status: 200 })
  } catch (e: any) {
    console.error("❌ lookup exception:", e)
    return NextResponse.json(
      { error: e?.message || "Unexpected error" },
      { status: 500 }
    )
  }
}
