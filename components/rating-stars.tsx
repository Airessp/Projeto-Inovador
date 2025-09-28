import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingStarsProps {
  rating: number
  maxRating?: number
  size?: "sm" | "md" | "lg"
  showValue?: boolean
  className?: string
}

export function RatingStars({ rating, maxRating = 5, size = "md", showValue = true, className }: RatingStarsProps) {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex">
        {Array.from({ length: maxRating }, (_, index) => {
          const starValue = index + 1
          const isFilled = starValue <= rating
          const isHalfFilled = starValue - 0.5 <= rating && starValue > rating

          return (
            <Star
              key={index}
              className={cn(
                sizeClasses[size],
                isFilled || isHalfFilled ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground",
              )}
            />
          )
        })}
      </div>
      {showValue && <span className={cn("text-muted-foreground", textSizeClasses[size])}>{rating.toFixed(1)}</span>}
    </div>
  )
}
