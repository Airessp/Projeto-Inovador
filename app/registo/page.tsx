"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UserPlus, Eye, EyeOff, ArrowLeft } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function RegisterPage() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const res = await fetch("/api/customers/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || "Erro ao criar conta")

      // 🔹 Criar novo utilizador local
      const users = JSON.parse(localStorage.getItem("projeto_inovador_users") || "[]")
      const newUser = {
        id: data.id,
        username,
        name: username,
        email,
        password,
        createdAt: new Date().toISOString(),
        billing: data.billing || null,
        shipping: data.shipping || null,
      }

      users.push(newUser)
      localStorage.setItem("projeto_inovador_users", JSON.stringify(users))
      localStorage.setItem("projeto_inovador_user", JSON.stringify(newUser))
      window.dispatchEvent(new Event("userUpdated"))

      setSuccess("Conta criada com sucesso! Vai ser redirecionado...")
      setLoading(false)

      setTimeout(() => router.push("/"), 2000)
    } catch (err: any) {
      console.error("Erro WooCommerce:", err)
      setError(err.message || "Erro ao criar a conta no servidor.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-100">
      <Header />

      <div className="flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-yellow-600 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Início
          </Link>

          <Card className="border-0 shadow-2xl rounded-3xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-2">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <UserPlus className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-black text-gray-900 mb-2">
                Criar Conta
              </CardTitle>
              <p className="text-gray-600">Registe-se no Projeto Inovador</p>
            </CardHeader>

            <CardContent className="p-8">
              <form onSubmit={handleRegister} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username">Nome de Utilizador</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Escolha um nome de utilizador"
                    className="h-12 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="O seu email"
                    className="h-12 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Palavra-passe</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Crie uma palavra-passe"
                      className="h-12 rounded-xl pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-700 font-medium">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-green-200 bg-green-50">
                    <AlertDescription className="text-green-700 font-medium">
                      {success}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {loading ? "A criar conta..." : "Registar Nova Conta"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Já tem conta?{" "}
                  <Link
                    href="/login"
                    className="text-yellow-600 hover:text-orange-600 font-semibold"
                  >
                    Iniciar Sessão
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
