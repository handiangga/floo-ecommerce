"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";

import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const menus = [
  { name: "New Arrival", href: "/new-arrival" },
  { name: "Kebaya", href: "/kebaya" },
  { name: "Couple", href: "/couple" },
  { name: "Big Size", href: "/big-size" },
  { name: "Sale", href: "/sale" },
  { name: "About Us", href: "#floo-story" },
];

const iconLinks = [
  { href: "/products", label: "Search products", icon: Search },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/cart", label: "Shopping bag", icon: ShoppingBag },
  { href: "/account", label: "My account", icon: User },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#e9e2d8] bg-[#fdfbf8]/95 text-[#29231f] backdrop-blur-md">
      <div className="flex h-[18px] items-center justify-center bg-[#2d241f] px-4 text-[8px] uppercase tracking-[0.17em] text-[#f5dfbf]">Gratis Ongkir untuk Pembelian Minimal Rp499.000</div>
      <div className="mx-auto grid h-[66px] max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center px-5 sm:px-8 lg:px-12">
        <div className="flex items-center justify-start">
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button type="button" aria-label="Open menu" className="rounded-full p-2.5 transition hover:bg-[#f2ece5]">
                  <Menu className="size-5" strokeWidth={1.6} />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[310px] border-r-[#e9e2d8] bg-[#fdfbf8] p-0">
                <div className="flex h-full flex-col px-7 py-8">
                  <div className="flex items-start justify-between border-b border-[#e9e2d8] pb-6">
                    <Link href="/" className="font-luxury text-[30px] leading-none tracking-[0.12em]">
                      FLOO
                      <span className="mt-1.5 block text-center text-[8px] tracking-[0.36em]">FASHION</span>
                    </Link>
                    <SheetClose asChild>
                      <button type="button" aria-label="Close menu" className="rounded-full p-2 hover:bg-[#f2ece5]">
                        <X className="size-5" strokeWidth={1.5} />
                      </button>
                    </SheetClose>
                  </div>
                  <nav className="mt-8 flex flex-col">
                    {menus.map((item) => (
                      <SheetClose asChild key={item.name}>
                        <Link href={item.href} className="border-b border-[#eee8e1] py-4 text-[15px] tracking-wide transition hover:text-[#a26c36]">
                          {item.name}
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>
                  <div className="mt-auto grid grid-cols-2 gap-3 border-t border-[#e9e2d8] pt-6 text-[14px]">
                    <SheetClose asChild><Link href="/wishlist">Wishlist</Link></SheetClose>
                    <SheetClose asChild><Link href="/account">My Account</Link></SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Link href="/" aria-label="Floo Fashion home" className="hidden font-luxury text-[31px] leading-none tracking-[0.12em] lg:block">
            FLOO
            <span className="mt-1.5 block text-center text-[8px] tracking-[0.36em]">FASHION</span>
          </Link>
        </div>

        <Link href="/" aria-label="Floo Fashion home" className="font-luxury text-[27px] leading-none tracking-[0.12em] lg:hidden">
          FLOO
          <span className="mt-1.5 block text-center text-[8px] tracking-[0.36em]">FASHION</span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center justify-center gap-7 lg:flex xl:gap-9">
          {menus.map((item) => {
            const active = pathname === item.href && item.href !== "/products";
            return (
              <Link key={item.name} href={item.href} className={`relative py-2 text-[13px] tracking-wide transition-colors hover:text-[#a26c36] ${active ? "text-[#a26c36]" : ""}`}>
                {item.name}
                <span className={`absolute inset-x-0 -bottom-0.5 mx-auto h-px bg-[#a26c36] transition-all duration-300 ${active ? "w-5" : "w-0 group-hover:w-5"}`} />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center justify-end gap-0.5 sm:gap-1">
          {iconLinks.map(({ href, label, icon: Icon }, index) => (
            <Link key={label} href={href} aria-label={label} className={`rounded-full p-2.5 transition hover:bg-[#f2ece5] ${index === 3 ? "hidden sm:inline-flex" : "inline-flex"}`}>
              <Icon className="size-[19px]" strokeWidth={1.45} />
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
