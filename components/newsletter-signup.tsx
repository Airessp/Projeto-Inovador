"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Subscrição realizada com sucesso!",
      description: "Obrigado por se juntar à nossa newsletter.",
    })

    setIsSubscribed(true)
    setEmail("")
    setIsSubmitting(false)
  }

  if (isSubscribed) {
    return (
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Subscrição Confirmada!</h3>
          <p className="text-sm text-muted-foreground">Receberá as nossas últimas ofertas e novidades por email.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary" />
          Newsletter TorrentLite
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Receba as nossas melhores ofertas e novidades tecnológicas diretamente no seu email.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1"
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "..." : "Subscrever"}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-2">Pode cancelar a subscrição a qualquer momento.</p>
      </CardContent>
    </Card>
  )
}
