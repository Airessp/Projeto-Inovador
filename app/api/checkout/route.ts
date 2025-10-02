// app/api/orders/create/route.ts
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const url = `${process.env.WC_API_URL?.replace(/\/$/, "")}/orders`
    const auth = Buffer.from(
      `${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`
    ).toString("base64")

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    })

    const text = await res.text()
    let data: any = null
    try {
      data = text ? JSON.parse(text) : null
    } catch {
      data = { raw: text } // caso Woo retorne HTML
    }

    if (!res.ok) {
      console.error("❌ WooCommerce API error:", data)
      return NextResponse.json(
        { error: "WooCommerce API error", details: data },
        { status: res.status }
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (err: any) {
    console.error("❌ API /orders/create error:", err)
    return NextResponse.json(
      { error: "Internal Server Error", details: err?.message || err },
      { status: 500 }
    )
  }
}
