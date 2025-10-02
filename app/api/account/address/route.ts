import { NextResponse } from "next/server"

// 👇 força esta rota a correr sempre em runtime (não tenta SSG)
export const dynamic = "force-dynamic"

const WC_API_URL = process.env.WC_API_URL
const WC_KEY = process.env.WC_CONSUMER_KEY
const WC_SECRET = process.env.WC_CONSUMER_SECRET

function authHeader() {
  return "Basic " + Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64")
}

async function wcFetch(path: string, init?: RequestInit) {
  if (!WC_API_URL || !WC_KEY || !WC_SECRET) {
    throw new Error("❌ Credenciais WooCommerce em falta no servidor (.env.local)")
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
    /* resposta não era JSON */
  }

  if (!res.ok) {
    throw new Error(json?.message || `Woo error [${res.status}]`)
  }

  return json
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    if (!body.email || !body.password) {
      return NextResponse.json(
        { message: "Email e password são obrigatórios" },
        { status: 400 }
      )
    }

    // 🔎 verificar se já existe cliente com este email
    const exists = await wcFetch(
      `/customers?email=${encodeURIComponent(body.email)}&per_page=1`
    )
    if (Array.isArray(exists) && exists.length > 0) {
      return NextResponse.json(
        { message: "Já existe conta com este email." },
        { status: 400 }
      )
    }

    // 👤 criar cliente novo
    const created = await wcFetch(`/customers`, {
      method: "POST",
      body: JSON.stringify({
        email: body.email,
        username: body.username || body.email.split("@")[0],
        password: body.password,
        first_name: body.first_name || "",
        last_name: body.last_name || "",
      }),
    })

    return NextResponse.json(created, { status: 201 })
  } catch (err: any) {
    console.error("❌ erro register:", err?.message || err)
    return NextResponse.json(
      { message: err?.message || "Erro no servidor" },
      { status: 500 }
    )
  }
}
