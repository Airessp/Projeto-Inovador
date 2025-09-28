"use client"

import Link from "next/link"
import Image from "next/image"

// 🔹 Apenas uma imagem fixa de cada lado
const ad = {
  img: "/gaming-promo.png",
  alt: "Promo Gaming",
  link: "/produtos?categoria=computadores",
}

export function SideAds() {
  return (
    <div className="relative w-full">
      {/* Esquerda */}
      <div className="absolute -left-48 top-20 hidden xl:block">
        <Link href={ad.link}>
          <Image
            src={ad.img}
            alt={ad.alt}
            width={160}
            height={500}
            className="rounded-xl shadow-lg object-cover"
          />
        </Link>
      </div>

      {/* Direita */}
      <div className="absolute -right-48 top-20 hidden xl:block">
        <Link href={ad.link}>
          <Image
            src={ad.img}
            alt={ad.alt}
            width={160}
            height={500}
            className="rounded-xl shadow-lg object-cover"
          />
        </Link>
      </div>
    </div>
  )
}
