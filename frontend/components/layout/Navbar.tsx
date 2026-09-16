"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface NavbarProps {
  branding?: {
    secondaryLight: string;
    secondaryDark: string;
  };
}

export default function Navbar({ branding }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Solutions", href: "#solutions" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Why DKSI", href: "#why" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 inset-x-0 z-50 h-[72px] transition-all duration-300",
        scrolled
          ? "bg-white/92 dark:bg-gray-950/92 backdrop-blur-lg shadow-md"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="#" className="flex-shrink-0">
          <div className="relative w-40 h-10">
            <Image
              src={branding?.secondaryLight || "/logo/secondary-light.png"}
              alt="DKSI Logo"
              fill
              className="object-contain hidden dark:block"
            />
            <Image
              src={branding?.secondaryDark || "/logo/secondary-dark.png"}
              alt="DKSI Logo"
              fill
              className="object-contain block dark:hidden"
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden flex flex-col gap-1.5 p-2"
        >
          <div className="w-6 h-0.5 bg-gray-700 dark:bg-gray-300" />
          <div className="w-6 h-0.5 bg-gray-700 dark:bg-gray-300" />
          <div className="w-6 h-0.5 bg-gray-700 dark:bg-gray-300" />
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="lg:hidden absolute top-[72px] left-0 right-0 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
          <div className="container mx-auto px-6 py-6 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
