import { NextResponse } from "next/server"

const { WC_API_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET } = process.env

const BASE = (WC_API_URL || "").replace(/\/$/, "")
const auth =
  "Basic " + Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString("base64")
const ep = (p: string) =>
  BASE.endsWith("/wc/v3") ? `${BASE}${p}` : `${BASE}/wp-json/wc/v3${p}`

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: "email required" }, { status: 400 })

    const res = await fetch(ep(`/customers?email=${encodeURIComponent(email)}`), {
      headers: { Authorization: auth },
      cache: "no-store",
    })

    if (!res.ok) {
      const t = await res.text()
      console.error("lookup error:", res.status, t)
      return NextResponse.json({ error: t }, { status: 500 })
    }

    const arr = await res.json()
    if (!Array.isArray(arr) || arr.length === 0) {
      return NextResponse.json({ notFound: true }, { status: 404 })
    }

    return NextResponse.json(arr[0])
  } catch (e: any) {
    console.error("lookup exception:", e)
    return NextResponse.json({ error: e?.message || "error" }, { status: 500 })
  }
}
