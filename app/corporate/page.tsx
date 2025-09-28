"use client"

import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Footer } from "@/components/footer"
import { Chatbot } from "@/components/chatbot"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Users, TrendingUp, Settings, Headphones, Award } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export default function CorporatePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} />

        {/* Main content */}
        <main className={`flex-1 transition-all duration-300 ease-in-out ${sidebarOpen ? "ml-64" : "ml-0"}`}>
          {/* Hero Banner */}
          <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-16">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl font-bold mb-4">Assistência Informática para Empresas</h1>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Soluções tecnológicas completas para o seu negócio. Desde consultoria especializada até suporte técnico
                dedicado.
              </p>
              <Link href="/contactos">
                <Button
                  size="lg"
                  className="px-8 py-4 font-bold rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 shadow-lg text-black text-lg"
                >
                  Solicitar Orçamento
                </Button>
              </Link>
            </div>
          </section>

          {/* Services Section */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-foreground">Soluções Tecnológicas Empresariais</h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Oferecemos um serviço completo de consultoria e implementação de soluções informáticas para empresas
                    de todos os tamanhos. A nossa equipa especializada trabalha consigo para identificar as melhores
                    tecnologias para o seu negócio.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span>Auditoria e diagnóstico de sistemas</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span>Implementação de infraestruturas</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span>Migração de dados e sistemas</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-muted/30 rounded-lg p-8 text-center">
                  <Settings className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Consultoria Especializada</h3>
                  <p className="text-muted-foreground">Análise detalhada das suas necessidades tecnológicas</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                <div className="bg-muted/30 rounded-lg p-8 text-center order-2 md:order-1">
                  <TrendingUp className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Otimização de Processos</h3>
                  <p className="text-muted-foreground">Melhore a eficiência da sua empresa com as nossas soluções</p>
                </div>
                <div className="order-1 md:order-2">
                  <h2 className="text-3xl font-bold mb-6 text-foreground">Suporte Técnico Dedicado</h2>
                  <ul className="space-y-3">
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span>Suporte remoto e presencial</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span>Monitorização proativa de sistemas</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span>Backup e recuperação de dados</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Software Partners */}
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-8 text-foreground">Parceiros de Software Empresarial</h2>
              <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
                Trabalhamos com as melhores marcas de software empresarial para oferecer soluções completas e integradas.
              </p>
              <div className="flex justify-center items-center space-x-12 opacity-60">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-green-600">SAGE</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">Microsoft</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-red-600">Oracle</div>
                </div>
              </div>
            </div>
          </section>

          {/* Advantages Section */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Vantagens TorrentLite Corporate</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-3">Aconselhamento Especializado</h3>
                    <p className="text-muted-foreground">
                      Equipa técnica certificada com vasta experiência em soluções empresariais
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-3">Descontos por Quantidade</h3>
                    <p className="text-muted-foreground">
                      Preços especiais para compras em volume e contratos de longo prazo
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Settings className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-3">Soluções à Medida</h3>
                    <p className="text-muted-foreground">
                      Desenvolvemos soluções personalizadas para as necessidades específicas do seu negócio
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Headphones className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-3">Serviço Pós-Venda</h3>
                    <p className="text-muted-foreground">
                      Suporte técnico dedicado e garantia estendida em todos os nossos produtos
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Award className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-3">Certificações</h3>
                    <p className="text-muted-foreground">
                      Parceiros certificados das principais marcas tecnológicas do mercado
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-3">Garantia de Qualidade</h3>
                    <p className="text-muted-foreground">
                      Compromisso com a excelência em todos os projetos e implementações
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-4">Pronto para Transformar o Seu Negócio?</h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Entre em contacto connosco e descubra como podemos ajudar a sua empresa a crescer com as melhores soluções tecnológicas.
              </p>
              <div className="space-x-4">
                <Link href="/contactos">
                  <Button
                    size="lg"
                    className="px-8 py-4 font-bold rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 shadow-lg text-black text-lg"
                  >
                    Contactar Agora
                  </Button>
                </Link>
                <Button size="lg" variant="outline">Solicitar Demonstração</Button>
              </div>
            </div>
          </section>
        </main>
      </div>

      <Footer />
      <Chatbot />
    </div>
  )
}
