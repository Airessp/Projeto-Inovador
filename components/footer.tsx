import Link from "next/link"
import { CreditCard, Smartphone } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-12 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Projeto Inovador</h3>
            <p className="text-secondary-foreground/80 text-sm">
              A sua loja de confiança para electrónicos e reparações em Portugal.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Links Rápidos</h4>
            <nav className="space-y-2">
              <Link href="/" className="block text-sm hover:text-primary transition-colors">
                Início
              </Link>
              <Link href="/produtos" className="block text-sm hover:text-primary transition-colors">
                Produtos
              </Link>
              <Link href="/reparacoes" className="block text-sm hover:text-primary transition-colors">
                Reparações
              </Link>
               <Link href="/about" className="block text-sm hover:text-primary transition-colors">
                Sobre Nós
              </Link>
              <Link href="/contactos" className="block text-sm hover:text-primary transition-colors">
                Contactos
              </Link>
            </nav>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Categorias</h4>
            <nav className="space-y-2">
              <Link
                href="/produtos?categoria=smartphones"
                className="block text-sm hover:text-primary transition-colors"
              >
                Smartphones
              </Link>
              <Link
                href="/produtos?categoria=computadores"
                className="block text-sm hover:text-primary transition-colors"
              >
                Computadores
              </Link>
              <Link href="/produtos?categoria=gaming" className="block text-sm hover:text-primary transition-colors">
                Gaming
              </Link>
              <Link
                href="/produtos?categoria=acessorios"
                className="block text-sm hover:text-primary transition-colors"
              >
                Acessórios
              </Link>
            </nav>
          </div>

          {/* Payment Methods */}
          <div>
            <h4 className="font-semibold mb-4">Métodos de Pagamento</h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white rounded p-2 flex items-center justify-center">
                <Smartphone className="w-4 h-4 text-green-600" />
                <span className="text-xs text-gray-800 ml-1">MB Way</span>
              </div>
              <div className="bg-white rounded p-2 flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-gray-800 ml-1">MB</span>
              </div>
              <div className="bg-white rounded p-2 flex items-center justify-center">
                <span className="text-xs text-blue-600 font-bold">PayPal</span>
              </div>
              <div className="bg-white rounded p-2 flex items-center justify-center">
                <span className="text-xs text-blue-800 font-bold">VISA</span>
              </div>
              <div className="bg-white rounded p-2 flex items-center justify-center">
                <span className="text-xs text-red-600 font-bold">MC</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/20 pt-6 text-center">
          <p className="text-sm text-secondary-foreground/80">© 2025 Projeto Inovador. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
