"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Search,
  ShoppingCart,
  User,
  LogOut,
  Menu,
  UserPlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sidebar } from "@/components/sidebar"
import { CartSidebar } from "@/components/cart-sidebar"

interface UserInterface {
  username?: string
  name?: string
  email?: string
  loginTime?: string
}

interface HeaderProps {
  sidebarOpen?: boolean
  setSidebarOpen?: (open: boolean) => void
}

export function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  const [user, setUser] = useState<UserInterface | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItemCount, setCartItemCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  // 🔹 Carregar sessão
  useEffect(() => {
    const loadUser = () => {
      const userData = localStorage.getItem("projeto_inovador_user")
      setUser(userData ? JSON.parse(userData) : null)
    }

    loadUser()
    window.addEventListener("storage", loadUser)
    window.addEventListener("userUpdated", loadUser)

    return () => {
      window.removeEventListener("storage", loadUser)
      window.removeEventListener("userUpdated", loadUser)
    }
  }, [])

  // 🔹 Carrinho
  useEffect(() => {
    const updateCartCount = () => {
      const savedCart = localStorage.getItem("projeto-inovador-cart")
      const cartItems = savedCart ? JSON.parse(savedCart) : []
      const totalItems = cartItems.reduce(
        (sum: number, item: any) => sum + (item.quantity || 1),
        0
      )
      setCartItemCount(totalItems)
    }

    updateCartCount()
    window.addEventListener("cartUpdated", updateCartCount)
    window.addEventListener("storage", updateCartCount)

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount)
      window.removeEventListener("storage", updateCartCount)
    }
  }, [])

  // 🔹 Logout
  const handleLogout = () => {
    localStorage.removeItem("projeto_inovador_user")
    setUser(null)
    window.dispatchEvent(new Event("userUpdated"))
    router.push("/")
  }

  const handleSidebarToggle = () => {
    if (setSidebarOpen) setSidebarOpen(!sidebarOpen)
  }

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      router.push(`/produtos?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch()
  }

  // 🔹 fallback seguro para avatar
  const getUserInitial = () => {
    if (user?.name && user.name.length > 0) return user.name.charAt(0).toUpperCase()
    if (user?.username && user.username.length > 0)
      return user.username.charAt(0).toUpperCase()
    if (user?.email && user.email.length > 0) return user.email.charAt(0).toUpperCase()
    return "U"
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            {/* Left - Logo + Menu */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="hidden lg:flex rounded-xl text-gray-700 hover:bg-gray-100"
                onClick={handleSidebarToggle}
              >
                <Menu className="w-5 h-5 text-gray-700" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden rounded-xl text-gray-700 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="w-5 h-5 text-gray-700" />
              </Button>

              <Link href="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-black text-lg">P</span>
                </div>
                <span className="text-2xl font-black text-yellow-600 hidden sm:block">
                  Projeto Inovador
                </span>
              </Link>
            </div>

            {/* Middle - Search */}
            <div className="flex-1 max-w-md mx-4 sm:mx-8 hidden sm:block">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 cursor-pointer"
                  onClick={handleSearch}
                />
                <Input
                  placeholder="Pesquisar produtos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-10 pr-4 border-gray-200 focus:border-yellow-500 focus:ring-yellow-500 rounded-xl bg-gray-50 text-gray-900"
                />
              </div>
            </div>

            {/* Right - Nav + User + Cart */}
            <nav className="hidden xl:flex items-center space-x-6">
              <Link href="/" className="text-gray-700 hover:text-yellow-600 font-semibold">Início</Link>
              <Link href="/produtos" className="text-gray-700 hover:text-yellow-600 font-semibold">Produtos</Link>
              <Link href="/reparacoes" className="text-gray-700 hover:text-yellow-600 font-semibold">Reparações</Link>
              <Link href="/corporate" className="text-gray-700 hover:text-yellow-600 font-semibold">Corporate</Link>
              <Link href="/favoritos" className="text-gray-700 hover:text-yellow-600 font-semibold">Favoritos</Link>
              <Link href="/about" className="text-gray-700 hover:text-yellow-600 font-semibold">Sobre Nós</Link>
              <Link href="/contactos" className="text-gray-700 hover:text-yellow-600 font-semibold">Contactos</Link>
            </nav>

            <div className="flex items-center gap-3">
              {/* Carrinho */}
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100 rounded-xl text-gray-700 relative"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingCart className="w-5 h-5 text-gray-700" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </span>
                )}
              </Button>

              {/* User */}
              {user ? (
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-yellow-500 text-white font-bold text-sm">
                      {getUserInitial()}
                    </AvatarFallback>
                  </Avatar>
                  <Link 
                    href="/conta" 
                    className="font-semibold text-gray-700 hidden sm:block hover:text-yellow-600">
                    {user.name || user.username || "Utilizador"}
                  </Link>

                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="rounded-xl text-red-600 hover:bg-red-100"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Terminar Sessão
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button className="rounded-xl bg-yellow-500 text-black hover:shadow-lg transition-all">
                      <User className="w-4 h-4 mr-2" />
                      Entrar
                    </Button>
                  </Link>
                  <Link href="/registo">
                    <Button variant="outline" className="rounded-xl hover:bg-yellow-50 transition-all">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Criar Conta
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <Sidebar isMobile={true} onClose={() => setMobileMenuOpen(false)} />

          {/* 🔹 User Actions no Mobile */}
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 lg:hidden">
            {user ? (
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-yellow-500 text-white font-bold text-sm">
                      {getUserInitial()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-semibold">
                    {user.name || user.username || "Utilizador"}
                  </span>
                </div>
                <Button
                  variant="outline"
                  className="justify-start text-red-600 hover:bg-red-100"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Terminar Sessão
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link href="/login" className="flex-1">
                  <Button className="w-full bg-yellow-500 text-black">
                    <User className="w-4 h-4 mr-2" />
                    Entrar
                  </Button>
                </Link>
                <Link href="/registo" className="flex-1">
                  <Button variant="outline" className="w-full">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Criar Conta
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </>
      )}

      {/* Carrinho Sidebar */}
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
