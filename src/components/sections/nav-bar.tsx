"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "../ui/mode-toggle";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

// ---------------------------------------------------------------------------
// Static navigation content
// ---------------------------------------------------------------------------
const NAV_ITEMS = [
  { id: "home", label: "Home", href: "/" },
  { id: "about", label: "About", href: "/about" },
  { id: "events", label: "Events", href: "/events" },
  { id: "communities", label: "Communities", href: "/communities" },
  { id: "contact", label: "Contact", href: "/contact" },
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
          ? "border-border/40 bg-background/80 backdrop-blur-xl shadow-sm dark:bg-background/90 dark:border-border/30"
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
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/30">
              <span className="text-sm font-bold tracking-tighter">IL</span>
            </div>
            <span className="hidden font-bold tracking-tight text-foreground sm:inline-block">
              Innovation Lab
            </span>
          </Link>
        </div>

        {/* Center: Navigation */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-6 px-8">
          <nav className="flex items-center rounded-full border border-border/50 dark:border-border/30 bg-background/50 dark:bg-card/40 p-1 shadow-sm dark:shadow-md backdrop-blur-md dark:backdrop-blur-xl">
            <ul className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.id}>
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
          <ModeToggle />

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
        <div className="absolute left-0 top-full w-full border-b border-border/10 dark:border-border/20 bg-background/95 dark:bg-card/95 p-6 shadow-2xl backdrop-blur-3xl md:hidden animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-center rounded-lg px-4 py-3 text-base font-medium text-foreground/80 hover:bg-secondary/50 hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
