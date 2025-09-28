"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { HeroBanner } from "@/components/hero-banner"
import { FeaturedCategories } from "@/components/featured-categories"
import { FeaturedProducts } from "@/components/featured-products"
import { PromotionalGrid } from "@/components/promotional-grid"
import { ComputersCampaign } from "@/components/computers-campaign"
import { Footer } from "@/components/footer"
import { Chatbot } from "@/components/chatbot"

// 🔹 Carrossel de banners principais
const banners = [
  { img: "/asus.webp", alt: "Asus Back to School", link: "/produtos?categoria=computadores" },
  { img: "/bannerasus.webp", alt: "Banner Asus", link: "/produtos?categoria=apple" },
]

// 🔹 Anúncio lateral único (a mesma imagem em ambos os lados)
const ad = {
  img: "/gaming-promo.png",
  alt: "Promo Gaming",
  link: "/produtos?categoria=computadores",
}

// Carrossel
export function BannerCarousel() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const prev = () => setActive((active - 1 + banners.length) % banners.length)
  const next = () => setActive((active + 1) % banners.length)

  return (
    <div className="relative w-full overflow-hidden rounded-xl shadow-lg">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${active * 100}%)` }}
      >
        {banners.map((b, i) => (
          <Link
            key={i}
            href={b.link}
            className="min-w-full flex justify-center items-center bg-white"
          >
            <Image
              src={b.img}
              alt={b.alt}
              width={1400}
              height={450}
              className="object-contain max-h-[450px] w-auto"
              priority={i === active}
            />
          </Link>
        ))}
      </div>

      {/* Botões esquerda/direita */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`w-3 h-3 rounded-full transition-all ${
              i === active ? "bg-yellow-500 scale-110" : "bg-white/70 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

// 🔹 Side Ads com deslocamento ao abrir sidebar
export function SideAds({ sidebarOpen }: { sidebarOpen: boolean }) {
  return (
    <>
      {/* Lado esquerdo */}
      <div
        className={`hidden lg:block fixed left-2 top-1/3 z-40 transition-transform duration-500 ${
          sidebarOpen ? "-translate-x-full opacity-0" : "translate-x-0 opacity-100"
        }`}
      >
        <Link href={ad.link}>
          <div className="relative w-[220px] h-[650px]">
            <Image
              src={ad.img}
              alt={ad.alt}
              fill
              className="rounded-xl shadow-lg object-contain"
            />
          </div>
        </Link>
      </div>

      {/* Lado direito */}
      <div
        className={`hidden lg:block fixed right-2 top-1/3 z-40 transition-transform duration-500 ${
          sidebarOpen ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
        }`}
      >
        <Link href={ad.link}>
          <div className="relative w-[220px] h-[650px]">
            <Image
              src={ad.img}
              alt={ad.alt}
              fill
              className="rounded-xl shadow-lg object-contain"
            />
          </div>
        </Link>
      </div>
    </>
  )
}

// 🔹 Página principal
export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? "ml-64" : "ml-0"
          }`}
        >
          {/* Banner principal */}
          <BannerCarousel />

          {/* Back to School */}
          <HeroBanner />

          {/* 🔹 Side Ads (deslocam quando sidebar abre) */}
          <SideAds sidebarOpen={sidebarOpen} />

          {/* Restante conteúdo */}
          <div className="space-y-16 pb-16">
            <FeaturedCategories />
            <FeaturedProducts />
            <ComputersCampaign />
            <PromotionalGrid />
          </div>
        </main>
      </div>
      <Footer />
      <Chatbot />
    </div>
  )
}
