import { NextResponse } from "next/server"

const { WC_API_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET } = process.env

if (!WC_API_URL || !WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
  throw new Error("⚠️ Credenciais WooCommerce em falta no servidor.")
}

const auth =
  "Basic " +
  Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString("base64")

// Como no teu .env já tens "/wp-json/wc/v3", aqui não adicionamos de novo
const ep = (p: string) => `${WC_API_URL}${p}`

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // payload básico
    const payload = {
      email: body.email,
      username: body.username || body.email,
      password: body.password,
      billing: {
        first_name: body.first_name || "",
        last_name: body.last_name || "",
        email: body.email,
      },
    }

    const res = await fetch(ep("/customers"), {
      method: "POST",
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const text = await res.text()

    // Debug melhorado: loga tudo o que vier da API
    console.log("WooCommerce response:", res.status, text)

    if (!res.ok) {
      return NextResponse.json(
        { error: `WooCommerce error ${res.status}: ${text}` },
        { status: res.status }
      )
    }

    const data = JSON.parse(text)
    return NextResponse.json(data, { status: 200 })
  } catch (err: any) {
    console.error("❌ Erro no POST /api/customers/register:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
