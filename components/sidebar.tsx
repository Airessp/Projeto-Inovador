"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Monitor,
  Smartphone,
  Laptop,
  Printer,
  Gamepad2,
  Headphones,
  Tablet,
  HardDrive,
  Home,
  Briefcase,
  Network,
  Cpu,
  FileText,
  RotateCcw,
  Package,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarProps {
  onCategoryChange?: (category: string, brand?: string) => void
  onPriceChange?: (min: number, max: number) => void
  isMobile?: boolean
  onClose?: () => void
  isOpen?: boolean
  minPrice?: number
  maxPrice?: number
  step?: number
}

const categories = [
  { name: "Todos os Produtos", key: "all", icon: Package },

  {
    name: "Smartphones",
    key: "Smartphones",
    icon: Smartphone,
    children: [
      { name: "Apple", key: "Apple" },
      { name: "Samsung", key: "Samsung" },
      { name: "Xiaomi", key: "Xiaomi" },
      { name: "Google", key: "Google" },
      { name: "OnePlus", key: "OnePlus" },
      { name: "Outros", key: "Outros" },
    ],
  },

  {
    name: "Computadores",
    key: "Computadores",
    icon: Laptop,
    children: [
      { name: "Apple", key: "Apple" },
      { name: "Asus", key: "Asus" },
      { name: "Dell", key: "Dell" },
      { name: "HP", key: "HP" },
      { name: "Outros", key: "Outros" },
    ],
  },

  {
    name: "Tablets",
    key: "Tablets",
    icon: Tablet,
    children: [
      { name: "Apple iPad", key: "Apple iPad" },
      { name: "Samsung", key: "Samsung" },
      { name: "Xiaomi", key: "Xiaomi" },
      { name: "Outros", key: "Outros" },
    ],
  },

  {
    name: "Gaming",
    key: "Gaming",
    icon: Gamepad2,
    children: [
      { name: "Sony", key: "Sony" },
      { name: "Microsoft", key: "Microsoft" },
      { name: "Razer", key: "Razer" },
      { name: "Outros", key: "Outros" },
    ],
  },

  {
    name: "Áudio",
    key: "Áudio",
    icon: Headphones,
    children: [
      { name: "Apple", key: "Apple" },
      { name: "Sony", key: "Sony" },
      { name: "Outros", key: "Outros" },
    ],
  },

  { name: "Impressoras", key: "Impressoras", icon: Printer },
  { name: "Monitores", key: "Monitores", icon: Monitor },

  {
    name: "Componentes",
    key: "Componentes",
    icon: Cpu,
    children: [
      { name: "AMD", key: "AMD" },
      { name: "Intel", key: "Intel" },
      { name: "NVIDIA", key: "NVIDIA" },
      { name: "Corsair", key: "Corsair" },
    ],
  },

  {
    name: "Armazenamento",
    key: "Armazenamento",
    icon: HardDrive,
    children: [
      { name: "Samsung", key: "Samsung" },
      { name: "Seagate", key: "Seagate" },
      { name: "Western Digital", key: "Western Digital" },
    ],
  },

  { name: "Casa", key: "Casa", icon: Home },
  { name: "Escritório", key: "Escritório", icon: Briefcase },
  { name: "Rede", key: "Rede", icon: Network },
  { name: "Software", key: "Software", icon: FileText },
  { name: "Recondicionados", key: "Recondicionados", icon: RotateCcw },
]

export function Sidebar({
  onCategoryChange,
  onPriceChange,
  isMobile = false,
  onClose,
  isOpen = true,
  minPrice = 0,
  maxPrice = 2000,
  step = 50,
}: SidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get("categoria") || "all"
  const currentBrand = searchParams.get("brand") || ""

  const [price, setPrice] = useState(maxPrice)
  const [openMenus, setOpenMenus] = useState<string[]>([])

  const handleCategoryClick = (categoryKey: string, brand?: string) => {
    if (onCategoryChange) {
      onCategoryChange(categoryKey, brand)
    } else {
      const params = new URLSearchParams(searchParams.toString())
      if (categoryKey === "all") {
        params.delete("categoria")
        params.delete("brand")
      } else {
        params.set("categoria", categoryKey)
        if (brand) params.set("brand", brand)
        else params.delete("brand")
      }
      router.push(`/produtos?${params.toString()}`)
    }
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    setPrice(value)
    if (onPriceChange) onPriceChange(minPrice, value)
  }

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  return (
    <aside
      className={cn(
        "w-64 bg-white border-r border-black overflow-y-auto transform transition-transform duration-300 ease-in-out",
        isMobile
          ? "fixed inset-y-0 left-0 z-50 shadow-2xl"
          : "fixed left-0 top-16 h-[calc(100vh-4rem)]",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b border-black">
          <h2 className="text-lg font-bold text-black">Menu</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Fechar menu"
            className="rounded-full text-black hover:bg-orange-200"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      )}

      <div className="p-4">
        <h2 className="text-lg font-semibold text-black mb-4">Categorias</h2>
        <nav className="space-y-1 mb-6">
          {categories.map((category) => {
            const Icon = category.icon
            const isActive = currentCategory === category.key
            const hasChildren = category.children && category.children.length > 0
            const isOpenMenu = openMenus.includes(category.key)

            return (
              <div key={category.key}>
                <button
                  onClick={() => {
                    if (hasChildren) {
                      if (!isOpenMenu) {
                        toggleMenu(category.key) // abre submenu
                      } else {
                        handleCategoryClick(category.key) // já aberto → navega
                        if (isMobile && onClose) onClose()
                      }
                    } else {
                      handleCategoryClick(category.key)
                      if (isMobile && onClose) onClose()
                    }
                  }}
                  aria-label={`Selecionar categoria ${category.name}`}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-orange-400 text-black font-semibold"
                      : "bg-transparent text-black hover:bg-orange-200"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    {Icon && <Icon className="w-5 h-5" />}
                    <span>{category.name}</span>
                  </div>
                  {hasChildren && (
                    <span className="text-xs">{isOpenMenu ? "−" : "+"}</span>
                  )}
                </button>

                {/* Submenu */}
                {hasChildren && isOpenMenu && (
                  <div className="ml-8 mt-1 space-y-1">
                    {category.children.map((child) => (
                      <button
                        key={child.key}
                        onClick={() => {
                          handleCategoryClick(category.key, child.key)
                          if (isMobile && onClose) onClose()
                        }}
                        className={cn(
                          "w-full text-left px-2 py-2 rounded-lg text-sm transition-all",
                          currentCategory === category.key &&
                          currentBrand === child.key
                            ? "bg-orange-300 font-semibold"
                            : "hover:bg-orange-100"
                        )}
                      >
                        {child.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        <div className="border-t border-black pt-6">
          <h3 className="text-md font-semibold text-black mb-4">
            Filtro de Preço
          </h3>
          <div>
            <label
              htmlFor="price-range"
              className="block text-sm font-medium text-black mb-3"
            >
              Até: <span className="font-bold">€{price}</span>
            </label>
            <input
              id="price-range"
              type="range"
              min={minPrice}
              max={maxPrice}
              step={step}
              value={price}
              onChange={handlePriceChange}
              className="w-full accent-yellow-500 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-black mt-2">
              <span className="font-medium">€{minPrice}</span>
              <span className="font-medium">€{maxPrice}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
