// app/api/customers/auto-register/route.ts
import { NextResponse } from "next/server"
import crypto from "crypto"

const { WC_API_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET } = process.env
if (!WC_API_URL || !WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
  throw new Error("⚠️ Credenciais WooCommerce em falta no servidor (.env.local)")
}

const BASE = WC_API_URL.replace(/\/$/, "")
const AUTH =
  "Basic " + Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString("base64")
const ep = (p: string) =>
  BASE.endsWith("/wc/v3") ? `${BASE}${p}` : `${BASE}/wp-json/wc/v3${p}`

export async function POST(req: Request) {
  try {
    const { email, first_name, last_name, billing } = await req.json()

    if (!email) {
      return NextResponse.json({ error: "Email obrigatório." }, { status: 400 })
    }

    // username + password aleatórios
    const usernameBase = email.split("@")[0].replace(/\W+/g, "") || "user"
    const payload: any = {
      email,
      username: `${usernameBase}_${Math.floor(Math.random() * 9999)}`,
      password: crypto.randomBytes(12).toString("base64"),
      first_name: first_name || "",
      last_name: last_name || "",
      billing: {
        ...(billing || {}),
        email,
        first_name: billing?.first_name ?? first_name ?? "",
        last_name: billing?.last_name ?? last_name ?? "",
      },
      meta_data: [],
    }

    // NIF opcional
    if (billing?.nif) {
      payload.meta_data.push({ key: "billing_nif", value: billing.nif })
      payload.meta_data.push({ key: "vat_number", value: billing.nif })
    }

    const res = await fetch(ep("/customers"), {
      method: "POST",
      headers: {
        Authorization: AUTH,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    })

    const text = await res.text()
    let data: any = null
    try {
      data = text ? JSON.parse(text) : null
    } catch {
      console.warn("⚠️ WooCommerce respondeu com texto não-JSON:", text)
    }

    if (!res.ok) {
      console.error("❌ Woo create customer error:", res.status, data || text)
      return NextResponse.json(
        { message: data?.message || `Woo error ${res.status}`, details: data || text },
        { status: res.status }
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (e: any) {
    console.error("❌ create customer exception:", e)
    return NextResponse.json({ message: e?.message || "Erro interno" }, { status: 500 })
  }
}
