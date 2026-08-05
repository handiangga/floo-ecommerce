"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BadgePercent, BarChart3, FolderTree, LayoutDashboard, LogOut, Menu,
  Package, ReceiptText, Star, Tag, Users, X,
} from "lucide-react";

import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const links = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ReceiptText },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Banners", href: "/admin/banners", icon: Tag },
  { label: "Vouchers", href: "/admin/vouchers", icon: BadgePercent },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("admin_access_token");
    router.replace("/admin/login");
  };

  const navigation = (mobile = false) => (
    <nav className="space-y-1">
      {links.map(({ label, href, icon: Icon, exact }) => {
        const active = isActive(pathname, href, exact);
        const item = <Link href={href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${active ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}><Icon className="size-[18px]" strokeWidth={1.7} /><span>{label}</span></Link>;
        return mobile ? <SheetClose asChild key={href}>{item}</SheetClose> : <div key={href}>{item}</div>;
      })}
    </nav>
  );

  return (
    <>
      <aside className="hidden min-h-screen w-64 shrink-0 border-r border-border bg-white px-4 py-6 lg:flex lg:flex-col">
        <Link href="/admin" className="px-3">
          <p className="font-luxury text-[28px] leading-none tracking-[0.12em] text-foreground">FLOO</p>
          <p className="mt-1 text-[9px] tracking-[0.27em] text-muted-foreground">FASHION · ADMIN</p>
        </Link>
        <div className="mt-9">{navigation()}</div>
        <div className="mt-auto border-t border-border pt-4">
          <Link href="/" className="block px-3 py-2 text-xs text-muted-foreground transition hover:text-primary">← Lihat toko</Link>
          <button type="button" onClick={logout} className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"><LogOut className="size-[18px]" strokeWidth={1.7} /> Keluar</button>
        </div>
      </aside>

      <div className="fixed left-4 top-4 z-[60] lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <button type="button" aria-label="Buka menu admin" className="rounded-full border border-border bg-white p-3 shadow-sm"><Menu className="size-5" /></button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[290px] bg-white p-5">
            <div className="flex items-start justify-between">
              <Link href="/admin"><p className="font-luxury text-3xl tracking-[0.12em]">FLOO</p><p className="mt-1 text-[9px] tracking-[0.24em] text-muted-foreground">FASHION · ADMIN</p></Link>
              <SheetClose asChild><button type="button" aria-label="Tutup menu admin" className="rounded-full p-2 hover:bg-muted"><X className="size-5" /></button></SheetClose>
            </div>
            <div className="mt-8">{navigation(true)}</div>
            <div className="mt-8 border-t border-border pt-4">
              <SheetClose asChild><Link href="/" className="block px-3 py-2 text-sm text-muted-foreground">← Lihat toko</Link></SheetClose>
              <button type="button" onClick={logout} className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><LogOut className="size-[18px]" /> Keluar</button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
