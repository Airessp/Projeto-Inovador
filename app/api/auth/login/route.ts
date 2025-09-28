// app/api/auth/login/route.ts
import { NextResponse } from "next/server"

const WP_BASE = process.env.WC_API_URL?.replace(/\/wp-json\/.*$/i, "") || process.env.WP_BASE_URL || ""
// assumimos que o JWT plugin está em: {site}/wp-json/jwt-auth/v1/token

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const username = (body.username || "").toString()
    const password = (body.password || "").toString()
    if (!username || !password) {
      return NextResponse.json({ message: "username/password required" }, { status: 400 })
    }

    const jwtUrl = `${WP_BASE.replace(/\/$/, "")}/wp-json/jwt-auth/v1/token`
    const res = await fetch(jwtUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })

    const text = await res.text()
    let json: any = null
    try { json = text ? JSON.parse(text) : null } catch {}

    if (!res.ok) {
      // JWT returns 403/401 for bad creds — normalizar mensagem
      const msg = json?.message || json?.data?.message || "Credenciais inválidas"
      return NextResponse.json({ message: msg }, { status: 401 })
    }

    // sucesso -> devolve token/user
    return NextResponse.json(json, { status: 200 })
  } catch (err: any) {
    console.error("API /auth/login error:", err)
    return NextResponse.json({ message: "Erro interno no servidor" }, { status: 500 })
  }
}
