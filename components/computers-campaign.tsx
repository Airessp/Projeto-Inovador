"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Zap, Award, Truck } from "lucide-react"
import Link from "next/link"

const campaignComputers = [
  {
    id: 15,
    name: "Dell XPS 13 Plus",
    brand: "Dell",
    price: 899,
    originalPrice: 1199,
    discount: 25,
    image: "/dell-xps-13-plus.jpg",
    specs: ["Intel i7-1360P", "16GB RAM", "512GB SSD", '13.4" 4K'],
    features: ["Ultrabook", "Touchscreen", "Thunderbolt 4"],
  },
  {
    id: 17,
    name: "ASUS ROG Strix G15",
    brand: "ASUS",
    price: 1299,
    originalPrice: 1599,
    discount: 19,
    image: "/asus-rog-strix-g15.jpg",
    specs: ["AMD Ryzen 7", "16GB RAM", "1TB SSD", "RTX 4060"],
    features: ["Gaming", "RGB Keyboard", "144Hz Display"],
  },
  {
    id: 12,
    name: "MacBook Air M3",
    brand: "Apple",
    price: 1199,
    originalPrice: 1399,
    discount: 14,
    image: "/macbook-air-m3-13.jpg",
    specs: ["Apple M3", "8GB RAM", "256GB SSD", '13.6" Retina'],
    features: ["Chip M3", "Bateria 18h", "MagSafe"],
  },
]

export function ComputersCampaign() {
  return (
    <section className="container mx-auto px-6">
      <div className="text-center mb-12">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4"
          style={{ backgroundColor: "#f59e0b", color: "#000000" }}
        >
          <Zap className="w-4 h-4" />
          CAMPANHA ESPECIAL
        </div>
        <h2 className="text-4xl font-black mb-4 bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
          Computadores em Campanha
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Descontos incríveis nos melhores computadores. Ofertas limitadas com
          entrega gratuita e garantia estendida.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {campaignComputers.map((computer) => (
          <Card
            key={computer.id}
            className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden"
          >
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={computer.image || "/placeholder.svg"}
                  alt={computer.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <Badge
                className="absolute top-4 left-4 border-0 font-bold"
                style={{ backgroundColor: "#dc2626", color: "#ffffff" }}
              >
                -{computer.discount}%
              </Badge>
            </div>

            <CardContent className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">{computer.brand}</p>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{computer.name}</h3>

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-black text-yellow-600">
                    €{computer.price}
                  </span>
                  <span className="text-lg text-gray-400 line-through">
                    €{computer.originalPrice}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Especificações:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {computer.specs.map((spec, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Características:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {computer.features.map((feature, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs bg-yellow-100 text-yellow-700"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Link href={`/produto/${computer.id}`}>
                <Button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black border-0 group">
                  Ver Detalhes
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl p-8 text-black text-center">
        <h3 className="text-2xl font-bold mb-4">Vantagens Exclusivas da Campanha</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center">
            <Truck className="w-8 h-8 mb-2" />
            <h4 className="font-semibold mb-1">Entrega Gratuita</h4>
            <p className="text-sm opacity-90">Em todas as compras da campanha</p>
          </div>
          <div className="flex flex-col items-center">
            <Award className="w-8 h-8 mb-2" />
            <h4 className="font-semibold mb-1">Garantia Estendida</h4>
            <p className="text-sm opacity-90">3 anos de garantia incluída</p>
          </div>
          <div className="flex flex-col items-center">
            <Zap className="w-8 h-8 mb-2" />
            <h4 className="font-semibold mb-1">Setup Gratuito</h4>
            <p className="text-sm opacity-90">Configuração e instalação incluída</p>
          </div>
        </div>
      </div>
    </section>
  )
}
