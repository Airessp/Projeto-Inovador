"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function DetalhesContaPage() {
  const [customerId, setCustomerId] = useState<number | null>(null)
  const [first_name, setFirst] = useState("")
  const [last_name, setLast] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPass] = useState("")
  const [ok, setOk] = useState("")
  const [err, setErr] = useState("")

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("projeto_inovador_user") || "null")
    if (!u?.email) return setErr("Sessão inválida. Faça login.")
    ;(async () => {
      try {
        const res = await fetch("/api/customers/lookup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: u.email }),
        })
        if (!res.ok) throw new Error("Cliente não encontrado")
        const c = await res.json()
        setCustomerId(c.id)
        setFirst(c.first_name || "")
        setLast(c.last_name || "")
        setEmail(c.email || "")
      } catch (e: any) {
        setErr(e?.message || "Erro a carregar dados")
      }
    })()
  }, [])

  async function save() {
    try {
      setErr(""); setOk("")
      if (!customerId) throw new Error("Cliente inválido")
      const payload: any = { first_name, last_name, email }
      if (password) payload.password = password
      const res = await fetch(`/api/customers/${customerId}/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error((await res.json())?.message || "Falha ao guardar")
      setOk("Dados atualizados.")
      // atualizar sessão local
      const sess = JSON.parse(localStorage.getItem("projeto_inovador_user") || "{}")
      localStorage.setItem("projeto_inovador_user", JSON.stringify({ ...sess, name: `${first_name} ${last_name}`.trim(), email }))
    } catch (e: any) {
      setErr(e?.message || "Erro ao guardar")
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-6 py-10 flex-1">
        <h1 className="text-2xl font-bold mb-6">Detalhes da Conta</h1>

        {err && <Alert className="mb-6 border-red-200 bg-red-50"><AlertDescription className="text-red-700">{err}</AlertDescription></Alert>}
        {ok &&  <Alert className="mb-6 border-green-200 bg-green-50"><AlertDescription className="text-green-700">{ok}</AlertDescription></Alert>}

        <Card className="max-w-xl">
          <CardHeader><CardTitle>Dados</CardTitle></CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-sm mb-1 block">Nome</label><Input value={first_name} onChange={(e)=>setFirst(e.target.value)} /></div>
              <div><label className="text-sm mb-1 block">Apelido</label><Input value={last_name} onChange={(e)=>setLast(e.target.value)} /></div>
            </div>
            <div><label className="text-sm mb-1 block">Email</label><Input value={email} onChange={(e)=>setEmail(e.target.value)} /></div>
            <div><label className="text-sm mb-1 block">Nova palavra-passe (opcional)</label><Input type="password" value={password} onChange={(e)=>setPass(e.target.value)} /></div>
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black" onClick={save}>Guardar Alterações</Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
