// app/api/orders/by-customer/route.ts
import { NextResponse } from "next/server"
import { getOrdersByCustomerServer } from "@/lib/woocommerce"

export async function POST(req: Request) {
  try {
    const { customer_id } = await req.json()
    if (!customer_id) return NextResponse.json({ message: "customer_id em falta" }, { status: 400 })
    const orders = await getOrdersByCustomerServer(Number(customer_id))
    return NextResponse.json(orders)
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || "Erro" }, { status: 400 })
  }
}
