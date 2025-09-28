import { NextResponse } from "next/server"
import { STORE } from "../request-reset/route"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const email = (body?.email || "").toString().trim().toLowerCase()
    const code = (body?.code || "").toString().trim()

    if (!email || !code) {
      return NextResponse.json({ message: "Email e código são obrigatórios." }, { status: 400 })
    }

    const entry = STORE.get(email)
    if (!entry || entry.code !== code) {
      return NextResponse.json({ message: "Código inválido." }, { status: 400 })
    }

    if (Date.now() > entry.expiresAt) {
      STORE.delete(email)
      return NextResponse.json({ message: "Código expirado." }, { status: 400 })
    }

    return NextResponse.json({ message: "Código válido." }, { status: 200 })
  } catch (err) {
    console.error("verify-reset error:", err)
    return NextResponse.json({ message: "Erro interno" }, { status: 500 })
  }
}
