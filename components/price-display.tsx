import { cn } from "@/lib/utils"

interface PriceDisplayProps {
  price: number
  originalPrice?: number | null
  currency?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export function PriceDisplay({ price, originalPrice, currency = "€", size = "md", className }: PriceDisplayProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  }

  const originalSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }

  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className={cn("text-primary font-bold", sizeClasses[size])}>
        {price}
        {currency}
      </span>
      {originalPrice && originalPrice > price && (
        <>
          <span className={cn("text-muted-foreground line-through", originalSizeClasses[size])}>
            {originalPrice}
            {currency}
          </span>
          {discount > 0 && (
            <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">-{discount}%</span>
          )}
        </>
      )}
    </div>
  )
}
