import { NextResponse } from "next/server"
import { getCustomerByEmail, wcFetch } from "@/lib/woocommerce"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, username, password } = body

    // já existe cliente?
    const existing = await getCustomerByEmail(email)
    if (existing) {
      return NextResponse.json({ error: "Utilizador já existe" }, { status: 400 })
    }

    const customer = await wcFetch(`/customers`, {
      method: "POST",
      body: JSON.stringify({
        email,
        username,
        password,
      }),
    })

    return NextResponse.json(customer)
  } catch (e: any) {
    console.error("❌ erro criar conta:", e?.message || e)
    return NextResponse.json({ error: e?.message || "Erro inesperado" }, { status: 500 })
  }
}
