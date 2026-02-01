"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "../ui/mode-toggle";
import { CommandMenu } from "../ui/command-menu";
import { FeedbackDialog } from "../feedback/feedback-dialog";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "News", href: "/news" },
  { label: "Events", href: "/events" },
  { label: "Communities", href: "/communities" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "border-border/40 bg-background/80 backdrop-blur-xl shadow-sm"
          : "border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">

        {/* Left: Logo */}
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-2.5 transition-transform hover:scale-[1.02]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/20">
              <span className="text-sm font-bold tracking-tighter">IL</span>
            </div>
            <span className="hidden font-bold tracking-tight text-foreground sm:inline-block">
              Innovation Lab
            </span>
          </Link>
        </div>

        {/* Center: Navigation & Search - integrated better */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-6 px-8">
          {/* Navigation Pills */}
          <nav className="flex items-center rounded-full border border-border/50 bg-background/50 p-1 shadow-sm backdrop-blur-md">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={cn(
                        "relative block rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300",
                        isActive
                          ? "text-primary bg-primary/10 font-semibold"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex shrink-0 items-center gap-3">
          {/* Search Trigger (Icon on small screens, full on large) */}
          <div className="w-auto">
            <CommandMenu />
          </div>

          <div className="hidden md:flex items-center gap-2">
            <FeedbackDialog />
          </div>

          <ModeToggle />

          <Button className="hidden h-9 rounded-full bg-indigo-600 px-5 text-sm font-semibold text-white shadow-md transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/20 md:inline-flex">
            Get Started
          </Button>

          {/* Mobile Menu Trigger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle navigation</span>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute left-0 top-full w-full border-b border-border/10 bg-background/95 p-6 shadow-2xl backdrop-blur-3xl md:hidden animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center rounded-lg px-4 py-3 text-base font-medium text-foreground/80 hover:bg-secondary/50 hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-3 border-t border-border/50 pt-4">
              <div className="flex items-center justify-between px-2">
                <span className="text-sm text-muted-foreground">Have a suggestion?</span>
                <FeedbackDialog />
              </div>
              <Button className="w-full rounded-xl bg-indigo-600 text-white" size="lg">
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
