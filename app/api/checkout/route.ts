import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_WC_API_URL}/orders`,
      {
        method: "POST",
        headers: {
          "Authorization":
            "Basic " +
            Buffer.from(
              `${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`
            ).toString("base64"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ WooCommerce API error:", errorText);
      return NextResponse.json(
        { error: "WooCommerce API error", details: errorText },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("❌ API Route error:", err.message);
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message },
      { status: 500 }
    );
  }
}
