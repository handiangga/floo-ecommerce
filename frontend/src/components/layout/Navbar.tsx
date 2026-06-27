"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, Menu, Search, ShoppingBag, User } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const menus = [
  {
    name: "New Arrival",
    href: "/new-arrival",
  },
  {
    name: "Kebaya",
    href: "/kebaya",
  },
  {
    name: "Couple",
    href: "/couple",
  },
  {
    name: "Big Size",
    href: "/big-size",
  },
  {
    name: "Sale",
    href: "/sale",
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-background/95 shadow-sm backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Mobile Menu */}
        <div className="flex items-center lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button className="rounded-full p-2 hover:bg-muted">
                <Menu className="size-6" />
              </button>
            </SheetTrigger>

            <SheetContent side="left" className="w-[280px]">
              <div className="mt-10 flex flex-col gap-6">
                {menus.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-lg font-medium transition hover:text-primary"
                  >
                    {item.name}
                  </Link>
                ))}

                <hr />

                <Link href="/wishlist">Wishlist</Link>

                <Link href="/account">My Account</Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <Link href="/" className="font-luxury text-3xl font-semibold">
          FLOO
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden items-center gap-8 lg:flex">
          {menus.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium transition hover:text-primary"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-1 md:gap-3">
          <button className="rounded-full p-2 transition hover:bg-muted">
            <Search className="size-5" />
          </button>

          <Link
            href="/wishlist"
            className="rounded-full p-2 transition hover:bg-muted"
          >
            <Heart className="size-5" />
          </Link>

          <Link
            href="/cart"
            className="relative rounded-full p-2 transition hover:bg-muted"
          >
            <ShoppingBag className="size-5" />

            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
              0
            </span>
          </Link>

          <Link
            href="/account"
            className="hidden rounded-full p-2 transition hover:bg-muted md:flex"
          >
            <User className="size-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
