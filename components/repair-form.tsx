"use client"

import { useState } from "react"

interface RepairFormProps {
  device?: string
  repair?: string
}

export function RepairForm({ device, repair }: RepairFormProps) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    // Aqui ligas EmailJS ou API da tua loja
    setTimeout(() => {
      alert("Formulário enviado com sucesso! A loja vai entrar em contacto.")
      setLoading(false)
    }, 1500)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg space-y-6"
    >
      <h2 className="text-2xl font-bold text-center mb-4">Agendar Reparação</h2>

      {/* Se já vierem props, mostra resumo fixo */}
      {(device || repair) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-2">
          {device && (
            <p>
              <span className="font-semibold">Dispositivo:</span> {device}
            </p>
          )}
          {repair && (
            <p>
              <span className="font-semibold">Reparação:</span> {repair}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Primeiro Nome *</label>
          <input
            type="text"
            name="firstName"
            required
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Último Nome *</label>
          <input
            type="text"
            name="lastName"
            required
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email *</label>
        <input
          type="email"
          name="email"
          required
          className="w-full border rounded-md px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Telefone/Telemóvel *</label>
        <input
          type="tel"
          name="phone"
          required
          className="w-full border rounded-md px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Nr. Série / IMEI *</label>
        <input
          type="text"
          name="imei"
          required
          className="w-full border rounded-md px-3 py-2"
        />
        <p className="text-xs text-gray-500 mt-1">
          Tem de preencher este campo antes de selecionar uma loja.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Loja *</label>
        <select
          name="store"
          required
          className="w-full border rounded-md px-3 py-2"
        >
          <option value="">Selecione uma loja</option>
          <option value="coimbra">Coimbra</option>
          <option value="lisboa">Lisboa</option>
          <option value="porto">Porto</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Reparações / Upgrades / Avarias *
        </label>
        <select
          name="service"
          required
          className="w-full border rounded-md px-3 py-2"
          defaultValue={repair ? repair.toLowerCase() : ""}
          disabled={!!repair} // 🔹 bloqueia se já vier definido
        >
          <option value="">Selecione uma opção</option>
          <option value="ecra">Substituição de Ecrã</option>
          <option value="bateria">Troca de Bateria</option>
          <option value="software">Problema de Software</option>
          <option value="upgrade">Upgrade</option>
          <option value="outro">Outro</option>
        </select>
        {repair && (
          <p className="text-xs text-gray-500 mt-1">
            Este campo foi preenchido automaticamente.
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Descrição da Reparação / Upgrade / Avaria
        </label>
        <textarea
          name="description"
          rows={4}
          className="w-full border rounded-md px-3 py-2"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-md transition"
      >
        {loading ? "A enviar..." : "Enviar Pedido"}
      </button>
    </form>
  )
}
