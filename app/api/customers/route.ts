import { NextResponse } from "next/server"
import crypto from "crypto"

const { WC_API_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET } = process.env
const BASE = (WC_API_URL || "").replace(/\/$/, "")
const auth =
  "Basic " + Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString("base64")
const ep = (p: string) =>
  BASE.endsWith("/wc/v3") ? `${BASE}${p}` : `${BASE}/wp-json/wc/v3${p}`

export async function POST(req: Request) {
  try {
    const { email, first_name, last_name, billing } = await req.json()

    if (!email) return NextResponse.json({ error: "email required" }, { status: 400 })

    const usernameBase = email.split("@")[0].replace(/\W+/g, "") || "user"
    const payload: any = {
      email,
      username: `${usernameBase}_${Math.floor(Math.random() * 9999)}`,
      password: crypto.randomBytes(12).toString("base64"),
      first_name,
      last_name,
      billing: {
        ...billing,
        email,
        first_name: billing?.first_name ?? first_name ?? "",
        last_name: billing?.last_name ?? last_name ?? "",
      },
      meta_data: [],
    }

    if (billing?.nif) {
      payload.meta_data.push({ key: "billing_nif", value: billing.nif })
      payload.meta_data.push({ key: "vat_number", value: billing.nif })
    }

    const res = await fetch(ep("/customers"), {
      method: "POST",
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    if (!res.ok) {
      console.error("create customer error:", res.status, data)
      return NextResponse.json(
        { message: data?.message || "Woo create customer error" },
        { status: res.status }
      )
    }

    return NextResponse.json(data)
  } catch (e: any) {
    console.error("create customer exception:", e)
    return NextResponse.json({ message: e?.message || "error" }, { status: 500 })
  }
}
