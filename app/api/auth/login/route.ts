// app/api/auth/login/route.ts
import { NextResponse } from "next/server"

// 👇 força sempre runtime (impede cache/SSG)
export const dynamic = "force-dynamic"

const WP_BASE =
  process.env.WC_API_URL?.replace(/\/wp-json\/.*$/i, "") ||
  process.env.WP_BASE_URL ||
  ""

export async function POST(req: Request) {
  try {
    if (!WP_BASE) {
      return NextResponse.json(
        { message: "❌ WP_BASE_URL ou WC_API_URL não configurado no .env" },
        { status: 500 }
      )
    }

    const body = await req.json()
    const username = (body.username || "").toString()
    const password = (body.password || "").toString()

    if (!username || !password) {
      return NextResponse.json(
        { message: "username/password required" },
        { status: 400 }
      )
    }

    const jwtUrl = `${WP_BASE.replace(/\/$/, "")}/wp-json/jwt-auth/v1/token`

    const res = await fetch(jwtUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      cache: "no-store", // 🔹 garante sempre fresh request
    })

    const text = await res.text()
    let json: any = null
    try {
      json = text ? JSON.parse(text) : null
    } catch {
      /* resposta não JSON */
    }

    if (!res.ok) {
      // JWT plugin retorna 401/403 -> normalizar mensagem
      const msg =
        json?.message || json?.data?.message || "Credenciais inválidas"
      return NextResponse.json({ message: msg }, { status: 401 })
    }

    // ✅ sucesso -> devolver token e info user
    return NextResponse.json(json, { status: 200 })
  } catch (err: any) {
    console.error("❌ API /auth/login error:", err)
    return NextResponse.json(
      { message: err?.message || "Erro interno no servidor" },
      { status: 500 }
    )
  }
}
