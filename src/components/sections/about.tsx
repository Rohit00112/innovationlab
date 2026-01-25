import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function About() {
    return (
        <div className="w-full bg-background text-foreground">
            <Card className="border-0 shadow-none rounded-none bg-background">
                <CardContent className="p-0">
                    <div className="w-full pt-20">
                        <div className="max-w-7xl mx-auto">
                            <h2 className="text-5xl font-bold tracking-tight mb-8">ABOUT THE LAB</h2>
                            <p className="text-lg leading-relaxed text-foreground/80 mb-8 max-w-[500px]">
                                We are a forward-thinking creative laboratory dedicated to pushing the boundaries of design and
                                innovation. Our work bridges the gap between concept and reality, transforming ideas into meaningful
                                experiences.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-0 shadow-none rounded-none bg-background">
                <CardContent className="p-0">
                    <div className="w-full py-12">
                        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
                            <div className="flex flex-col justify-start">
                                <h3 className="text-2xl font-bold mb-6 uppercase tracking-wide">Our Mission</h3>
                                <p className="text-lg leading-relaxed text-foreground/80 mb-8">
                                    We are a forward-thinking creative laboratory dedicated to pushing the boundaries of design and
                                    innovation. Our work bridges the gap between concept and reality, transforming ideas into meaningful
                                    experiences.
                                </p>
                                <p className="text-lg leading-relaxed text-foreground/80">
                                    Every project is an opportunity to explore new possibilities and challenge conventional thinking. We
                                    believe in the power of thoughtful design to create lasting impact.
                                </p>
                            </div>
                            <div className="flex flex-col justify-start">
                                <h3 className="text-2xl font-bold mb-6 uppercase tracking-wide">Our Values</h3>
                                <div className="space-y-6">
                                    <div className="border-l-2 border-foreground pl-6">
                                        <h4 className="font-bold text-lg mb-2">Innovation</h4>
                                        <p className="text-foreground/70">
                                            Constantly exploring new techniques and technologies to stay ahead.
                                        </p>
                                    </div>
                                    <div className="border-l-2 border-foreground pl-6">
                                        <h4 className="font-bold text-lg mb-2">Precision</h4>
                                        <p className="text-foreground/70">
                                            Meticulous attention to detail in every aspect of our work.
                                        </p>
                                    </div>
                                    <div className="border-l-2 border-foreground pl-6">
                                        <h4 className="font-bold text-lg mb-2">Collaboration</h4>
                                        <p className="text-foreground/70">
                                            Working closely with clients to bring their vision to life.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <section className="w-full py-20 border-t border-foreground/10">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { value: "500+", label: "Projects Completed" },
                        { value: "12", label: "Years Experience" },
                        { value: "50+", label: "Team Members" },
                        { value: "25", label: "Awards Won" },
                    ].map((item) => (
                        <Card key={item.label} className=" border-0 shadow-none">
                            <CardContent className="p-6 flex flex-col items-center">
                                <span className="text-4xl md:text-5xl font-bold mb-2">{item.value}</span>
                                <span className="text-foreground/60 uppercase text-sm tracking-wide">
                                    {item.label}
                                </span>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    )
}
