// app/api/customers/[id]/route.ts
import { NextResponse } from "next/server"

const WC_API_URL = process.env.WC_API_URL
const WC_KEY = process.env.WC_CONSUMER_KEY
const WC_SECRET = process.env.WC_CONSUMER_SECRET

function fail(status: number, message: string, details?: any) {
  return NextResponse.json({ message, details }, { status })
}

function authHeader() {
  const token = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64")
  return `Basic ${token}`
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const data = await req.json()

    const res = await fetch(
      `${WC_API_URL!.replace(/\/$/, "")}/customers/${id}`,
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
    const json = text ? JSON.parse(text) : null
    if (!res.ok) {
      return fail(
        res.status,
        json?.message || json?.error || "Falha a atualizar cliente",
        json
      )
    }
    return NextResponse.json(json)
  } catch (e: any) {
    return fail(400, e?.message || "Erro a atualizar cliente")
  }
}
