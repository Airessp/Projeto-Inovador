"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function RequestResetPage() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setMessage("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/request-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || "Erro interno")

      setMessage(data.message || "Verifique o seu email.")
      // guardar email temporário no localStorage para os próximos passos
      localStorage.setItem("reset_email", email)
      setTimeout(() => router.push("/auth/verify-reset"), 1500)
    } catch (err: any) {
      setError(err.message || "Erro interno")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <Mail className="w-6 h-6 text-yellow-600" />
              Recuperar Palavra-passe
            </CardTitle>
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

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-600">{error}</AlertDescription>
                </Alert>
              )}
              {message && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-600">{message}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                {loading ? "A enviar..." : "Enviar Link de Recuperação"}
              </Button>
            </form>
            <Link href="/login" className="flex items-center gap-2 mt-4 text-sm text-gray-600 hover:text-yellow-600">
              <ArrowLeft className="w-4 h-4" /> Voltar ao Login
            </Link>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
