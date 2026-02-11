import Link from "next/link";
import { Mail } from "lucide-react";

interface FooterMenuItem {
  title: string;
  links: { text: string; url: string }[];
}

const FOOTER_DESCRIPTION =
  "Innovation Lab is a collaborative space for students to explore, create, and innovate at Itahari International College.";

const FOOTER_COPYRIGHT = `© ${new Date().getFullYear()} Innovation Lab, Itahari International College. All rights reserved.`;

const MENU_ITEMS: FooterMenuItem[] = [
  {
    title: "Explore",
    links: [
      { text: "About", url: "/about" },
      { text: "Events", url: "/events" },
      { text: "Communities", url: "/communities" },
      { text: "Team", url: "/team" },
    ],
  },
  {
    title: "Support",
    links: [
      { text: "FAQs", url: "/faqs" },
      { text: "Contact Us", url: "/contact" },
      { text: "Testimonials", url: "/testimonials" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative bg-background dark:bg-card/30 pt-20 pb-10 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50 dark:opacity-40"></div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="grid gap-16 lg:grid-cols-[1.5fr_1fr_1fr] mb-16">
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

            <a
              href="mailto:innovationlab@iic.edu.np"
              className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-primary transition-colors"
            >
              <Mail className="h-4 w-4" />
              innovation.lab@iic.edu.np
            </a>
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

        <div className="border-t border-border/50 pt-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-center">
          <p className="text-xs text-foreground/50">{FOOTER_COPYRIGHT}</p>
        </div>
      </div>
    </footer>
  );
}
