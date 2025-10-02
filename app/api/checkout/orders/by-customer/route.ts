// app/api/orders/by-customer/route.ts
import { NextResponse } from "next/server"
import { getOrdersByCustomerServer } from "@/lib/woocommerce"

export const dynamic = "force-dynamic" // ⚡ evita cache no Next.js

export async function POST(req: Request) {
  try {
    let body: any
    try {
      body = await req.json()
    } catch {
      return NextResponse.json(
        { message: "Body inválido" },
        { status: 400 }
      )
    }

    const customer_id = Number(body?.customer_id)
    if (!customer_id || isNaN(customer_id)) {
      return NextResponse.json(
        { message: "customer_id em falta ou inválido" },
        { status: 400 }
      )
    }

    const orders = await getOrdersByCustomerServer(customer_id)

    return NextResponse.json(orders, { status: 200 })
  } catch (e: any) {
    console.error("❌ erro /orders/by-customer:", e?.message || e)
    return NextResponse.json(
      { message: e?.message || "Erro ao buscar encomendas" },
      { status: 500 }
    )
  }
}
