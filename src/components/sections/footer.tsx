import Link from "next/link";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";

interface FooterMenuItem {
  title: string;
  links: { text: string; url: string }[];
}

interface FooterProps {
  tagline?: string;
  menuItems?: FooterMenuItem[];
  bottomLinks?: { text: string; url: string }[];
  copyright?: string;
}

const menuDefaults: FooterMenuItem[] = [
  {
    title: "About",
    links: [
      { text: "Our Story", url: "/about" },
      { text: "Team", url: "/about#team" },
      { text: "Partners", url: "/about#partners" },
      { text: "Careers", url: "/about#careers" },
    ],
  },
  {
    title: "Resources",
    links: [
      { text: "News & Updates", url: "/news" },
      { text: "Events", url: "/events" },
      { text: "Documentation", url: "#" },
      { text: "Blog", url: "#" },
    ],
  },
  {
    title: "Connect",
    links: [
  { text: "Contact Us", url: "/contact" },
      { text: "Join Community", url: "#" },
      { text: "Support", url: "#" },
      { text: "FAQs", url: "#" },
    ],
  },
];

const bottomDefaults = [
  { text: "Privacy Policy", url: "#" },
  { text: "Terms of Service", url: "#" },
  { text: "Cookie Policy", url: "#" },
];

export function Footer({
  tagline = "Empowering Innovation",
  menuItems = menuDefaults,
  bottomLinks = bottomDefaults,
  copyright = "© 2025 Innovation Lab, Itahari International College. All rights reserved.",
}: FooterProps) {
  return (
    <footer className="border-t border-foreground/10 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link
              href="/"
              className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-foreground"
            >
              <span className="flex h-12 w-12 items-center justify-center border border-foreground/20 text-xs font-bold">
                IL
              </span>
              INNOVATION LAB
            </Link>
            <p className="text-sm leading-relaxed text-foreground/70 max-w-sm">
              Transforming bold ideas into real-world solutions through technology, creativity, and collaborative innovation at Itahari International College.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3 pt-4">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center border border-foreground/20 hover:border-foreground/40 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center border border-foreground/20 hover:border-foreground/40 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center border border-foreground/20 hover:border-foreground/40 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="mailto:hello@innovationlab.com"
                className="flex h-10 w-10 items-center justify-center border border-foreground/20 hover:border-foreground/40 transition-colors"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Menu Sections */}
          {menuItems.map((section) => (
            <div key={section.title} className="space-y-5">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground/90">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.text}>
                    <Link
                      href={link.url}
                      className="text-sm text-foreground/70 transition-colors hover:text-foreground"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-foreground/10 py-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-foreground/60">{copyright}</p>
          <div className="flex flex-wrap gap-6">
            {bottomLinks.map((link) => (
              <Link
                key={link.text}
                href={link.url}
                className="text-xs text-foreground/60 hover:text-foreground transition-colors"
              >
                {link.text}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
