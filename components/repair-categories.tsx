"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Laptop, Monitor, Clock, CheckCircle, Star, Shield, Zap } from "lucide-react"
import { RepairForm } from "@/components/repair-form"

// 🔹 Modal genérico
function Modal({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-3xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  )
}

// 🔹 Dados de categorias e reparações
const repairCategories = [
  {
    id: "iphones",
    title: "iPhone",
    icon: Smartphone,
    description: "Reparação de todos os modelos iPhone",
    emoji: "📱",
    models: [
      {
        name: "iPhone 15 Pro Max",
        repairs: {
          screen: 149,
          battery: 89,
          camera: 119,
          cameraFront: 109,
          lensRear: 39,
          backGlass: 159,
          faceId: 179,
          microphone: 139,
          speaker: 139,
          earpiece: 99,
          chargingPort: 139,
          buttons: 129,
          muteSwitch: 99,
          proximity: 109,
          wifi: 119,
          taptic: 119,
          water: 49,
          dataTransfer: 29,
          diagnostic: 39,
        },
      },
      {
        name: "iPhone 14 Pro",
        repairs: {
          screen: 129,
          battery: 79,
          camera: 109,
          cameraFront: 95,
          lensRear: 35,
          backGlass: 139,
          faceId: 159,
          microphone: 115,
          speaker: 115,
          earpiece: 85,
          chargingPort: 115,
          buttons: 105,
          muteSwitch: 85,
          proximity: 95,
          wifi: 105,
          taptic: 95,
          water: 49,
          dataTransfer: 29,
          diagnostic: 39,
        },
      },
      {
        name: "iPhone 13",
        repairs: {
          screen: 109,
          battery: 59,
          camera: 79,
          cameraFront: 69,
          lensRear: 25,
          backGlass: 109,
          faceId: 139,
          microphone: 99,
          speaker: 99,
          earpiece: 69,
          chargingPort: 99,
          buttons: 89,
          muteSwitch: 69,
          proximity: 79,
          wifi: 89,
          taptic: 79,
          water: 35,
          dataTransfer: 25,
          diagnostic: 35,
        },
      },
      {
        name: "iPhone 12",
        repairs: {
          screen: 99,
          battery: 49,
          camera: 69,
          cameraFront: 59,
          lensRear: 19,
          backGlass: 99,
          faceId: 119,
          microphone: 89,
          speaker: 89,
          earpiece: 59,
          chargingPort: 89,
          buttons: 79,
          muteSwitch: 59,
          proximity: 69,
          wifi: 79,
          taptic: 69,
          water: 29,
          dataTransfer: 25,
          diagnostic: 29,
        },
      },
    ],
    repairTypes: [
      { id: "screen", name: "Substituição de Ecrã", time: "30 min", icon: "🔧" },
      { id: "battery", name: "Substituição de Bateria", time: "20 min", icon: "🔋" },
      { id: "camera", name: "Câmara Traseira", time: "45 min", icon: "📷" },
      { id: "cameraFront", name: "Câmara Frontal", time: "40 min", icon: "🤳" },
      { id: "lensRear", name: "Lente Câmara Traseira", time: "25 min", icon: "🔍" },
      { id: "backGlass", name: "Vidro Traseiro", time: "60 min", icon: "🪞" },
      { id: "faceId", name: "Face ID", time: "45 min", icon: "👁️" },
      { id: "microphone", name: "Microfone", time: "30 min", icon: "🎤" },
      { id: "speaker", name: "Altifalante (Base)", time: "30 min", icon: "🔊" },
      { id: "earpiece", name: "Auricular (Topo)", time: "30 min", icon: "🎧" },
      { id: "chargingPort", name: "Porta de Ligação", time: "40 min", icon: "⚡" },
      { id: "buttons", name: "Botões Volume/Power", time: "40 min", icon: "🔘" },
      { id: "muteSwitch", name: "Botão Silêncio", time: "30 min", icon: "🔈" },
      { id: "proximity", name: "Sensor de Proximidade", time: "30 min", icon: "📡" },
      { id: "wifi", name: "Antena Wi-Fi/GPS", time: "45 min", icon: "📶" },
      { id: "taptic", name: "Taptic Engine (Vibração)", time: "30 min", icon: "💠" },
      { id: "water", name: "Limpeza por Líquidos", time: "90 min", icon: "💧" },
      { id: "dataTransfer", name: "Passagem de Dados", time: "30 min", icon: "💾" },
      { id: "diagnostic", name: "Diagnóstico/Intervenção", time: "30 min", icon: "🛠️" },
    ],
  },
  {
    id: "macbooks",
    title: "Mac",
    icon: Laptop,
    description: "Reparação de MacBook Air e MacBook Pro",
    emoji: "💻",
    models: [
      { name: 'MacBook Pro M3 16"', repairs: { screen: 399, battery: 199, keyboard: 249 } },
      { name: 'MacBook Air M2 13"', repairs: { screen: 279, battery: 139, keyboard: 189 } },
    ],
    repairTypes: [
      { id: "screen", name: "Substituição de Ecrã", time: "2 horas", icon: "🖥️" },
      { id: "battery", name: "Substituição de Bateria", time: "1 hora", icon: "🔋" },
      { id: "keyboard", name: "Reparação de Teclado", time: "90 min", icon: "⌨️" },
    ],
  },
  {
    id: "outros",
    title: "Outros",
    icon: Monitor,
    description: "Tablets, smartwatches e outros dispositivos",
    emoji: "⚙️",
    models: [
      { name: 'iPad Pro 12.9"', repairs: { screen: 199, battery: 119, buttons: 69 } },
      { name: "Apple Watch SE", repairs: { screen: 109, battery: 69, buttons: 39 } },
    ],
    repairTypes: [
      { id: "screen", name: "Substituição de Ecrã", time: "45 min", icon: "📱" },
      { id: "battery", name: "Substituição de Bateria", time: "30 min", icon: "🔋" },
      { id: "buttons", name: "Reparação de Botões", time: "20 min", icon: "🔘" },
    ],
  },
]

export function RepairCategories() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState<any>(null)
  const [selectedRepair, setSelectedRepair] = useState<any>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalDevice, setModalDevice] = useState<string | undefined>(undefined)
  const [modalRepair, setModalRepair] = useState<string | undefined>(undefined)

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setSelectedModel(null)
    setSelectedRepair(null)
  }

  const handleModelSelect = (model: any) => {
    setSelectedModel(model)
    setSelectedRepair(null)
  }

  const handleRepairSelect = (repairType: any) => {
    if (selectedModel) {
      const price = selectedModel?.repairs?.[repairType.id]
      setSelectedRepair({
        ...repairType,
        price: price,
      })
    }
  }

  const openForm = (device?: string, repair?: string) => {
    setModalDevice(device)
    setModalRepair(repair)
    setIsModalOpen(true)
  }

  const selectedCategoryData = repairCategories.find((cat) => cat.id === selectedCategory)

  return (
    <div className="space-y-12">
      {/* 🔹 Botão global de agendamento */}
      <div className="text-center">
        <Button
          onClick={() => openForm()}
          className="px-8 py-4 font-bold rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 shadow-lg text-black text-lg"
        >
          Agendar Reparação
        </Button>
        <p className="text-gray-600 mt-2 text-sm">
          Pode agendar diretamente, sem escolher reparação.
        </p>
      </div>

      {/* Categorias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {repairCategories.map((category) => {
          const isSelected = selectedCategory === category.id
          return (
            <Card
              key={category.id}
              className={`cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 shadow-lg bg-white rounded-3xl overflow-hidden ${
                isSelected ? "ring-4 ring-yellow-500 shadow-yellow-200" : ""
              }`}
              onClick={() => handleCategorySelect(category.id)}
            >
              <CardContent className="p-8 text-center">
                <div
                  className={`mx-auto mb-6 w-24 h-24 rounded-full flex items-center justify-center text-4xl ${
                    isSelected
                      ? "bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-lg"
                      : "bg-gradient-to-br from-gray-100 to-gray-200 hover:from-yellow-50 hover:to-yellow-100"
                  }`}
                >
                  {category.emoji}
                </div>
                <h3
                  className={`text-2xl font-black mb-3 ${
                    isSelected ? "text-yellow-600" : "text-gray-900"
                  }`}
                >
                  {category.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {category.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Modelos + Reparações */}
      {selectedCategoryData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Modelos */}
          <Card className="border-0 shadow-lg rounded-2xl bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <span className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                  1
                </span>
                Selecione o Modelo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-2 scroll-thin">
                {selectedCategoryData.models.map((model) => (
                  <Button
                    key={model.name}
                    variant={selectedModel?.name === model.name ? "default" : "outline"}
                    className={`w-full justify-start h-auto py-4 px-4 rounded-xl font-semibold ${
                      selectedModel?.name === model.name
                        ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg"
                        : "border-gray-200 hover:border-yellow-300 hover:bg-yellow-50"
                    }`}
                    onClick={() => handleModelSelect(model)}
                  >
                    {model.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reparações */}
          <Card className="border-0 shadow-lg rounded-2xl bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <span className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                  2
                </span>
                Tipo de Reparação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2 scroll-thin">
                {selectedCategoryData.repairTypes.map((repairType) => {
                  const price = selectedModel?.repairs?.[repairType.id]
                  const isSelected = selectedRepair?.id === repairType.id
                  return (
                    <div
                      key={repairType.id}
                      className={`p-5 border-2 rounded-xl cursor-pointer transition ${
                        isSelected
                          ? "border-yellow-500 bg-yellow-50 shadow-md"
                          : "border-gray-200 hover:border-yellow-300"
                      } ${!selectedModel ? "opacity-50 cursor-not-allowed" : ""}`}
                      onClick={() => selectedModel && handleRepairSelect(repairType)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{repairType.icon}</span>
                          <div>
                            <h4 className="font-bold text-gray-900">{repairType.name}</h4>
                            <Badge
                              variant="secondary"
                              className="flex items-center gap-1 bg-gray-100 text-gray-700 mt-1"
                            >
                              <Clock className="w-3 h-3" />
                              {repairType.time}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          {typeof price === "number" && price > 0 ? (
                            <span className="text-2xl font-black text-yellow-600">
                              {price}€
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">
                              Sob consulta
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Resumo */}
      {selectedModel && selectedRepair && (
        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-2xl shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-yellow-700 text-xl">
              <CheckCircle className="w-6 h-6" /> Resumo da Reparação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <span className="font-bold">Dispositivo:</span>
                <p>{selectedModel.name}</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <span className="font-bold">Reparação:</span>
                <p>{selectedRepair.name}</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <span className="font-bold">Tempo:</span>
                <p>{selectedRepair.time}</p>
              </div>
            </div>
            <div className="flex items-center justify-between border-t pt-6">
              <div>
                {typeof selectedRepair.price === "number" &&
                selectedRepair.price > 0 ? (
                  <span className="text-4xl font-black text-yellow-600">
                    {selectedRepair.price}€
                  </span>
                ) : (
                  <span className="text-xl font-bold text-gray-600">
                    Sob consulta
                  </span>
                )}
                <p className="text-sm text-gray-600">
                  Preço final com garantia de 6 meses incluída
                </p>
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={() =>
                    openForm(selectedModel.name, selectedRepair.name)
                  }
                  className="px-6 py-3 font-bold rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 shadow-lg text-black"
                >
                  Agendar Reparação
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal com o formulário */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <RepairForm device={modalDevice} repair={modalRepair} />
      </Modal>

      {/* Benefícios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
        <Card className="border-0 shadow-lg rounded-2xl">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-black text-xl mb-3">Garantia de 6 Meses</h3>
            <p>Todas as reparações incluem garantia completa de 6 meses</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg rounded-2xl">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-black text-xl mb-3">Reparação Rápida</h3>
            <p>Maioria das reparações concluídas no mesmo dia</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg rounded-2xl">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-black text-xl mb-3">Peças Originais</h3>
            <p>Utilizamos apenas peças originais ou de alta qualidade</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
