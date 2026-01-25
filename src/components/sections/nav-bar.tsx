"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "../ui/mode-toggle";
import { useState } from "react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "News", href: "/news" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-foreground/10 bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-foreground"
        >
          <span className="flex h-10 w-10 items-center justify-center border border-foreground/20 text-xs font-bold">
            IL
          </span>
          INNOVATION LAB
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="px-5 py-2 text-sm uppercase tracking-wider text-foreground/70 transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <ModeToggle />
          <Button className="hidden px-6 text-xs uppercase tracking-wider md:inline-flex">
            Get Started
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="border border-foreground/10 md:hidden"
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
        <div className="border-t border-foreground/10 bg-background md:hidden">
          <nav className="mx-auto max-w-7xl px-6 py-6 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block px-4 py-3 text-sm uppercase tracking-wider text-foreground/70 hover:text-foreground border-l-2 border-transparent hover:border-foreground/30 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4">
              <Button className="w-full text-xs uppercase tracking-wider">
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
