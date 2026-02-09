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
  Mail,
  Linkedin,
  Github,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { getActiveTeamMembers } from "@/lib/data/team";
import { getMilestones } from "@/lib/data/milestones";
import aboutImage from "@/assets/about.jpg";

function toTitleCase(str: string) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const dynamic = "force-dynamic";
export const revalidate = 60;

// ---------------------------------------------------------------------------
// Static content
// ---------------------------------------------------------------------------

const HERO_TITLE = "SHAPING THE FUTURE";
const HERO_DESCRIPTION =
  "At Innovation Lab, we transform bold ideas into real-world solutions through technology, creativity, and collaborative innovation.";

const MISSION_PANELS = [
  {
    title: "Mission",
    subtitle: "Empower Innovators",
    description:
      "We provide students with the resources, mentorship, and collaborative environment needed to transform bold ideas into impactful solutions.",
    icon: Target,
    color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  },
  {
    title: "Vision",
    subtitle: "Lead Innovation",
    description:
      "To become a leading innovation hub that bridges academia and industry, fostering a culture of creativity, experimentation, and technological advancement.",
    icon: Lightbulb,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    title: "Approach",
    subtitle: "Learning by Building",
    description:
      "Hands-on project-based learning combined with industry mentorship, enabling students to gain practical experience while developing innovative solutions.",
    icon: Layers,
    color: "bg-green-500/10 text-green-600 dark:text-green-400",
  },
  {
    title: "Community",
    subtitle: "Inclusive by Design",
    description:
      "A diverse and welcoming community where every voice is heard, collaboration is celebrated, and innovation thrives through collective effort.",
    icon: Users,
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
];

interface TeamMember {
  id: number;
  name: string;
  position: string;
  bio: string | null;
  photoUrl: string | null;
  email: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  websiteUrl: string | null;
  category: "head" | "core" | "mentor";
}

const categoryLabels: Record<TeamMember["category"], string> = {
  head: "Innovation Lab Head",
  core: "Core Member",
  mentor: "Mentor"
};

export default async function AboutPage() {
  let teamMembers: TeamMember[] = [];
  try {
    teamMembers = await getActiveTeamMembers() as TeamMember[];
  } catch {
    teamMembers = [];
  }

  const milestones = await getMilestones();

  const values = [
    { title: "Impactful Innovation", description: "We do not innovate for the sake of novelty; we innovate to create value.", icon: Heart, color: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
    { title: "Honesty", description: "We are committed to truthfulness in all our communications and actions.", icon: Users, color: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
    { title: "Inclusivity & Respect", description: "We value diverse perspectives and treat every individual with dignity.", icon: Zap, color: "bg-sky-500/10 text-sky-600 dark:text-sky-400" },
    { title: "Integrity & Accountability", description: "We hold ourselves to the highest ethical standards and take ownership of our results.", icon: Globe, color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
    { title: "Excellence in Execution", description: "We accept nothing less than high-quality work in everything we deliver.", icon: Rocket, color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
    { title: "Collaborative Growth", description: "We believe that diverse teams working together achieve more than individuals working alone.", icon: Trophy, color: "bg-pink-500/10 text-pink-600 dark:text-pink-400" },
    { title: "Learner-Centered", description: "We view education as a lifelong pursuit that drives our evolution.", icon: Heart, color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" },
    { title: "Global Mindset, Local Roots", description: "We apply international standards while solving problems relevant to our community.", icon: Users, color: "bg-teal-500/10 text-teal-600 dark:text-teal-400" },
  ];



  return (
    <main className="w-full bg-background text-foreground">
      {/* Animated Hero Section */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-background z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-70"></div>
          <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-secondary/30 dark:bg-secondary/10 rounded-full blur-3xl animate-blob opacity-60"></div>
          <div className="absolute bottom-[-10%] left-[10%] w-[500px] h-[500px] bg-primary/20 dark:bg-primary/10 rounded-full blur-3xl animate-blob animation-delay-4000 opacity-60"></div>
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
                  {HERO_TITLE.split(" ").slice(0, -1).join(" ")}
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{HERO_TITLE.split(" ").slice(-1)[0]}</span>
                </h1>
                <p className="text-xl leading-relaxed text-foreground/80 max-w-xl">
                  {HERO_DESCRIPTION}
                </p>
              </div>


            </div>

            <div className="relative hidden lg:flex items-center justify-center">
              <div className="relative w-full max-w-lg">
                <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 rounded-3xl blur-2xl"></div>
                <div className="relative w-full aspect-[4/3] rounded-3xl border border-border/50 overflow-hidden shadow-2xl">
                  <Image
                    src={aboutImage}
                    alt="Innovation Lab"
                    fill
                    sizes="(max-width: 1024px) 0vw, 512px"
                    quality={100}
                    unoptimized
                    priority
                    placeholder="blur"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-muted/30 dark:bg-muted/10 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="space-y-4 mb-16 text-center max-w-2xl mx-auto">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase">
              Our Foundation
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Mission, Vision & Approach</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {MISSION_PANELS.map((panel) => {
              const Icon = panel.icon;
              return (
                <div
                  key={panel.title}
                  className="group relative bg-card/60 dark:bg-card/40 backdrop-blur-md p-8 rounded-3xl border border-border/50 dark:border-border/30 shadow-sm hover:shadow-xl hover:shadow-primary/5 dark:hover:shadow-primary/10 transition-all duration-300 hover:translate-y-[-4px] overflow-hidden"
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
          {/* Section header */}
          <div className="text-center space-y-4 mb-16 max-w-2xl mx-auto">
            <span className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent-foreground text-xs font-semibold tracking-wide uppercase">
              Our Values
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
              What Drives Us Forward
            </h2>
            <p className="text-lg leading-relaxed text-foreground/70">
              Our core values shape every project, collaboration, and innovation that emerges from the lab.
            </p>
          </div>

          {/* Values grid — full width */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="group p-6 rounded-2xl border border-border/50 bg-card/40 dark:bg-card/30 hover:bg-card hover:border-primary/20 hover:shadow-lg transition-all duration-300"
                >
                  <div className={`w-11 h-11 rounded-xl ${value.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold mb-2 group-hover:text-primary transition-colors leading-snug">{value.title}</h3>
                  <p className="text-sm text-foreground/60 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 border-y border-border/50 bg-muted/20 dark:bg-muted/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl opacity-50 -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-3xl opacity-50 -z-10"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center space-y-4 mb-20">
            <span className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold tracking-wide uppercase">
              Our Journey
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Evolution of Excellence
            </h2>
            <p className="text-lg max-w-2xl mx-auto leading-relaxed text-foreground/70">
              From our founding to today, we&apos;ve grown into a thriving innovation ecosystem that continues to push boundaries and create impact.
            </p>
          </div>

          {/* Alternating timeline */}
          <div className="relative">
            {/* Center line with gradient */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-border to-primary/40 md:-translate-x-px" />

            <div className="space-y-16 md:space-y-20">
              {milestones.map((item, index) => {
                const isLeft = index % 2 === 0;
                const colors = [
                  "from-primary/10 to-primary/5 border-primary/20 hover:border-primary/40",
                  "from-blue-500/10 to-blue-500/5 border-blue-500/20 hover:border-blue-500/40",
                  "from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40",
                  "from-violet-500/10 to-violet-500/5 border-violet-500/20 hover:border-violet-500/40",
                  "from-orange-500/10 to-orange-500/5 border-orange-500/20 hover:border-orange-500/40",
                ];
                const colorClass = colors[index % colors.length];

                return (
                  <div key={`${item.year}-${index}`} className="relative group md:flex md:items-center">
                    {/* Dot on the line */}
                    <div className="absolute left-6 md:left-1/2 top-8 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 z-10">
                      <span className="block h-4 w-4 rounded-full border-[3px] border-primary bg-background group-hover:bg-primary group-hover:scale-125 transition-all duration-300 shadow-[0_0_0_4px_hsl(var(--background)),0_0_12px_hsl(var(--primary)/0.3)]" />
                    </div>

                    {/* Connector line from dot to card */}
                    <div className={`hidden md:block absolute top-1/2 w-8 h-px bg-border/60 ${isLeft ? 'right-1/2 mr-2' : 'left-1/2 ml-2'}`} />

                    {/* Content card */}
                    <div className={`md:w-1/2 ${isLeft ? 'md:pr-16' : 'md:order-2 md:pl-16'} pl-14 md:pl-0`}>
                      <div className={`relative bg-gradient-to-br ${colorClass} p-8 rounded-3xl border shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:translate-y-[-2px] transition-all duration-300 overflow-hidden`}>
                        {/* Decorative corner glow */}
                        <div className={`absolute ${isLeft ? 'top-0 right-0' : 'top-0 left-0'} w-24 h-24 bg-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                        <div className="relative z-10">
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary mb-3">{item.year}</span>
                          <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                          <p className="text-sm leading-relaxed text-foreground/70">{item.description}</p>
                        </div>
                      </div>
                    </div>

                    {/* Spacer for the other side */}
                    <div className={`hidden md:block md:w-1/2 ${isLeft ? 'md:order-2' : ''}`} />
                  </div>
                );
              })}
            </div>
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
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {member.position.split("|").map((role: string, i: number) => (
                          <span
                            key={i}
                            className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full bg-primary/10 text-primary"
                          >
                            {toTitleCase(role.trim())}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-8 pt-6 space-y-6">
                    {member.bio && (
                      <p className="text-sm leading-relaxed text-foreground/70">{member.bio}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 border border-border bg-muted/50 px-3 py-1 text-xs font-medium rounded-full text-foreground/70">
                        {categoryLabels[member.category]}
                      </span>
                      <div className="flex items-center gap-2">
                        {member.email && (
                          <a href={`mailto:${member.email}`} className="text-muted-foreground hover:text-primary transition-colors" aria-label={`Email ${member.name}`}>
                            <Mail className="h-4 w-4" />
                          </a>
                        )}
                        {member.linkedinUrl && (
                          <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label={`${member.name} LinkedIn`}>
                            <Linkedin className="h-4 w-4" />
                          </a>
                        )}
                        {member.githubUrl && (
                          <a href={member.githubUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label={`${member.name} GitHub`}>
                            <Github className="h-4 w-4" />
                          </a>
                        )}
                        {member.websiteUrl && (
                          <a href={member.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label={`${member.name} website`}>
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
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
