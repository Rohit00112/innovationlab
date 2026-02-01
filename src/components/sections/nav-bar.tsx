"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "../ui/mode-toggle";
import { CommandMenu } from "../ui/command-menu";
import { FeedbackDialog } from "../feedback/feedback-dialog";
import { useState } from "react";

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

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 text-sm font-bold tracking-wide text-foreground group"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-600 text-white shadow-md group-hover:shadow-primary/20 transition-all duration-300">
            IL
          </span>
          <span className="group-hover:text-primary transition-colors">INNOVATION LAB</span>
        </Link>
        <div className="flex-1 px-8 hidden lg:block">
          <CommandMenu />
        </div>

        <nav className="hidden items-center gap-2 md:flex p-1 rounded-full bg-secondary/50 border border-border/50 backdrop-blur-sm">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="px-5 py-2 text-sm font-medium rounded-full text-foreground/70 transition-all hover:text-foreground hover:bg-background hover:shadow-sm"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <FeedbackDialog />
          <ModeToggle />
          <Button className="hidden h-10 px-6 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all md:inline-flex">
            Get Started
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full md:hidden"
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
        <div className="border-t border-border/50 bg-background/95 backdrop-blur-xl md:hidden absolute w-full left-0 shadow-xl">
          <nav className="mx-auto max-w-7xl px-6 py-6 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block px-4 py-3 text-sm font-medium rounded-xl text-foreground/70 hover:text-foreground hover:bg-secondary/50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4">
              <Button className="w-full rounded-xl h-12 text-sm font-bold uppercase tracking-wider">
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
