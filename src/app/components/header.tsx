"use client";

import { Menu, Globe } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export default function Header() {
  const { t, i18n } = useTranslation('common');
  const pathname = usePathname();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const navLinks = [
    { href: "/", label: t('nav.home') },
    { href: "/fast-order", label: t('nav.fastOrder') },
    { href: "/cakes", label: t('nav.gallery') },
    { href: "/weddings", label: t('nav.weddings') },
    { href: "/corporate", label: t('nav.corporate') },
    { href: "/printing", label: t('nav.print') },
    { href: "/contact", label: t('nav.contact') },
  ];

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      onClick={() => setMobileMenuOpen(false)}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary",
        pathname === href ? "text-primary" : "text-muted-foreground"
      )}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
           <div className="relative h-10 w-10 overflow-hidden rounded-full">
            <Image 
              src="https://firebasestorage.googleapis.com/v0/b/cake-canvas-hr6n0.firebasestorage.app/o/assets%2Flogo.png?alt=media"
              alt="Cake Master logo"
              fill
              className="object-cover"
            />
          </div>
          <span className="text-lg font-headline font-bold">Cake Master</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5" />
                <span className="sr-only">Change language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => changeLanguage('en')}>English</DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('cs')}>Čeština</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
        <div className="md:hidden flex items-center">
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5" />
                <span className="sr-only">Change language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => changeLanguage('en')}>English</DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('cs')}>Čeština</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="p-4">
                <Link href="/" className="flex items-center gap-2 mb-8" onClick={() => setMobileMenuOpen(false)}>
                  <div className="relative h-10 w-10 overflow-hidden rounded-full">
                    <Image 
                      src="https://firebasestorage.googleapis.com/v0/b/cake-canvas-hr6n0.firebasestorage.app/o/assets%2Flogo.png?alt=media"
                      alt="Cake Master logo"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-lg font-headline font-bold">Cake Master</span>
                </Link>
                <nav className="flex flex-col gap-6">
                  {navLinks.map((link) => (
                    <NavLink key={link.href} {...link} />
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}