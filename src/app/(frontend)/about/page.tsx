import {
  Globe,
  Heart,
  Layers,
  Lightbulb,
  Rocket,
  Target,
  Trophy,
  Users,
  Zap,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { resolveApiBaseUrl } from "@/lib/http/resolve-api-base-url";

export const revalidate = 60;

interface TeamMember {
  id: number;
  name: string;
  position: string;
  bio: string | null;
  photoUrl: string | null;
  category: "head" | "core" | "mentor";
}

interface TeamResponse {
  data: TeamMember[];
}

const categoryLabels: Record<TeamMember["category"], string> = {
  head: "Innovation Lab Head",
  core: "Core Member",
  mentor: "Mentor"
};

async function fetchTeamMembers(): Promise<TeamMember[]> {
  const baseUrl = resolveApiBaseUrl();

  try {
    const response = await fetch(`${baseUrl}/api/team`, {
      next: { revalidate: 0 },
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const data: TeamResponse = await response.json();
    return data.data;
  } catch {
    return [];
  }
}

export default async function AboutPage() {
  const teamMembers = await fetchTeamMembers();

  const missionPanels = [
    {
      title: "Mission",
      subtitle: "Empower Innovators",
      description:
        "We provide students with the resources, mentorship, and collaborative environment needed to transform bold ideas into impactful solutions that address real-world challenges.",
      icon: Target,
      color: "bg-orange-500/10 text-orange-600",
    },
    {
      title: "Vision",
      subtitle: "Lead Innovation",
      description:
        "To become a leading innovation hub that bridges academia and industry, fostering a culture of creativity, experimentation, and technological advancement.",
      icon: Lightbulb,
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      title: "Approach",
      subtitle: "Learning by Building",
      description:
        "Hands-on project-based learning combined with industry mentorship, enabling students to gain practical experience while developing innovative solutions.",
      icon: Layers,
      color: "bg-green-500/10 text-green-600",
    },
    {
      title: "Community",
      subtitle: "Inclusive by Design",
      description:
        "A diverse and welcoming community where every voice is heard, collaboration is celebrated, and innovation thrives through collective effort.",
      icon: Users,
      color: "bg-purple-500/10 text-purple-600",
    },
  ];

  const values = [
    {
      title: "Passion",
      description: "Driven by curiosity and enthusiasm to explore new technologies and push the boundaries of what's possible.",
      icon: Heart,
    },
    {
      title: "Collaboration",
      description: "Working together across disciplines to create solutions that are greater than the sum of their parts.",
      icon: Users,
    },
    {
      title: "Innovation",
      description: "Constantly seeking new approaches, embracing failure as learning, and iterating toward breakthrough solutions.",
      icon: Zap,
    },
    {
      title: "Impact",
      description: "Creating meaningful change that extends beyond the lab, benefiting communities and society at large.",
      icon: Globe,
    },
  ];

  const milestones = [
    {
      year: "2015",
      title: "Foundation",
      description:
        "Innovation Lab was established at Itahari International College with a vision to create a collaborative space for student innovation and research.",
    },
    {
      year: "2018",
      title: "First Breakthrough",
      description:
        "Successfully launched our first major project, gaining recognition from industry partners and establishing our reputation for excellence.",
    },
    {
      year: "2021",
      title: "Expansion",
      description:
        "Expanded our programs and partnerships, reaching international collaborators and broadening our impact across multiple domains.",
    },
    {
      year: "2024",
      title: "Recognition",
      description:
        "Received multiple awards for innovation and community impact, solidifying our position as a leading student innovation hub.",
    },
  ];

  const achievements = [
    { value: "500+", label: "Projects delivered", icon: Rocket },
    { value: "12+", label: "Years of momentum", icon: Trophy },
    { value: "50+", label: "Collaborators", icon: Users },
    { value: "25", label: "Awards & honours", icon: Globe },
  ];

  return (
    <main className="w-full bg-background text-foreground">
      {/* Animated Hero Section */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-background z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-70"></div>
          <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-secondary/30 rounded-full blur-3xl animate-blob opacity-60"></div>
          <div className="absolute bottom-[-10%] left-[10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl animate-blob animation-delay-4000 opacity-60"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 w-full relative z-10">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/50 backdrop-blur-sm border border-border/50 rounded-full text-xs font-semibold tracking-wide uppercase text-foreground/80">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                About Us
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                  SHAPING THE
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">FUTURE</span>
                </h1>
                <p className="text-xl leading-relaxed text-foreground/80 max-w-xl">
                  At Innovation Lab, we transform bold ideas into real-world solutions through technology, creativity, and collaborative innovation.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4">
                <Button size="lg" className="px-8 text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform" asChild>
                  <Link href="/events">
                    Join Us
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 text-sm font-bold rounded-xl border-border/50 bg-background/50 backdrop-blur-sm hover:bg-secondary/50 transition-all"
                  asChild
                >
                  <Link href="/#">View Projects</Link>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 translate-y-8">
                <div className="glass-card p-8 rounded-2xl flex flex-col justify-center text-center">
                  <h3 className="text-4xl font-bold mb-2 text-primary">87%</h3>
                  <p className="text-xs uppercase tracking-widest text-foreground/60 font-medium">Ideas Shipped</p>
                </div>
                <div className="glass-card p-8 rounded-2xl flex flex-col justify-center text-center bg-secondary/30">
                  <h3 className="text-4xl font-bold mb-2 text-foreground">110</h3>
                  <p className="text-xs uppercase tracking-widest text-foreground/60 font-medium">Mentors</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="glass-card p-8 rounded-2xl flex flex-col justify-center text-center bg-primary/5">
                  <h3 className="text-4xl font-bold mb-2 text-foreground">42</h3>
                  <p className="text-xs uppercase tracking-widest text-foreground/60 font-medium">Industry Allies</p>
                </div>
                <div className="glass-card p-8 rounded-2xl flex flex-col justify-center text-center">
                  <h3 className="text-4xl font-bold mb-2 text-accent-foreground">72</h3>
                  <p className="text-xs uppercase tracking-widest text-foreground/60 font-medium">Global Pilots</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-muted/30 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="space-y-4 mb-16 text-center max-w-2xl mx-auto">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase">
              Our Foundation
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Mission, Vision & Approach</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {missionPanels.map((panel) => {
              const Icon = panel.icon;
              return (
                <div
                  key={panel.title}
                  className="group relative bg-card/60 backdrop-blur-md p-8 rounded-3xl border border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:translate-y-[-4px] overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 ${panel.color.split(" ")[0]} opacity-20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`}></div>

                  <div className="flex items-start gap-4 mb-6 relative z-10">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${panel.color} shadow-sm group-hover:scale-110 transition-transform`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{panel.title}</p>
                      <h3 className="mt-1 text-2xl font-bold text-foreground">{panel.subtitle}</h3>
                    </div>
                  </div>
                  <p className="text-base leading-relaxed text-foreground/70 relative z-10">{panel.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-3xl opacity-40 -z-10"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent-foreground text-xs font-semibold tracking-wide uppercase">
                  Our Values
                </span>
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
                  What Drives Us Forward
                </h2>
              </div>
              <p className="text-lg leading-relaxed text-foreground/70">
                Our core values shape every project, collaboration, and innovation that emerges from the lab. They guide our approach to problem-solving and community building.
              </p>

              <div className="relative h-64 w-full rounded-2xl overflow-hidden shadow-lg border border-border/50 hidden lg:block">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 z-0"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-16 h-16 text-primary/40 animate-pulse" />
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <div
                    key={value.title}
                    className="flex gap-6 p-6 rounded-2xl hover:bg-card/50 hover:border-border/50 border border-transparent transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{value.title}</h3>
                      <p className="text-foreground/70 leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 border-y border-border/50 bg-muted/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-[1fr_1.5fr]">
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold tracking-wide uppercase">
                  Our Journey
                </span>
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
                  Evolution of Excellence
                </h2>
              </div>
              <p className="text-lg leading-relaxed text-foreground/70">
                From our founding to today, we&apos;ve grown into a thriving innovation ecosystem that continues to push boundaries and create impact.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-6 rounded-2xl text-center">
                  <p className="text-xs uppercase tracking-widest text-foreground/50 font-semibold">Global Pilots</p>
                  <p className="mt-2 text-4xl font-bold text-primary">72</p>
                </div>
                <div className="glass-card p-6 rounded-2xl text-center">
                  <p className="text-xs uppercase tracking-widest text-foreground/50 font-semibold">Mentors</p>
                  <p className="mt-2 text-4xl font-bold text-primary">110</p>
                </div>
              </div>
            </div>

            <div className="relative pl-8 md:pl-12">
              <div className="absolute left-0 top-4 bottom-4 w-px bg-gradient-to-b from-primary/80 to-transparent" />
              <div className="space-y-12">
                {milestones.map((item) => (
                  <div key={item.year} className="relative group">
                    <span className="absolute -left-[39px] md:-left-[55px] top-1.5 h-4 w-4 rounded-full border-2 border-primary bg-background group-hover:bg-primary transition-colors shadow-[0_0_0_4px_rgba(var(--primary),0.2)]" />
                    <div className="glass-card p-6 rounded-2xl border border-border/50 hover:border-primary/30 transition-all">
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-secondary text-secondary-foreground mb-2">{item.year}</span>
                      <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                      <p className="text-sm leading-relaxed text-foreground/70">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent-foreground text-xs font-semibold tracking-wide uppercase">
              Our Impact
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Building Momentum Together
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {achievements.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="glass-card p-8 rounded-3xl text-center hover:scale-105 transition-transform duration-300"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="block text-3xl font-bold mb-2">{stat.value}</span>
                  <span className="text-xs uppercase tracking-widest text-foreground/60 font-medium">
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 border-t border-border/50 bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase">
              Our Team
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Meet the people powering the lab
            </h2>
            <p className="text-base max-w-3xl mx-auto leading-relaxed text-foreground/70">
              A multidisciplinary crew of mentors, makers, and strategists keeps Innovation Lab humming—from vision and research to day-to-day student support.
            </p>
          </div>

          {teamMembers.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="group relative bg-card rounded-3xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:translate-y-[-4px]"
                >
                  <div className="p-8 pb-0 flex items-center gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-primary/20 group-hover:border-primary transition-colors flex-shrink-0">
                      {member.photoUrl ? (
                        <Image
                          src={member.photoUrl}
                          alt={member.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-lg font-bold bg-secondary text-secondary-foreground">
                          {member.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{member.name}</h3>
                      <p className="text-xs font-bold uppercase tracking-widest text-primary/80">
                        {member.position}
                      </p>
                    </div>
                  </div>

                  <div className="p-8 pt-6 space-y-6">
                    {member.bio && (
                      <p className="text-sm leading-relaxed text-foreground/70">{member.bio}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-2 border border-border bg-muted/50 px-3 py-1 text-xs font-medium rounded-full text-foreground/70">
                        {categoryLabels[member.category]}
                      </span>
                    </div>
                  </div>

                  {/* Decorative bottom gradient */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card rounded-3xl border border-dashed border-border/50">
              <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-lg text-muted-foreground font-medium">Team members will appear here.</p>
              <p className="text-sm text-muted-foreground/70 mt-2">Add team members through the admin dashboard.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
