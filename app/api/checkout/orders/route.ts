import { NextResponse } from "next/server"

const WC_API_URL = process.env.WC_API_URL
const WC_KEY = process.env.WC_CONSUMER_KEY
const WC_SECRET = process.env.WC_CONSUMER_SECRET

function reqFail(status: number, message: string, details?: any) {
  return NextResponse.json({ message, details }, { status })
}

function authHeader() {
  const token = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64")
  return `Basic ${token}`
}

async function wcFetch(path: string, init?: RequestInit) {
  if (!WC_API_URL || !WC_KEY || !WC_SECRET) {
    throw new Error("❌ Credenciais WooCommerce em falta no servidor.")
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
  const text = await res.text()
  let json: any = null
  try {
    json = text ? JSON.parse(text) : null
  } catch {}
  if (!res.ok) {
    const msg = json?.message || json?.error || `Woo error [${res.status}]`
    throw new Error(msg)
  }
  return json
}

/** devolve customer (ou null) por email */
async function getCustomerByEmail(email: string) {
  const list = await wcFetch(`/customers?email=${encodeURIComponent(email)}`)
  if (Array.isArray(list) && list.length) return list[0]
  return null
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
  // 1) id direto válido?
  if (it?.product_id && Number(it.product_id) > 0) {
    try {
      await wcFetch(`/products/${it.product_id}`)
      return Number(it.product_id)
    } catch {
      /* continua */
    }
  }

  // 2) por sku
  if (it?.sku) {
    const arr = await wcFetch(`/products?sku=${encodeURIComponent(it.sku)}`)
    if (Array.isArray(arr) && arr.length > 0) return arr[0].id
  }

  // 3) por nome
  if (it?.name) {
    const arr = await wcFetch(
      `/products?search=${encodeURIComponent(String(it.name))}`
    )
    if (Array.isArray(arr) && arr.length > 0) return arr[0].id
  }

  throw new Error(
    `❌ Não encontrei produto para item (id:${it?.product_id} sku:${it?.sku} name:${it?.name}).`
  )
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const billing = body?.billing || {}

    if (!billing?.email) return reqFail(400, "Email de faturação é obrigatório.")
    if (!Array.isArray(body?.line_items) || body.line_items.length === 0)
      return reqFail(400, "O carrinho está vazio.")

    // garantir cliente
    const email = (billing.email || body.customer_email).trim()
    const name = billing.first_name || body.customer_name || ""
    const customer = await ensureCustomerByEmail(email, name)

    // resolver produtos
    const line_items = []
    for (const raw of body.line_items) {
      const product_id = await resolveProductId(raw)
      const quantity = Number(raw.quantity || 1)
      line_items.push({ product_id, quantity })
    }

    // payload final
    const payload: any = {
      customer_id: customer.id,
      payment_method: body.payment_method || "cod",
      payment_method_title:
        body.payment_method_title || "Pagamento na Entrega",
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
    return reqFail(400, err?.message || "Pedido inválido")
  }
}
