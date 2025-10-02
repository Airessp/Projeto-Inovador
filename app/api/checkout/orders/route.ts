// app/api/orders/create/route.ts
import { NextResponse } from "next/server"

const WC_API_URL = process.env.WC_API_URL
const WC_KEY = process.env.WC_CONSUMER_KEY
const WC_SECRET = process.env.WC_CONSUMER_SECRET

function reqFail(status: number, message: string, details?: any) {
  return NextResponse.json({ message, details }, { status })
}

function authHeader() {
  return "Basic " + Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64")
}

async function wcFetch(path: string, init?: RequestInit) {
  if (!WC_API_URL || !WC_KEY || !WC_SECRET) {
    throw new Error("❌ Credenciais WooCommerce em falta no servidor (.env.local)")
  }
  const url = `${WC_API_URL.replace(/\/$/, "")}${path}`

  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  })

  const txt = await res.text()
  let json: any = null
  try { json = txt ? JSON.parse(txt) : null } catch {}

  if (!res.ok) {
    const msg = json?.message || json?.error || `Woo error [${res.status}]`
    console.error("❌ WooCommerce API error:", msg, { url, body: init?.body })
    throw new Error(msg)
  }
  return json
}

// ------------------- HELPERS -------------------

/** devolve customer (ou null) por email */
async function getCustomerByEmail(email: string) {
  const list = await wcFetch(`/customers?email=${encodeURIComponent(email)}&per_page=1`)
  return Array.isArray(list) && list.length ? list[0] : null
}

/** cria customer mínimo se não existir */
async function ensureCustomerByEmail(email: string, name?: string) {
  const found = await getCustomerByEmail(email)
  if (found) return found

  const username =
    email.split("@")[0].replace(/[^a-z0-9._-]/gi, "").slice(0, 40) || email
  const password = Math.random().toString(36).slice(2) + "A!"

  return wcFetch(`/customers`, {
    method: "POST",
    body: JSON.stringify({
      email,
      username,
      password,
      first_name: name || "",
      role: "customer",
    }),
  })
}

/** tenta resolver product_id por id/sku/name */
async function resolveProductId(it: any): Promise<number> {
  if (it?.product_id && Number(it.product_id) > 0) {
    try {
      await wcFetch(`/products/${it.product_id}`)
      return Number(it.product_id)
    } catch { /* continua */ }
  }

  if (it?.sku) {
    const arr = await wcFetch(`/products?sku=${encodeURIComponent(it.sku)}`)
    if (Array.isArray(arr) && arr.length > 0) return arr[0].id
  }

  if (it?.name) {
    const arr = await wcFetch(`/products?search=${encodeURIComponent(String(it.name))}`)
    if (Array.isArray(arr) && arr.length > 0) return arr[0].id
  }

  throw new Error(`❌ Produto não encontrado (id:${it?.product_id} sku:${it?.sku} name:${it?.name}).`)
}

// ------------------- ROUTE HANDLER -------------------

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const billing = body?.billing || {}

    if (!billing?.email) {
      return reqFail(400, "Email de faturação é obrigatório.")
    }
    if (!Array.isArray(body?.line_items) || body.line_items.length === 0) {
      return reqFail(400, "O carrinho está vazio.")
    }

    // garantir cliente
    const email = (billing.email || body.customer_email).trim().toLowerCase()
    const name = billing.first_name || body.customer_name || ""
    const customer = await ensureCustomerByEmail(email, name)

    // resolver produtos
    const line_items = []
    for (const raw of body.line_items) {
      const product_id = await resolveProductId(raw)
      const quantity = Number(raw.quantity || 1)
      line_items.push({ product_id, quantity })
    }

    // payload final para WooCommerce
    const payload: any = {
      customer_id: customer.id,
      payment_method: body.payment_method || "cod",
      payment_method_title: body.payment_method_title || "Pagamento na Entrega",
      set_paid: !!body.set_paid,
      billing,
      shipping: body.shipping || billing,
      line_items,
    }

    const order = await wcFetch(`/orders`, {
      method: "POST",
      body: JSON.stringify(payload),
    })

    return NextResponse.json(order, { status: 201 })
  } catch (err: any) {
    console.error("❌ create order:", err?.message || err)
    return reqFail(400, err?.message || "Erro ao criar encomenda")
  }
}
