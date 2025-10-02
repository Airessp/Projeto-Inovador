// app/api/customers/[id]/route.ts
import { NextResponse } from "next/server"

const WC_API_URL = process.env.WC_API_URL
const WC_KEY = process.env.WC_CONSUMER_KEY
const WC_SECRET = process.env.WC_CONSUMER_SECRET

function fail(status: number, message: string, details?: any) {
  return NextResponse.json({ message, details }, { status })
}

function authHeader() {
  return "Basic " + Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64")
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!WC_API_URL || !WC_KEY || !WC_SECRET) {
      return fail(500, "❌ Credenciais WooCommerce em falta no servidor")
    }

    const id = params?.id
    if (!id) {
      return fail(400, "ID do cliente em falta")
    }

    const data = await req.json()
    if (!data || Object.keys(data).length === 0) {
      return fail(400, "Body vazio: nada para atualizar")
    }

    const res = await fetch(
      `${WC_API_URL.replace(/\/$/, "")}/customers/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: authHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        cache: "no-store",
      }
    )

    const text = await res.text()
    let json: any = null
    try {
      json = text ? JSON.parse(text) : null
    } catch {
      console.warn("⚠️ Resposta Woo não era JSON:", text?.slice(0, 200))
    }

    if (!res.ok) {
      return fail(
        res.status,
        json?.message || json?.error || `Falha a atualizar cliente [${res.status}]`,
        json
      )
    }

    return NextResponse.json(json, { status: 200 })
  } catch (e: any) {
    console.error("❌ erro update customer:", e?.message || e)
    return fail(500, e?.message || "Erro interno ao atualizar cliente")
  }
}
