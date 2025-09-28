"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, Car } from "lucide-react"

export function MapSection() {
  const handleDirections = () => {
    // Open Google Maps with directions
    window.open("https://maps.google.com/?q=Rua+da+Tecnologia+123+Porto+Portugal", "_blank")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Localização
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Placeholder */}
          <div className="lg:col-span-2">
            <div className="w-full h-64 lg:h-80 bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
              {/* Simulated map with street layout */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100">
                <div className="absolute top-4 left-4 w-32 h-2 bg-gray-300 rounded"></div>
                <div className="absolute top-8 left-4 w-24 h-2 bg-gray-300 rounded"></div>
                <div className="absolute top-12 left-4 w-28 h-2 bg-gray-300 rounded"></div>

                <div className="absolute top-16 left-8 w-2 h-16 bg-gray-300 rounded"></div>
                <div className="absolute top-16 left-20 w-2 h-20 bg-gray-300 rounded"></div>

                {/* Location marker */}
                <div className="absolute top-20 left-16 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
              </div>

              <div className="relative z-10 text-center">
                <MapPin className="w-12 h-12 text-primary mx-auto mb-2" />
                <p className="text-sm font-semibold">Projeto Inovador</p>
                <p className="text-xs text-muted-foreground"> R. Projeto Inovador</p>
                <p className="text-xs text-muted-foreground">3040-381 Coimbra</p>
              </div>
            </div>
          </div>

          {/* Directions and Info */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-3">Como Chegar</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Car className="w-4 h-4 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">De Carro</p>
                    <p className="text-muted-foreground text-xs">Estacionamento gratuito disponível na rua</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Navigation className="w-4 h-4 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Transportes Públicos</p>
                    <p className="text-muted-foreground text-xs">
                      Metrobus Coimbra
                      <br />
                     
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Button onClick={handleDirections} className="w-full">
              <Navigation className="w-4 h-4 mr-2" />
              Ver Direções no Google Maps
            </Button>

            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Nota:</strong> Para reparações urgentes ou fora do horário normal, contacte-nos previamente para
                agendar.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
