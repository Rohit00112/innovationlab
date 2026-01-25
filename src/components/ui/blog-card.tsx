import Image from "next/image"
import { Card } from "@/components/ui/card"

interface BlogCardProps {
  image: string
  category: string
  date: string
  title: string
  href?: string
}

export function BlogCard({ image, category, date, title, href = "#" }: BlogCardProps) {
  return (
    <a href={href} className="block group">
      <Card className="overflow-hidden mt-0 pt-0 shadow-none border-0 rounded-[0px]">
        <div className="relative w-full h-96 overflow-hidden bg-muted">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-0 bg-primary-background">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-md font-light text-muted-foreground">{category}</span>
            <span className="text-md font-light text-muted-foreground">-</span>
            <span className="text-md font-light text-muted-foreground">{date}</span>
          </div>
          <h2 className="text-2xl font-normal text-foreground leading-tight group-hover:text-primary">
            {title}
          </h2>
        </div>
      </Card>
    </a>
  )
}
