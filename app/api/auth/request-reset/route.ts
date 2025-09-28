import { NextResponse } from "next/server"
import { getCustomerByEmailServer } from "@/lib/woocommerce"
import nodemailer from "nodemailer"

type ResetEntry = { code: string; expiresAt: number; email: string }
const STORE = new Map<string, ResetEntry>() // email -> entry (in-memory)

function genCode() {
  return Math.floor(100000 + Math.random() * 900000).toString() // 6 dígitos
}

async function sendEmail(to: string, subject: string, html: string) {
  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER || "no-reply@local"

  // ⚡ Se não houver config SMTP → simulação
  if (!host || !port || !user || !pass) {
    console.warn("⚠️ SMTP não configurado — a enviar código via logs (simulação)")
    console.log(`EMAIL TO: ${to}\nSUBJECT: ${subject}\nHTML: ${html}`)
    return true
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // SSL/TLS no 465, STARTTLS no 587
      auth: { user, pass },
    })

    await transporter.sendMail({ from, to, subject, html })
    return true
  } catch (err) {
    console.error("❌ Erro a enviar email SMTP:", err)
    console.warn("➡️ A cair em modo SIMULAÇÃO: email não enviado mas fluxo continua")
    console.log(`EMAIL TO: ${to}\nSUBJECT: ${subject}\nHTML: ${html}`)
    return false
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const email = (body?.email || "").toString().trim().toLowerCase()
    if (!email) {
      return NextResponse.json({ message: "Email obrigatório" }, { status: 400 })
    }

    // confirmar se existe cliente no WooCommerce
    const customer = await getCustomerByEmailServer(email)
    if (!customer) {
      // não dizemos explicitamente se existe para não dar info a atacantes
      return NextResponse.json(
        { message: "Se existir conta, será enviado um email com instruções." },
        { status: 200 }
      )
    }

    // gerar código temporário
    const code = genCode()
    const expiresAt = Date.now() + 1000 * 60 * 15 // 15 mins
    STORE.set(email, { code, expiresAt, email })

    const html = `<p>Olá,</p>
      <p>Usa o código <strong>${code}</strong> para repor a tua palavra-passe. 
      Este código expira em 15 minutos.</p>
      <p>Se não solicitaste, ignora este email.</p>`

    await sendEmail(email, "Pedido de reposição de palavra-passe", html)

    return NextResponse.json(
      { message: "Se existir conta, será enviado um email com instruções." },
      { status: 200 }
    )
  } catch (err: any) {
    console.error("request-reset error:", err)
    return NextResponse.json({ message: "Erro interno" }, { status: 500 })
  }
}

// ⚡ Exporta o STORE para outras rotas (ex: verify-reset)
export { STORE }
