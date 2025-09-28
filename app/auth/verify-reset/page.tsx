"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { KeyRound, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function VerifyResetPage() {
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const email = localStorage.getItem("reset_email") || ""

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setMessage("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/verify-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || "Erro interno")

      setMessage("Código validado! Vamos redefinir a password...")
      localStorage.setItem("reset_code", code)
      setTimeout(() => router.push("/auth/reset-password"), 1500)
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
              <KeyRound className="w-6 h-6 text-yellow-600" />
              Inserir Código de Verificação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-4">
              <Input
                type="text"
                placeholder="Código recebido por email"
                value={code}
                onChange={(e) => setCode(e.target.value)}
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
                {loading ? "A validar..." : "Validar Código"}
              </Button>
            </form>
            <Link href="/auth/request-reset" className="flex items-center gap-2 mt-4 text-sm text-gray-600 hover:text-yellow-600">
              <ArrowLeft className="w-4 h-4" /> Voltar atrás
            </Link>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
