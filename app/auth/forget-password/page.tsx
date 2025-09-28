"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [msg, setMsg] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg("")
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/request-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Erro")
      setMsg(data.message)
    } catch (err: any) {
      setError(err.message || "Erro")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-10">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Recuperar Palavra-passe</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="O seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button disabled={loading} type="submit" className="w-full">
                {loading ? "A enviar..." : "Enviar código"}
              </Button>
            </form>
            {msg && (
              <Alert className="mt-4 border-green-200 bg-green-50">
                <AlertDescription>{msg}</AlertDescription>
              </Alert>
            )}
            {error && (
              <Alert className="mt-4 border-red-200 bg-red-50">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
