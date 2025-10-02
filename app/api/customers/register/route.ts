// app/api/customers/register/route.ts
import { NextResponse } from "next/server"

const { WC_API_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET } = process.env

if (!WC_API_URL || !WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
  throw new Error("⚠️ Credenciais WooCommerce em falta no servidor (.env.local)")
}

const AUTH =
  "Basic " +
  Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString("base64")

// 🔹 Garante que funciona com e sem /wp-json/wc/v3 no .env
function ep(path: string) {
  return WC_API_URL!.endsWith("/wc/v3") || WC_API_URL!.includes("/wp-json/")
    ? `${WC_API_URL}${path}`
    : `${WC_API_URL}/wp-json/wc/v3${path}`
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, username, first_name, last_name } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e password são obrigatórios." },
        { status: 400 }
      )
    }

    const payload = {
      email,
      username: username || email,
      password,
      billing: {
        first_name: first_name || "",
        last_name: last_name || "",
        email,
      },
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
            json?.message || `WooCommerce error ${res.status}`,
          details: json || text,
        },
        { status: res.status }
      )
    }

    return NextResponse.json(json, { status: 201 })
  } catch (err: any) {
    console.error("❌ Erro no POST /api/customers/register:", err)
    return NextResponse.json(
      { error: err?.message || "Erro interno" },
      { status: 500 }
    )
  }
}
