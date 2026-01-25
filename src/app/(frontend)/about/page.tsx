"use client";

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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  const missionPanels = [
    {
      title: "Mission",
      subtitle: "Empower Innovators",
      description:
        "We provide students with the resources, mentorship, and collaborative environment needed to transform bold ideas into impactful solutions that address real-world challenges.",
      icon: Target,
    },
    {
      title: "Vision",
      subtitle: "Lead Innovation",
      description:
        "To become a leading innovation hub that bridges academia and industry, fostering a culture of creativity, experimentation, and technological advancement.",
      icon: Lightbulb,
    },
    {
      title: "Approach",
      subtitle: "Learning by Building",
      description:
        "Hands-on project-based learning combined with industry mentorship, enabling students to gain practical experience while developing innovative solutions.",
      icon: Layers,
    },
    {
      title: "Community",
      subtitle: "Inclusive by Design",
      description:
        "A diverse and welcoming community where every voice is heard, collaboration is celebrated, and innovation thrives through collective effort.",
      icon: Users,
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

  const teamMembers = [
    {
      name: "Manjeyy Gautam",
      role: "Program Director",
      bio: "Guides the lab's long-term strategy and keeps our partnerships aligned with student impact.",
      focusAreas: ["Partnerships", "Program Design"],
      image:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Rohan Sharma",
      role: "Lead Technologist",
      bio: "Oversees technical residencies and mentors builders on systems architecture and emerging tech.",
      focusAreas: ["AI & ML", "Systems Architecture"],
      image:
        "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Samita Rai",
      role: "Community Catalyst",
      bio: "Designs inclusive programs and ensures every voice in the lab has a platform to thrive.",
      focusAreas: ["Community", "Inclusion"],
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Bikash Adhikari",
      role: "Prototype Mentor",
      bio: "Helps teams move from concept to build with lean experimentation and rapid validation loops.",
      focusAreas: ["Prototyping", "Product Coaching"],
      image:
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Shreya Lama",
      role: "Design Research Lead",
      bio: "Bridges human insights with product decisions so solutions stay grounded in real needs.",
      focusAreas: ["UX Research", "Civic Tech"],
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Prabin Gurung",
      role: "Operations & Lab Steward",
      bio: "Keeps the maker floor running, from hardware inventories to late-night hackathon logistics.",
      focusAreas: ["Lab Operations", "Mentor Networks"],
      image:
        "https://images.unsplash.com/photo-1544723795-3fbec0f5b39b?auto=format&fit=crop&w=400&q=80",
    },
  ];

  return (
    <main className="w-full bg-background text-foreground">
      <section className="relative min-h-[80vh] flex items-center border-b border-foreground/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 w-full">
          <div className="grid gap-20 lg:grid-cols-2 lg:gap-24 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 border border-foreground/20 text-xs uppercase tracking-widest text-foreground/70">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                About Us
              </div>
              
              <div className="space-y-6">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                  SHAPING THE
                  <br />
                  <span className="text-foreground/60">FUTURE</span>
                </h1>
                <p className="text-xl leading-relaxed text-foreground/70 max-w-xl">
                  At Innovation Lab, we transform bold ideas into real-world solutions through technology, creativity, and collaborative innovation.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4">
                <Button size="lg" className="px-8 text-sm uppercase tracking-wider" asChild>
                  <Link href="/events">
                    Join Us
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 text-sm uppercase tracking-wider"
                  asChild
                >
                  <Link href="/#">View Projects</Link>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="border border-foreground/10 p-8 hover:border-foreground/30 transition-colors">
                  <h3 className="text-3xl font-bold mb-2">87%</h3>
                  <p className="text-sm uppercase tracking-wider text-foreground/60">Ideas Shipped</p>
                </div>
                <div className="border border-foreground/10 p-8 hover:border-foreground/30 transition-colors">
                  <h3 className="text-3xl font-bold mb-2">110</h3>
                  <p className="text-sm uppercase tracking-wider text-foreground/60">Mentors</p>
                </div>
              </div>
              <div className="space-y-4 pt-12">
                <div className="border border-foreground/10 p-8 hover:border-foreground/30 transition-colors">
                  <h3 className="text-3xl font-bold mb-2">42</h3>
                  <p className="text-sm uppercase tracking-wider text-foreground/60">Industry Allies</p>
                </div>
                <div className="border border-foreground/10 p-8 hover:border-foreground/30 transition-colors">
                  <h3 className="text-3xl font-bold mb-2">72</h3>
                  <p className="text-sm uppercase tracking-wider text-foreground/60">Global Pilots</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 border-b border-foreground/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="space-y-4 mb-16">
            <p className="text-xs uppercase tracking-widest text-foreground/50">Our Foundation</p>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Mission, Vision & Approach</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {missionPanels.map((panel) => {
              const Icon = panel.icon;
              return (
                <div
                  key={panel.title}
                  className="border border-foreground/10 p-8 hover:border-foreground/30 transition-colors"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 border border-foreground/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-foreground/50">{panel.title}</p>
                      <h3 className="mt-2 text-2xl font-semibold text-foreground/90">{panel.subtitle}</h3>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/70">{panel.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 border-b border-foreground/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-widest text-foreground/50">Our Values</p>
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
                  What Drives Us Forward
                </h2>
              </div>
              <p className="text-lg leading-relaxed text-foreground/70">
                Our core values shape every project, collaboration, and innovation that emerges from the lab. They guide our approach to problem-solving and community building.
              </p>
            </div>
            <div className="grid gap-6">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <div
                    key={value.title}
                    className="border-l-2 border-foreground/20 pl-6 py-2"
                  >
                    <div className="flex items-start gap-4">
                      <Icon className="h-6 w-6 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                        <p className="text-foreground/70 leading-relaxed">{value.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 border-b border-foreground/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr]">
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-widest text-foreground/50">Our Journey</p>
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
                  Evolution of Excellence
                </h2>
              </div>
              <p className="text-lg leading-relaxed text-foreground/70">
                From our founding to today, we&apos;ve grown into a thriving innovation ecosystem that continues to push boundaries and create impact.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-8">
                <div className="border border-foreground/10 p-6">
                  <p className="text-xs uppercase tracking-widest text-foreground/50">Global Pilots</p>
                  <p className="mt-3 text-3xl font-bold">72</p>
                </div>
                <div className="border border-foreground/10 p-6">
                  <p className="text-xs uppercase tracking-widest text-foreground/50">Mentors</p>
                  <p className="mt-3 text-3xl font-bold">110</p>
                </div>
              </div>
            </div>
            <div className="relative pl-8">
              <div className="absolute left-0 top-0 h-full w-px bg-foreground/20" />
              <div className="space-y-12">
                {milestones.map((item) => (
                  <div key={item.year} className="relative pl-6">
                    <span className="absolute left-0 top-2 h-3 w-3 border-2 border-foreground/40 bg-background" />
                    <p className="text-xs uppercase tracking-widest text-foreground/50">{item.year}</p>
                    <h3 className="mt-3 text-xl font-semibold text-foreground/90">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/70">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <p className="text-xs uppercase tracking-widest text-foreground/50">Our Impact</p>
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
                  className="border border-foreground/10 p-8 hover:border-foreground/30 transition-colors text-center"
                >
                  <Icon className="h-6 w-6 mx-auto mb-4" />
                  <span className="block text-3xl font-bold mb-2">{stat.value}</span>
                  <span className="text-xs uppercase tracking-widest text-foreground/60">
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-foreground/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <p className="text-xs uppercase tracking-widest text-foreground/50">Our Team</p>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Meet the people powering the lab
            </h2>
            <p className="text-sm max-w-3xl mx-auto leading-relaxed text-foreground/70">
              A multidisciplinary crew of mentors, makers, and strategists keeps Innovation Lab humming—from vision and research to day-to-day student support.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="border border-foreground/10 bg-background/70 p-6 hover:border-foreground/30 transition-colors flex flex-col gap-6"
              >
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-full border border-foreground/20 bg-muted/40 flex-shrink-0">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-lg font-semibold text-foreground/60">
                        {member.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground/90">{member.name}</h3>
                    <p className="text-xs uppercase tracking-widest text-foreground/50">
                      {member.role}
                    </p>
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-foreground/70">{member.bio}</p>

                <div className="flex flex-wrap gap-2">
                  {member.focusAreas.map((area) => (
                    <span
                      key={`${member.name}-${area}`}
                      className="inline-flex items-center gap-2 border border-foreground/20 bg-foreground/5 px-3 py-1 text-xs uppercase tracking-wider text-foreground/60"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
