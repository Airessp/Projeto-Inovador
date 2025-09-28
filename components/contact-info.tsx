import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Mail, Clock, Car, CreditCard } from "lucide-react"

export function ContactInfo() {
  return (
    <div className="space-y-6">
      {/* Contact Details */}
      <Card>
        <CardHeader>
          <CardTitle>Informações de Contacto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-semibold">Morada</p>
              <p className="text-sm text-muted-foreground">
                R. Projeto Inovador
                <br />
                3040-381 Coimbra, Portugal
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-semibold">Telefone</p>
              <p className="text-sm text-muted-foreground">+351 220 123 456</p>
              <p className="text-sm text-muted-foreground">+351 912 345 678 (Móvel)</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-semibold">Email</p>
              <p className="text-sm text-muted-foreground">info@projeto.pt</p>
              <p className="text-sm text-muted-foreground">suporte@projeto.pt</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Opening Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Horário de Funcionamento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Segunda a Sexta</span>
            <Badge variant="outline">09:00 - 19:00</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Sábado</span>
            <Badge variant="outline">09:00 - 17:00</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Domingo</span>
            <Badge variant="secondary">Fechado</Badge>
          </div>
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">Reparações urgentes disponíveis mediante marcação prévia</p>
          </div>
        </CardContent>
      </Card>

      {/* Services */}
      <Card>
        <CardHeader>
          <CardTitle>Serviços Disponíveis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Car className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-semibold text-sm">Entrega Gratuita</p>
              <p className="text-xs text-muted-foreground">Compras superiores a 50€ em Coimbra</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-semibold text-sm">Pagamento Flexível</p>
              <p className="text-xs text-muted-foreground">MB Way, Multibanco, Cartão</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-primary" />
            <div>
              <p className="font-semibold text-sm">Suporte Técnico</p>
              <p className="text-xs text-muted-foreground">Apoio especializado pós-venda</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
