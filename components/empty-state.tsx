"use client"

import { Button } from "@/components/ui/button"
import { Search, Package, AlertCircle } from "lucide-react"

interface EmptyStateProps {
  type?: "search" | "products" | "error"
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ type = "search", title, description, actionLabel, onAction }: EmptyStateProps) {
  const getIcon = () => {
    switch (type) {
      case "search":
        return <Search className="w-12 h-12 text-muted-foreground" />
      case "products":
        return <Package className="w-12 h-12 text-muted-foreground" />
      case "error":
        return <AlertCircle className="w-12 h-12 text-destructive" />
      default:
        return <Search className="w-12 h-12 text-muted-foreground" />
    }
  }

  const getDefaultContent = () => {
    switch (type) {
      case "search":
        return {
          title: "Nenhum resultado encontrado",
          description: "Tente ajustar os seus critérios de pesquisa ou filtros.",
        }
      case "products":
        return {
          title: "Nenhum produto disponível",
          description: "Não há produtos nesta categoria no momento.",
        }
      case "error":
        return {
          title: "Algo correu mal",
          description: "Ocorreu um erro ao carregar o conteúdo. Tente novamente.",
        }
      default:
        return {
          title: "Nenhum resultado",
          description: "Não foi possível encontrar o que procura.",
        }
    }
  }

  const defaultContent = getDefaultContent()

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="mb-4">{getIcon()}</div>
      <h3 className="text-lg font-semibold mb-2">{title || defaultContent.title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{description || defaultContent.description}</p>
      {actionLabel && onAction && <Button onClick={onAction}>{actionLabel}</Button>}
    </div>
  )
}
