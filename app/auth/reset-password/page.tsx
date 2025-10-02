"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // só lê localStorage no cliente
  useEffect(() => {
    if (typeof window !== "undefined") {
      setEmail(localStorage.getItem("reset_email") || "")
      setCode(localStorage.getItem("reset_code") || "")
    }
  }, [])

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setMessage("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || "Erro interno")

      setMessage("Password alterada com sucesso! Pode iniciar sessão.")
      if (typeof window !== "undefined") {
        localStorage.removeItem("reset_email")
        localStorage.removeItem("reset_code")
      }
      setTimeout(() => router.push("/login"), 1500)
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
              <Lock className="w-6 h-6 text-yellow-600" />
              Definir Nova Palavra-passe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleReset} className="space-y-4">
              <Input
                type="password"
                placeholder="Nova password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                {loading ? "A guardar..." : "Guardar Nova Password"}
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
