"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Recycle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const publicNavLinks = [
  { href: "/", label: "Home" },
  { href: "/supplies", label: "What We Buy" },
  { href: "/get-offer", label: "Get Offer" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Check if on admin routes - don't show public nav on admin pages
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
              <Recycle className="h-4 w-4" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              Diab<span className="text-primary">Buy</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {publicNavLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={pathname === link.href ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "text-sm font-medium transition-colors",
                    pathname === link.href && "bg-primary/10 text-primary"
                  )}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
            <ThemeToggle />
          </nav>

          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-border/50"
          >
            <div className="container mx-auto px-4 py-3 space-y-1">
              {publicNavLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>
                  <Button
                    variant={pathname === link.href ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start text-sm font-medium",
                      pathname === link.href && "bg-primary/10 text-primary"
                    )}
                  >
                    {link.label}
                  </Button>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
