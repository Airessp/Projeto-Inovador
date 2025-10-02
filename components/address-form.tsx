"use client"

import { useState } from "react"

type Address = {
  first_name: string
  last_name: string
  address_1: string
  address_2?: string
  city: string
  postcode: string
  country: string
  email?: string
  phone?: string
  nif?: string
}

export function AddressForm() {
  const [billing, setBilling] = useState<Address>({
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

  const [shipping, setShipping] = useState<Address>({
    first_name: "",
    last_name: "",
    address_1: "",
    address_2: "",
    city: "",
    postcode: "",
    country: "PT",
  })

  const [sameAsBilling, setSameAsBilling] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ t: "ok" | "err"; m: string } | null>(null)

  const handleChange =
    (setFn: React.Dispatch<React.SetStateAction<Address>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setFn((prev) => ({ ...prev, [name]: value }))
    }

  const save = async () => {
    setSaving(true)
    setMsg(null)
    try {
      // aqui podes meter chamada à API
      await new Promise((resolve) => setTimeout(resolve, 800))
      setMsg({ t: "ok", m: "Moradas guardadas com sucesso ✅" })
    } catch (e: any) {
      setMsg({ t: "err", m: "Falha ao guardar moradas." })
    } finally {
      setSaving(false)
    }
  }

  const renderField = (
    obj: Address,
    setFn: React.Dispatch<React.SetStateAction<Address>>,
    field: keyof Address,
    label: string,
    type: string = "text"
  ) => (
    <div>
      <label className="text-sm font-medium mb-1 block">{label}</label>
      <input
        type={type}
        name={field}
        value={obj[field] || ""}
        onChange={handleChange(setFn)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-500"
      />
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Morada de Faturação */}
      <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-xl font-bold">Morada de Faturação</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderField(billing, setBilling, "first_name", "Primeiro Nome")}
          {renderField(billing, setBilling, "last_name", "Apelido")}
          {renderField(billing, setBilling, "address_1", "Morada")}
          {renderField(billing, setBilling, "address_2", "Complemento")}
          {renderField(billing, setBilling, "city", "Cidade")}
          {renderField(billing, setBilling, "postcode", "Código Postal")}
          {renderField(billing, setBilling, "country", "País")}
          {renderField(billing, setBilling, "phone", "Telefone")}
          {renderField(billing, setBilling, "email", "Email", "email")}
          {renderField(billing, setBilling, "nif", "NIF")}
        </div>
      </div>

      {/* Opção mesma morada */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={sameAsBilling}
          onChange={() => setSameAsBilling(!sameAsBilling)}
          id="sameAsBilling"
        />
        <label htmlFor="sameAsBilling" className="text-sm">
          Usar mesma morada para envio
        </label>
      </div>

      {/* Morada de Envio */}
      {!sameAsBilling && (
        <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-xl font-bold">Morada de Envio</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderField(shipping, setShipping, "first_name", "Primeiro Nome")}
            {renderField(shipping, setShipping, "last_name", "Apelido")}
            {renderField(shipping, setShipping, "address_1", "Morada")}
            {renderField(shipping, setShipping, "address_2", "Complemento")}
            {renderField(shipping, setShipping, "city", "Cidade")}
            {renderField(shipping, setShipping, "postcode", "Código Postal")}
            {renderField(shipping, setShipping, "country", "País")}
          </div>
        </div>
      )}

      {/* Mensagem */}
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

      {/* Botão */}
      <button
        onClick={save}
        disabled={saving}
        className="rounded-lg bg-yellow-500 px-5 py-2 font-semibold text-black hover:bg-yellow-600 disabled:opacity-60"
      >
        {saving ? "A guardar…" : "Guardar Moradas"}
      </button>
    </div>
  )
}
