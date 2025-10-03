import Link from "next/link"
import Image from "next/image"

const featuredCategories = [
  {
    name: "Apple",
    image: "/Apple-Logosu.png",
    href: "/produtos?brand=Apple", // 🔹 Apple é filtrado por brand
  },
  {
    name: "Smartphones",
    image: "/Smartphones.jpeg",
    href: "/produtos?categoria=Smartphones",
  },
  {
    name: "Componentes",
    image: "/computer-components-motherboard-cpu.jpg",
    href: "/produtos?categoria=Componentes",
  },
  {
    name: "Desktops",
    image: "/desktop-computer-tower-gaming-pc.jpg",
    href: "/produtos?categoria=Computadores", // 🔹 no JSON a categoria é "Computadores"
  },
  {
    name: "Impressoras",
    image: "/modern-printer-office-equipment.jpg",
    href: "/produtos?categoria=Impressoras", // 🔹 só funciona se adicionares esta categoria no JSON
  },
  {
    name: "Portáteis",
    image: "/laptop-notebook-computer-portable.jpg",
    href: "/produtos?categoria=Computadores", // 🔹 no JSON laptops também estão em "Computadores"
  },
  {
    name: "Armazenamento",
    image: "/armazenamento.webp",
    href: "/produtos?categoria=Armazenamento",
  },
  {
    name: "Software",
    image: "/software.jpg",
    href: "/produtos?categoria=Software",
  },
  {
    name: "Recondicionados",
    image: "/refurbished-electronics-recycled-technology.jpg",
    href: "/produtos?categoria=Recondicionados",
  },
]

export function FeaturedCategories() {
  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8 text-foreground">
          Categorias em Destaque
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-6">
          {featuredCategories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="flex flex-col items-center group"
            >
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-3 group-hover:shadow-lg transition-all duration-300 shadow-md border border-gray-100 overflow-hidden">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  width={60}
                  height={60}
                  className="object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span className="text-sm font-medium text-center text-foreground group-hover:text-primary transition-colors">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
