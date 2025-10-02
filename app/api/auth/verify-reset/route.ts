import { NextResponse } from "next/server"
import { STORE } from "../request-reset/route"

export const dynamic = "force-dynamic" // evita cache no Next.js

export async function POST(req: Request) {
  try {
    let body: any
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ message: "Body inválido" }, { status: 400 })
    }

    const email = (body?.email || "").toString().trim().toLowerCase()
    const code = (body?.code || "").toString().trim()

    if (!email || !code) {
      return NextResponse.json(
        { message: "Email e código são obrigatórios." },
        { status: 400 }
      )
    }

    const entry = STORE.get(email)
    if (!entry || entry.code !== code) {
      return NextResponse.json({ message: "Código inválido." }, { status: 400 })
    }

    if (Date.now() > entry.expiresAt) {
      STORE.delete(email)
      return NextResponse.json({ message: "Código expirado." }, { status: 400 })
    }

    return NextResponse.json(
      { message: "Código válido." },
      { status: 200 }
    )
  } catch (err: any) {
    console.error("❌ verify-reset error:", err?.message || err)
    return NextResponse.json(
      { message: err?.message || "Erro interno" },
      { status: 500 }
    )
  }
}
