"use client"

import { useState, useEffect, useRef } from "react"
import { MessageCircle, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Olá! 👋 Sou o assistente virtual. Pergunte-me sobre horários, morada, produtos ou serviços.",
      sender: "bot",
    },
  ])

  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  // 🔹 Scroll automático para o fundo sempre que há nova mensagem
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const sugestoes = ["Produtos", "Loja", "Morada", "Horário", "Contacto"]

  const handleSendMessage = (customMessage?: string) => {
    const text = customMessage || message.trim()
    if (!text) return

    const newMessage = { id: Date.now(), text, sender: "user" }
    setMessages((prev) => [...prev, newMessage])

    setTimeout(() => {
      let botText = "🤔 Não entendi. Pode reformular ou pedir para falar com um técnico humano."

      if (text.toLowerCase().includes("prod")) {
        botText = "📦 Temos uma vasta gama de produtos! Pode consultar em /produtos."
      } else if (text.toLowerCase().includes("loja")) {
        botText = "🏬 A nossa loja física fica em Coimbra. Pode visitar-nos quando quiser!"
      } else if (text.toLowerCase().includes("morada")) {
        botText = "📍 Estamos localizados em Coimbra, na Rua Exemplo nº 123."
      } else if (text.toLowerCase().includes("hor")) {
        botText = "⏰ O nosso horário é de segunda a sexta das 9h às 19h e sábado das 9h às 13h."
      } else if (text.toLowerCase().includes("contact")) {
        botText = "📞 Pode ligar para o 239 000 000 ou enviar email para suporte@projetoinovador.pt."
      }

      const botResponse = { id: Date.now() + 1, text: botText, sender: "bot" }
      setMessages((prev) => [...prev, botResponse])
    }, 800)

    setMessage("")
  }

  return (
    <>
      {/* Botão Flutuante */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-50 bg-yellow-500 hover:bg-orange-500 text-black"
        size="icon"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      {/* Janela do Chat */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-80 h-96 shadow-xl z-50 flex flex-col animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <CardHeader className="flex flex-row items-center justify-between bg-yellow-500 text-black py-2 px-3">
            <CardTitle className="text-sm font-bold">🤖 Suporte Projeto Inovador</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 text-black hover:bg-yellow-300 rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>

          {/* Conteúdo */}
          <CardContent className="flex flex-col h-full p-3 bg-white">
            {/* Mensagens com scroll */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 scroll-thin">
              {messages.map((msg, i) => (
                <div
                  key={msg.id}
                  className={`p-2 text-sm max-w-[80%] rounded-lg ${
                    msg.sender === "bot"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-yellow-500 text-black ml-auto"
                  }`}
                >
                  {msg.text}

                  {/* Botões rápidos apenas na 1ª mensagem do bot */}
                  {i === 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {sugestoes.map((s, idx) => (
                        <Button
                          key={idx}
                          size="sm"
                          variant="outline"
                          onClick={() => handleSendMessage(s)}
                          className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 text-xs rounded-lg"
                        >
                          {s}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input sempre visível */}
            <div className="flex space-x-2 mt-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escreva a sua mensagem..."
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 rounded-lg"
              />
              <Button
                size="icon"
                onClick={() => handleSendMessage()}
                className="bg-yellow-500 hover:bg-orange-500 text-black"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
