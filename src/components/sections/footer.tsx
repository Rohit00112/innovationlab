import Link from "next/link";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";

interface FooterMenuItem {
  title: string;
  links: { text: string; url: string }[];
}

const FOOTER_DESCRIPTION =
  "Innovation Labs is a collaborative space for students to explore, create, and innovate at Itahari International College.";

const FOOTER_COPYRIGHT = "© 2024 Innovation Labs. All rights reserved.";

const SOCIAL_LINKS = [
  { platform: "Facebook", url: "https://facebook.com/innovationlabs" },
  { platform: "Twitter", url: "https://twitter.com/innovationlabs" },
  { platform: "LinkedIn", url: "https://linkedin.com/company/innovationlabs" },
  { platform: "GitHub", url: "https://github.com/innovationlabs" },
];

const MENU_ITEMS: FooterMenuItem[] = [
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

const BOTTOM_LINKS = [
  { text: "Privacy Policy", url: "#" },
  { text: "Terms of Service", url: "#" },
  { text: "Cookie Policy", url: "#" },
];

export function Footer() {
  return (
    <footer className="relative bg-background dark:bg-card/30 pt-20 pb-10 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50 dark:opacity-40"></div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="grid gap-16 lg:grid-cols-[1.5fr_1fr_1fr_1fr] mb-16">
          <div className="space-y-6">
            <Link
              href="/"
              className="flex items-center gap-3 text-sm font-bold tracking-wide text-foreground group w-fit"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-600 text-white shadow-md group-hover:shadow-primary/20 transition-all duration-300">
                IL
              </span>
              <span className="group-hover:text-primary transition-colors">INNOVATION LAB</span>
            </Link>
            <p className="text-sm leading-relaxed text-foreground/60 max-w-sm">
              {FOOTER_DESCRIPTION}
            </p>

            <div className="flex items-center gap-3 pt-2">
              {SOCIAL_LINKS.map((social, index) => {
                const Icon = social.platform.toLowerCase().includes("linkedin") ? Linkedin :
                  social.platform.toLowerCase().includes("twitter") ? Twitter :
                    social.platform.toLowerCase().includes("github") ? Github : Mail;

                return (
                  <a
                    key={index}
                    href={social.url}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/50 dark:bg-secondary/30 border border-border/50 dark:border-border/30 hover:border-primary/50 hover:bg-primary/10 hover:text-primary transition-all duration-300"
                    aria-label={social.platform}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {MENU_ITEMS.map((section) => (
            <div key={section.title} className="space-y-6">
              <h3 className="text-sm font-bold tracking-wide text-foreground">
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.text}>
                    <Link
                      href={link.url}
                      className="text-sm text-foreground/60 transition-colors hover:text-primary hover:pl-1"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border/50 pt-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-foreground/50">{FOOTER_COPYRIGHT}</p>
          <div className="flex flex-wrap gap-8">
            {BOTTOM_LINKS.map((link) => (
              <Link
                key={link.text}
                href={link.url}
                className="text-xs text-foreground/50 hover:text-foreground transition-colors"
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
