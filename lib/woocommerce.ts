// lib/woocommerce.ts

type AnyObj = Record<string, any>

// ------------------- CLIENT-SIDE HELPERS -------------------
export async function createOrder(orderData: AnyObj) {
  const res = await fetch("/api/checkout/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  })

  let data: any = null
  try {
    data = await res.json()
  } catch {
    /* resposta não JSON */
  }

  if (!res.ok) {
    throw new Error(data?.message || "Erro ao criar a encomenda")
  }
  return data
}

// ------------------- SERVER CONFIG -------------------
const WC_API_URL = process.env.WC_API_URL!
const WC_KEY = process.env.WC_CONSUMER_KEY!
const WC_SECRET = process.env.WC_CONSUMER_SECRET!

function authHeader() {
  const token = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64")
  return `Basic ${token}`
}

// ------------------- GENERIC FETCH -------------------
export async function wcFetchServer(path: string, init?: RequestInit) {
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
  try {
    json = txt ? JSON.parse(txt) : null
  } catch {
    // não era JSON válido
  }

  if (!res.ok) {
    const msg = json?.message || json?.error || `Woo error [${res.status}]`
    throw new Error(msg)
  }

  return json
}

// ------------------- CUSTOMERS -------------------
export async function getCustomerByEmailServer(email: string) {
  const arr = await wcFetchServer(
    `/customers?email=${encodeURIComponent(email)}&per_page=1`
  )
  return Array.isArray(arr) && arr.length ? arr[0] : null
}

export async function createCustomerServer(data: AnyObj) {
  return wcFetchServer(`/customers`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateCustomerServer(id: number, data: AnyObj) {
  return wcFetchServer(`/customers/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

// ------------------- ORDERS -------------------
export async function getOrdersByCustomerServer(customerId: number) {
  return wcFetchServer(
    `/orders?customer=${customerId}&per_page=50&orderby=date&order=desc`
  )
}

export async function getOrderByIdServer(orderId: number) {
  return wcFetchServer(`/orders/${orderId}`)
}

export async function createOrderServer(data: AnyObj) {
  return wcFetchServer(`/orders`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

// ------------------- PRODUCTS -------------------
export async function getProductsServer(
  categoria?: string,
  maxPrice?: number
) {
  let path = `/products?per_page=50`

  if (categoria) path += `&category=${encodeURIComponent(categoria)}`
  if (maxPrice) path += `&max_price=${encodeURIComponent(maxPrice)}`

  return wcFetchServer(path)
}
