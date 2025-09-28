import { NextResponse } from "next/server"

const { WC_API_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET } = process.env
const BASE = (WC_API_URL || "").replace(/\/$/, "")
const auth =
  "Basic " + Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString("base64")
const ep = (p: string) =>
  BASE.endsWith("/wc/v3") ? `${BASE}${p}` : `${BASE}/wp-json/wc/v3${p}`

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { billing } = await req.json()

    const payload: any = {
      billing: {
        ...billing,
        email: billing?.email,
      },
      meta_data: [],
    }

    if (billing?.nif) {
      payload.meta_data.push({ key: "billing_nif", value: billing.nif })
      payload.meta_data.push({ key: "vat_number", value: billing.nif })
    }

    const res = await fetch(ep(`/customers/${params.id}`), {
      method: "PUT",
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    if (!res.ok) {
      console.error("update customer error:", res.status, data)
      return NextResponse.json(
        { message: data?.message || "Woo update customer error" },
        { status: res.status }
      )
    }

    return NextResponse.json(data)
  } catch (e: any) {
    console.error("update customer exception:", e)
    return NextResponse.json({ message: e?.message || "error" }, { status: 500 })
  }
}
