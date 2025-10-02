// app/api/customers/[id]/route.ts
import { NextResponse } from "next/server"

const WC_API_URL = process.env.WC_API_URL
const WC_KEY = process.env.WC_CONSUMER_KEY
const WC_SECRET = process.env.WC_CONSUMER_SECRET

if (!WC_API_URL || !WC_KEY || !WC_SECRET) {
  console.error("❌ Variáveis WooCommerce em falta no servidor (.env.local)")
}

function authHeader() {
  return "Basic " + Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64")
}

async function wcFetch(path: string, init?: RequestInit) {
  if (!WC_API_URL || !WC_KEY || !WC_SECRET) {
    throw new Error("Credenciais WooCommerce em falta no servidor.")
  }

  const url = `${WC_API_URL.replace(/\/$/, "")}${path}`
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  })

  const txt = await res.text()
  let json: any = null
  try {
    json = txt ? JSON.parse(txt) : null
  } catch {
    console.warn("⚠️ Resposta Woo não era JSON:", txt.slice(0, 200))
  }

  if (!res.ok) {
    const msg = json?.message || `WooCommerce error [${res.status}]`
    throw new Error(msg)
  }

  return json
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params?.id
    if (!id) {
      return NextResponse.json(
        { message: "ID do cliente em falta." },
        { status: 400 }
      )
    }

    const body = await req.json()
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { message: "Body vazio, nada para atualizar." },
        { status: 400 }
      )
    }

    const data = await wcFetch(`/customers/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    })

    return NextResponse.json(data, { status: 200 })
  } catch (e: any) {
    console.error("❌ erro update customer:", e?.message || e)
    return NextResponse.json(
      { message: e?.message || "Erro interno ao atualizar cliente" },
      { status: 500 }
    )
  }
}
