"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Footer } from "@/components/footer"
import { Chatbot } from "@/components/chatbot"
import { Building2, MapPin, Wrench, Globe } from "lucide-react"

export default function AboutPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabeçalho */}
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Conteúdo principal */}
        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? "ml-64" : "ml-0"
          }`}
        >
          <div className="container mx-auto px-6 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Sobre Nós
            </h1>

            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-lg font-semibold">
                <span className="text-orange-500">Projeto Inovador</span>, Centro de
                Assistência Autorizado Apple
              </p>
              <p className="text-xl font-bold">30 Anos de Experiência</p>

              <p>
                Fundada em 1993, na cidade de Coimbra, a{" "}
                <strong>
                  Projeto Inovador, Lda (NIF 123456789)
                </strong>{" "}
                é uma empresa de prestação de serviços na área das Tecnologias
                de Informação e Comunicação que se apresenta como um{" "}
                <strong>Centro de Assistência Técnico de excelência</strong>.
              </p>

              <p>
                Com 30 anos acumulados de saber e experiência, pode confiar em
                nós para resolver todos os problemas do seu equipamento.
              </p>

              <p>
                Os nossos serviços de assistência e reparação abrangem todos os
                equipamentos de informática, tanto na nossa loja em Coimbra
                (aberta ao público) como diretamente nas instalações dos nossos
                clientes.
              </p>

              <p>
                Estamos aptos a servir tanto particulares como empresas de
                pequena, média ou grande dimensão, com atuação a nível nacional
                e internacional.
              </p>

              <p>
                O nosso leque de serviços inclui: instalação, reparação e
                manutenção de equipamentos, projetos e gestão de redes e web
                design. Todas as reparações são{" "}
                <strong>certificadas pelo fabricante</strong>.
              </p>

              <p>
                Para maior comodidade, podemos recolher os equipamentos no
                domicílio através de transportadora, respeitando todos os
                procedimentos adequados. Também efetuamos a entrega direta nas
                instalações do cliente.
              </p>
            </div>

            {/* Secção com ícones/valores */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
              <div className="p-6 bg-white shadow rounded-xl flex items-start space-x-4">
                <Building2 className="w-8 h-8 text-orange-500" />
                <div>
                  <h3 className="text-lg font-semibold">Fundada em 1993</h3>
                  <p className="text-sm text-gray-600">
                    30 anos de experiência e inovação em tecnologias de
                    informação.
                  </p>
                </div>
              </div>

              <div className="p-6 bg-white shadow rounded-xl flex items-start space-x-4">
                <MapPin className="w-8 h-8 text-orange-500" />
                <div>
                  <h3 className="text-lg font-semibold">Localização</h3>
                  <p className="text-sm text-gray-600">
                    Loja aberta ao público em Coimbra, com reparações rápidas e
                    assistência personalizada.
                  </p>
                </div>
              </div>

              <div className="p-6 bg-white shadow rounded-xl flex items-start space-x-4">
                <Wrench className="w-8 h-8 text-orange-500" />
                <div>
                  <h3 className="text-lg font-semibold">Assistência Certificada</h3>
                  <p className="text-sm text-gray-600">
                    Reparações garantidas pelo fabricante e recolha/entrega ao
                    domicílio.
                  </p>
                </div>
              </div>

              <div className="p-6 bg-white shadow rounded-xl flex items-start space-x-4">
                <Globe className="w-8 h-8 text-orange-500" />
                <div>
                  <h3 className="text-lg font-semibold">Atuação Global</h3>
                  <p className="text-sm text-gray-600">
                    Serviços prestados a clientes nacionais e internacionais.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Rodapé */}
      <Footer />
      <Chatbot />
    </div>
  )
}
