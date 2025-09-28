"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, MapPin, User, Heart, LogOut } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function ContaDashboard() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const u = localStorage.getItem("projeto_inovador_user")
    if (!u) return router.replace("/login")
    setUser(JSON.parse(u))
  }, [router])

  const logout = () => {
    localStorage.removeItem("projeto_inovador_user")
    router.push("/")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-6 py-10 flex-1">
        <h1 className="text-2xl font-bold mb-2">A Minha Conta</h1>
        <p className="text-gray-600 mb-8">
          Olá <b>{user?.name || user?.username}</b>. No painel pode ver as encomendas,
          gerir moradas e os detalhes da sua conta.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {/* 📦 Encomendas */}
          <Link href="/conta/encomendas">
            <Card className="hover:shadow-lg transition cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" /> Encomendas
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>

          {/* 📍 Moradas */}
          <Link href="/conta/moradas">
            <Card className="hover:shadow-lg transition cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" /> Moradas
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>

          {/* 👤 Detalhes */}
          <Link href="/conta/detalhes">
            <Card className="hover:shadow-lg transition cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" /> Detalhes da Conta
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>

          {/* ❤️ Lista de desejos */}
          <Link href="/favoritos">
            <Card className="hover:shadow-lg transition cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" /> Lista de Desejos
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>

          {/* 🚪 Logout */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LogOut className="w-5 h-5" /> Sair
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" onClick={logout}>
                Terminar Sessão
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
