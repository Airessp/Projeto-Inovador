"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Lock, User, ArrowLeft } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

// Funções de carrinho
const saveCartForUser = (username: string, cartItems: any[]) => {
  localStorage.setItem(`cart_${username}`, JSON.stringify(cartItems))
}

const loadCartForUser = (username: string) => {
  return JSON.parse(localStorage.getItem(`cart_${username}`) || "[]")
}

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // 🔹 Primeiro tentamos autenticar com os utilizadores guardados localmente
      const users = JSON.parse(localStorage.getItem("projeto_inovador_users") || "[]")
      let foundUser = users.find(
        (u: any) =>
          (u.username === username || u.email === username) &&
          u.password === password
      )

      // 🔹 Se encontrou no localStorage → login offline/local
      if (foundUser) {
        const userData = {
          id: foundUser.id,
          username: foundUser.username,
          name: foundUser.name || foundUser.username, // 🔹 garantir que existe sempre name
          email: foundUser.email,
          loginTime: new Date().toISOString(),
        }
        localStorage.setItem("projeto_inovador_user", JSON.stringify(userData))

        // sincronizar carrinho
        const currentCart = JSON.parse(localStorage.getItem("projeto-inovador-cart") || "[]")
        const userCart = loadCartForUser(foundUser.username)
        const mergedCart = [...userCart, ...currentCart]
        saveCartForUser(foundUser.username, mergedCart)
        localStorage.setItem("projeto-inovador-cart", JSON.stringify(mergedCart))
        window.dispatchEvent(new Event("cartUpdated"))

        router.push("/")
        return
      }

      // 🔹 Se não encontrou local → tenta autenticação no servidor WordPress via JWT
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        if (res.status === 401) {
          setError(data?.message || "Credenciais inválidas")
        } else {
          setError(data?.message || "Erro no servidor. Tente novamente.")
        }
        setLoading(false)
        return
      }

      // Guardar sessão vinda do WordPress
      const token = data?.token || data?.jwt || null
      const user = {
        id: data?.user_id || data?.id || null,
        username: data?.user_nicename || username,
        name: data?.user_display_name || data?.user_nicename || username, // 🔹 garantir que existe sempre name
        email: data?.user_email || username,
        token,
        loginTime: new Date().toISOString(),
      }
      localStorage.setItem("projeto_inovador_user", JSON.stringify(user))

      // sincronizar carrinho
      const currentCart = JSON.parse(localStorage.getItem("projeto-inovador-cart") || "[]")
      const userCart = loadCartForUser(user.username)
      const mergedCart = [...userCart, ...currentCart]
      saveCartForUser(user.username, mergedCart)
      localStorage.setItem("projeto-inovador-cart", JSON.stringify(mergedCart))
      window.dispatchEvent(new Event("cartUpdated"))

      router.push("/")
    } catch (err: any) {
      console.error("Erro ao autenticar:", err)
      setError("Erro inesperado ao autenticar. Tente novamente.")
    } finally {
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
                <Lock className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-black text-gray-900 mb-2">
                Iniciar Sessão
              </CardTitle>
              <p className="text-gray-600">Aceda à sua conta Projeto Inovador</p>
            </CardHeader>

            <CardContent className="p-8">
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Username */}
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-semibold text-gray-700">
                    Nome de Utilizador ou Email
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Introduza o seu utilizador ou email"
                      className="pl-12 h-12 border-gray-200 focus:border-yellow-500 focus:ring-yellow-500 rounded-xl"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                    Palavra-passe
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Introduza a sua palavra-passe"
                      className="pl-12 pr-12 h-12 border-gray-200 focus:border-yellow-500 focus:ring-yellow-500 rounded-xl"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Erros */}
                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-700 font-medium">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Botão */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {loading ? "A iniciar sessão..." : "Iniciar Sessão"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Não tem conta?{" "}
                  <Link href="/registo" className="text-yellow-600 hover:text-orange-600 font-semibold">
                    Criar conta
                  </Link>
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  <Link href="/auth/request-reset" className="text-yellow-600 hover:text-orange-600 font-semibold">
                    Esqueci-me da palavra-passe
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
