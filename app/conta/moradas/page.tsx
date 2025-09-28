"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"

type Billing = {
  first_name: string
  last_name: string
  address_1: string
  address_2?: string
  city: string
  postcode: string
  country: string
  email: string
  phone: string
  nif?: string
}

export default function MoradasPage() {
  const [billing, setBilling] = useState<Billing>({
    first_name: "",
    last_name: "",
    address_1: "",
    address_2: "",
    city: "",
    postcode: "",
    country: "PT",
    email: "",
    phone: "",
    nif: "",
  })
  const [customerId, setCustomerId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ t: "ok" | "err"; m: string } | null>(null)

  // Carregar dados iniciais / lookup por email
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("projeto_inovador_user") || "null")
    const fallbackEmail = u?.email || ""

    setBilling((prev) => ({
      ...prev,
      email: fallbackEmail,
      first_name: prev.first_name || u?.name?.split(" ")[0] || "",
      last_name: prev.last_name || u?.name?.split(" ")[1] || "",
    }))

    if (!fallbackEmail) {
      setLoading(false)
      return
    }

    ;(async () => {
      try {
        const res = await fetch("/api/customers/lookup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: fallbackEmail }),
        })

        if (res.status === 404) {
          // não existe cliente — deixa o formulário vazio para criar
          setCustomerId(null)
          return
        }

        if (!res.ok) {
          const e = await res.text()
          throw new Error(e || "Falha no lookup")
        }

        const c = await res.json()
        setCustomerId(c.id)

        setBilling({
          first_name: c.billing?.first_name || "",
          last_name: c.billing?.last_name || "",
          address_1: c.billing?.address_1 || "",
          address_2: c.billing?.address_2 || "",
          city: c.billing?.city || "",
          postcode: c.billing?.postcode || "",
          country: c.billing?.country || "PT",
          email: c.email || fallbackEmail,
          phone: c.billing?.phone || "",
          nif:
            c.billing?.nif ||
            c.meta_data?.find?.((m: any) =>
              ["billing_nif", "vat_number", "nif"].includes(String(m?.key).toLowerCase())
            )?.value ||
            "",
        })
      } catch (e) {
        console.error(e)
        setMsg({ t: "err", m: "Erro ao carregar moradas." })
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const onSave = async () => {
    setMsg(null)
    setSaving(true)
    try {
      if (!billing.email) throw new Error("Indica um email.")

      // Se ainda não existe na loja → cria
      if (!customerId) {
        const resCreate = await fetch("/api/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: billing.email,
            first_name: billing.first_name,
            last_name: billing.last_name,
            billing,
          }),
        })
        const created = await resCreate.json()
        if (!resCreate.ok) throw new Error(created?.message || "Falha ao criar cliente")
        setCustomerId(created.id)
        setMsg({ t: "ok", m: "Cliente criado e morada guardada." })
        setSaving(false)
        return
      }

      // Se já existe → atualiza
      const res = await fetch(`/api/customers/${customerId}/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billing }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || "Falha ao guardar")
      setMsg({ t: "ok", m: "Moradas guardadas com sucesso." })
    } catch (e: any) {
      setMsg({ t: "err", m: e?.message || "Falha a guardar moradas." })
    } finally {
      setSaving(false)
    }
  }

  const Input = ({ value, onChange, type = "text", ...rest }: any) => (
    <input
      type={type}
      value={value}
      onChange={onChange}
      {...rest}
      className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-500"
    />
  )
  const Label = ({ children }: any) => (
    <label className="text-sm font-medium mb-1 block">{children}</label>
  )

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="container mx-auto flex-1 px-4 py-10 max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Moradas</h1>
          <Link href="/conta" className="text-sm text-yellow-600 hover:underline">
            ← Voltar ao Painel
          </Link>
        </div>

        {loading ? (
          <p>A carregar moradas…</p>
        ) : (
          <div className="rounded-xl border bg-white p-6 space-y-5 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Primeiro nome</Label>
                <Input
                  value={billing.first_name}
                  onChange={(e: any) => setBilling((p) => ({ ...p, first_name: e.target.value }))}
                />
              </div>
              <div>
                <Label>Apelido</Label>
                <Input
                  value={billing.last_name}
                  onChange={(e: any) => setBilling((p) => ({ ...p, last_name: e.target.value }))}
                />
              </div>
              <div className="md:col-span-2">
                <Label>Morada</Label>
                <Input
                  value={billing.address_1}
                  onChange={(e: any) => setBilling((p) => ({ ...p, address_1: e.target.value }))}
                />
              </div>
              <div className="md:col-span-2">
                <Label>Complemento (opcional)</Label>
                <Input
                  value={billing.address_2}
                  onChange={(e: any) => setBilling((p) => ({ ...p, address_2: e.target.value }))}
                />
              </div>
              <div>
                <Label>Cidade</Label>
                <Input
                  value={billing.city}
                  onChange={(e: any) => setBilling((p) => ({ ...p, city: e.target.value }))}
                />
              </div>
              <div>
                <Label>Código Postal</Label>
                <Input
                  value={billing.postcode}
                  onChange={(e: any) => setBilling((p) => ({ ...p, postcode: e.target.value }))}
                />
              </div>
              <div>
                <Label>País</Label>
                <Input
                  value={billing.country}
                  onChange={(e: any) => setBilling((p) => ({ ...p, country: e.target.value }))}
                />
              </div>
              <div>
                <Label>Telefone</Label>
                <Input
                  value={billing.phone}
                  onChange={(e: any) => setBilling((p) => ({ ...p, phone: e.target.value }))}
                />
              </div>
              <div className="md:col-span-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={billing.email}
                  onChange={(e: any) => setBilling((p) => ({ ...p, email: e.target.value }))}
                />
              </div>
              <div className="md:col-span-2">
                <Label>NIF</Label>
                <Input
                  value={billing.nif}
                  onChange={(e: any) => setBilling((p) => ({ ...p, nif: e.target.value }))}
                  placeholder="Nº de Contribuinte"
                />
              </div>
            </div>

            {msg && (
              <div
                className={`rounded-lg p-3 text-sm ${
                  msg.t === "ok"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {msg.m}
              </div>
            )}

            <button
              onClick={onSave}
              disabled={saving}
              className="rounded-lg bg-yellow-500 px-5 py-2 font-semibold text-black hover:bg-yellow-600 disabled:opacity-60"
            >
              {saving ? "A guardar…" : "Guardar Morada"}
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
