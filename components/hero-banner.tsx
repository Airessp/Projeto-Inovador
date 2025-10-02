"use client"

import { Button } from "@/components/ui/button"
import { GraduationCap } from "lucide-react"
import Link from "next/link"

export function HeroBanner() {
  return (
    <section className="bg-orange-500 text-white py-12 px-6">
      <div className="container mx-auto text-center">
        <div className="flex items-center justify-center mb-4">
          <GraduationCap className="w-8 h-8 mr-3 text-white" />
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Back to School
          </h1>
        </div>
        <p className="text-lg mb-6 opacity-90 text-white">
          Prepara-te para o novo ano letivo com os melhores preços em tecnologia
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/produtos?promo=true">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
              Ver Ofertas Especiais
            </Button>
          </Link>
          <Link href="/produtos?categoria=Computadores">
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black bg-transparent"
            >
              Computadores Portáteis
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
