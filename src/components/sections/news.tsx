import Image from "next/image"
import { Card, CardContent } from "../ui/card"
import { BlogCard } from "../ui/blog-card"
import { Button } from "../ui/button"
import { ArrowUpRight } from "lucide-react"

interface BlogCardProps {
    image: string
    category: string
    date: string
    title: string
    href?: string
}

export default function News() {
    return (
        <div className="">
            <div className="w-full py-12 flex flex-row justify-between ">
                <h2 className="text-5xl font-bold">NEWS AND UPDATES</h2>
                <Button className=" aspect-square "><ArrowUpRight size={32} /></Button>
            </div>
            <div className="grid grid-cols-3 gap-6">
                {
                [1, 2, 3].map((item: any, index: number) => {
                    return (
                        <BlogCard
                            key={index}
                            image="https://thumbs.dreamstime.com/b/vibrant-image-showcasing-bowl-cheetos-snacks-381564097.jpg"
                            category="Development"
                            date="01 Feb, 2025"
                            title="Building Scalable Web Applications with Modern Frameworks."
                            href="#"
                        />
                    )
                })
            }
            </div>
        </div>
    )
}