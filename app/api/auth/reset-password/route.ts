import { NextResponse } from "next/server"
import { STORE } from "../request-reset/route"
import { getCustomerByEmailServer, updateCustomerServer } from "@/lib/woocommerce"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const email = (body?.email || "").toString().trim().toLowerCase()
    const code = (body?.code || "").toString().trim()
    const newPassword = (body?.password || "").toString().trim()

    if (!email || !code || !newPassword) {
      return NextResponse.json({ message: "Email, código e nova password são obrigatórios." }, { status: 400 })
    }

    const entry = STORE.get(email)
    if (!entry || entry.code !== code) {
      return NextResponse.json({ message: "Código inválido." }, { status: 400 })
    }
    if (Date.now() > entry.expiresAt) {
      STORE.delete(email)
      return NextResponse.json({ message: "Código expirado." }, { status: 400 })
    }

    // confirmar cliente no WooCommerce
    const customer = await getCustomerByEmailServer(email)
    if (!customer) {
      return NextResponse.json({ message: "Cliente não encontrado." }, { status: 404 })
    }

    await updateCustomerServer(customer.id, { password: newPassword })
    STORE.delete(email)

    return NextResponse.json({ message: "Password atualizada com sucesso." }, { status: 200 })
  } catch (err) {
    console.error("reset-password error:", err)
    return NextResponse.json({ message: "Erro interno" }, { status: 500 })
  }
}
