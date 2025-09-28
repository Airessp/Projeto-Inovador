import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const promotions = [
  {
    id: 1,
    title: "Gaming Setup Completo",
    description: "PC + Monitor + Periféricos",
    discount: "-25%",
    price: "Desde 899€",
    image: "/gaming-setup-computer.jpg",
    category: "gaming",
  },
  {
    id: 2,
    title: "Impressoras + Tinteiros",
    description: "Pack completo para escritório",
    discount: "-30%",
    price: "Desde 149€",
    image: "/office-printer-with-ink-cartridges.jpg",
    category: "impressoras",
  },
  {
    id: 3,
    title: "Smartphones Android",
    description: "Samsung, Xiaomi, OnePlus",
    discount: "-20%",
    price: "Desde 299€",
    image: "/android-smartphones-collection.jpg",
    category: "smartphones",
  },
  {
    id: 4,
    title: "Acessórios Tech",
    description: "Cabos, carregadores, capas",
    discount: "-15%",
    price: "Desde 9€",
    image: "/tech-accessories-cables-chargers.jpg",
    category: "acessorios",
  },
]

export function PromotionalGrid() {
  return (
    <section className="py-12 px-6 bg-muted/30">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Destaques Promocionais</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {promotions.map((promo) => (
            <Card key={promo.id} className="group hover:shadow-lg transition-shadow overflow-hidden">
              <div className="relative">
                <img
                  src={promo.image || "/placeholder.svg"}
                  alt={promo.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                />
                <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">{promo.discount}</Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{promo.title}</h3>
                <p className="text-muted-foreground text-sm mb-3">{promo.description}</p>
                <p className="text-primary font-bold mb-3">{promo.price}</p>
                <Button className="w-full bg-transparent" variant="outline">
                  Ver Ofertas
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
