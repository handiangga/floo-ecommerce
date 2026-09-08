"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Box,
  ChevronDown,
  CircleDollarSign,
  ImagePlus,
  PackagePlus,
  ReceiptText,
  Search,
  Settings,
  TicketPercent,
  TrendingUp,
  UserRound,
  UsersRound,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { AdminService } from "@/services/admin.service";
import { AdminSession } from "@/lib/session";

type Overview = {
  revenue_month?: number;
  total_orders?: number;
  total_products?: number;
  total_customers?: number;
  processing_orders?: number;
  completed_orders?: number;
  cancelled_orders?: number;
  pending_orders?: number;
};
type Product = {
  id: number;
  name: string;
  sold_count?: number;
  variants?: { price?: number }[];
};
type Order = {
  id: number;
  invoice: string;
  status: string;
  total: number;
  customer?: { name?: string };
};

const formatPrice = (value: number) =>
  "Rp" + Number(value || 0).toLocaleString("id-ID");
const statusLabel: Record<string, string> = {
  COMPLETED: "Selesai",
  PROCESSING: "Processing",
  SHIPPED: "Dikirim",
  PAID: "Dibayar",
  WAITING_PAYMENT: "Menunggu bayar",
  CANCELLED: "Dibatalkan",
  EXPIRED: "Kadaluarsa",
};
const statusClass: Record<string, string> = {
  COMPLETED: "bg-[#eef3e9] text-[#6f8d47]",
  PROCESSING: "bg-[#f9f1e5] text-[#ad7a36]",
  SHIPPED: "bg-[#eff2f4] text-[#627484]",
  PAID: "bg-[#edf3ed] text-[#5a8760]",
  WAITING_PAYMENT: "bg-[#f9f1e5] text-[#ad7a36]",
  CANCELLED: "bg-[#fbeeee] text-[#b75e5e]",
};

function Sparkline() {
  return (
    <svg viewBox="0 0 100 32" className="h-8 w-24 text-[#b88a55]" fill="none">
      <path
        d="M2 25 C12 22, 12 12, 22 18 S34 25, 43 13 S55 26, 66 17 S79 21, 88 5 S96 10, 99 4"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function OverviewChart() {
  return (
    <div className="mt-6 h-48">
      <svg
        viewBox="0 0 650 190"
        className="h-full w-full overflow-visible"
        fill="none"
      >
        <g stroke="#eadfd4" strokeWidth="1">
          <path d="M0 25H650" />
          <path d="M0 70H650" />
          <path d="M0 115H650" />
          <path d="M0 160H650" />
        </g>
        <path
          d="M20 137 C78 106, 92 85, 143 98 S202 56, 252 94 S313 135, 360 100 S415 54, 470 88 S528 107, 570 81 S613 52, 636 37"
          stroke="#a67742"
          strokeWidth="3"
        />
        <path
          d="M20 155 C76 134, 94 125, 143 139 S203 103, 252 130 S310 149, 360 128 S414 107, 470 125 S526 141, 570 118 S615 99, 636 87"
          stroke="#b88a55"
          strokeDasharray="7 7"
          strokeWidth="2"
        />
        <g fill="#8b7563" fontSize="10">
          <text x="0" y="184">
            6 Mei
          </text>
          <text x="102" y="184">
            7 Mei
          </text>
          <text x="205" y="184">
            8 Mei
          </text>
          <text x="307" y="184">
            9 Mei
          </text>
          <text x="403" y="184">
            10 Mei
          </text>
          <text x="510" y="184">
            11 Mei
          </text>
          <text x="606" y="184">
            12 Mei
          </text>
        </g>
      </svg>
    </div>
  );
}

function SalesChart() {
  const bars = [92, 126, 126, 115, 108, 120, 138];
  return (
    <div className="mt-6 flex h-40 items-end justify-around border-b border-[#eadfd4] px-4">
      {bars.map((height, index) => (
        <div key={String(index)} className="flex h-full flex-col justify-end">
          <div
            className="w-4 bg-[#aa7a47]/85 md:w-6"
            style={{ height: String(height) + "px" }}
          />
          <span className="mt-2 text-[9px] text-[#8b7563]">
            {index + 6} Mei
          </span>
        </div>
      ))}
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [overview, setOverview] = useState<Overview | null>(null);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [statistics, setStatistics] = useState<Record<string, number>>({});
  const [error, setError] = useState("");

  useEffect(() => {
    if (!AdminSession.has()) {
      router.replace("/admin/login");
      return;
    }
    Promise.allSettled([
      AdminService.dashboard(),
      AdminService.dashboardTopProducts(),
      AdminService.dashboardRecentOrders(),
      AdminService.dashboardOrderStatistics(),
    ]).then(
      ([overviewResult, productsResult, ordersResult, statisticsResult]) => {
        if (overviewResult.status === "rejected") {
          const requestError = overviewResult.reason as {
            response?: { status?: number };
          };
          if ([401, 403].includes(requestError.response?.status || 0)) {
            AdminSession.clear();
            router.replace("/admin/login");
            return;
          }
          setError(
            "Data utama dashboard belum dapat dimuat. Coba refresh halaman.",
          );
          return;
        }
        setOverview(overviewResult.value.data);
        if (productsResult.status === "fulfilled")
          setTopProducts(productsResult.value.data || []);
        if (ordersResult.status === "fulfilled")
          setRecentOrders(ordersResult.value.data || []);
        if (statisticsResult.status === "fulfilled")
          setStatistics(statisticsResult.value.data || {});
      },
    );
  }, [router]);

  const orderTotal = useMemo(
    () =>
      Object.values(statistics).reduce(
        (total, value) => total + Number(value || 0),
        0,
      ) ||
      overview?.total_orders ||
      0,
    [statistics, overview],
  );
  const cards = [
    {
      label: "Total Revenue",
      value: formatPrice(overview?.revenue_month || 0),
      note: "+18.6% dari minggu lalu",
      icon: CircleDollarSign,
    },
    {
      label: "Total Orders",
      value: String(overview?.total_orders || 0),
      note: "+12.4% dari minggu lalu",
      icon: ReceiptText,
    },
    {
      label: "Total Products",
      value: String(overview?.total_products || 0),
      note: "+4 produk baru",
      icon: Box,
    },
    {
      label: "Total Customers",
      value: String(overview?.total_customers || 0),
      note: "+15.8% dari minggu lalu",
      icon: UserRound,
    },
  ];
  const orderStatus = [
    { key: "completed", label: "Selesai", color: "bg-[#a97a47]" },
    { key: "processing", label: "Processing", color: "bg-[#d6b37f]" },
    { key: "shipped", label: "Dikirim", color: "bg-[#ead6b9]" },
    { key: "cancelled", label: "Dibatalkan", color: "bg-[#5b4230]" },
  ];
  const quickActions = [
    { label: "Tambah Produk", href: "/admin/products/new", icon: PackagePlus },
    { label: "Kelola Order", href: "/admin/orders", icon: ReceiptText },
    { label: "Tambah Banner", href: "/admin/banners", icon: ImagePlus },
    { label: "Tambah Voucher", href: "/admin/vouchers", icon: TicketPercent },
    { label: "Laporan Penjualan", href: "/admin/reports", icon: TrendingUp },
    { label: "Kelola Pelanggan", href: "/admin/customers", icon: UsersRound },
    { label: "Pengaturan Toko", href: "/admin/settings", icon: Settings },
  ];

  if (!overview && !error)
    return (
      <main className="grid min-h-screen place-items-center bg-[#f8f5f1] text-sm text-[#806b59]">
        Memuat dashboard...
      </main>
    );
  if (error)
    return (
      <div className="flex min-h-screen bg-[#f8f5f1]">
        <AdminSidebar />
        <main className="grid flex-1 place-items-center p-6">
          <div className="border border-[#eadfd4] bg-white p-8 text-center shadow-sm">
            <h1 className="font-luxury text-3xl">Dashboard</h1>
            <p className="mt-3 text-sm text-[#806b59]">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 bg-[#b88a55] px-5 py-2.5 text-sm text-white"
            >
              Refresh
            </button>
          </div>
        </main>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-[#f8f5f1] text-[#2d241f]">
      <AdminSidebar />
      <main className="min-w-0 flex-1 px-5 py-6 lg:px-9 lg:py-7">
        <header className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm text-[#806b59]">Halo, Admin 👋</p>
            <h1 className="mt-1 font-luxury text-4xl">Dashboard</h1>
            <p className="mt-1 text-sm text-[#806b59]">
              Ringkasan performa toko Floo Fashion hari ini.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex h-10 w-full max-w-[435px] items-center gap-3 border border-[#eadfd4] bg-white px-4 shadow-sm sm:w-[435px]">
              <input
                aria-label="Cari produk, order, pelanggan"
                placeholder="Cari produk, order, pelanggan..."
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#a58f7b]"
              />
              <Search className="size-4 text-[#715d4e]" />
            </label>
            <button
              type="button"
              aria-label="Notifikasi"
              className="relative p-2 text-[#715d4e]"
            >
              <Bell className="size-5" />
              <span className="absolute right-0 top-0 flex size-4 items-center justify-center rounded-full bg-[#a67742] text-[9px] text-white">
                3
              </span>
            </button>
            <div className="hidden items-center gap-2 sm:flex">
              <span className="flex size-9 items-center justify-center rounded-full bg-[#b88a55] text-sm text-white">
                A
              </span>
              <div className="text-xs">
                <p className="font-semibold">Admin</p>
                <p className="text-[#806b59]">Super Admin</p>
              </div>
              <ChevronDown className="size-4 text-[#806b59]" />
            </div>
          </div>
        </header>
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            className="flex items-center gap-2 border border-[#eadfd4] bg-white px-4 py-2.5 text-xs text-[#644e3b] shadow-sm"
          >
            06 Mei 2024 - 12 Mei 2024 <ChevronDown className="size-3.5" />
          </button>
        </div>
        <section className="mt-5 grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
          {cards.map(({ label, value, note, icon: Icon }) => (
            <article
              key={label}
              className="border border-[#eee5dc] bg-white p-4 shadow-[0_8px_22px_rgba(91,62,36,.05)]"
            >
              <div className="flex items-start justify-between">
                <span className="flex size-11 items-center justify-center rounded-full bg-[#f8f0e5] text-[#ad7a42]">
                  <Icon className="size-5" />
                </span>
                <Sparkline />
              </div>
              <p className="mt-3 text-xs text-[#806b59]">{label}</p>
              <p className="mt-1 font-luxury text-2xl">{value}</p>
              <p className="mt-3 text-[11px] text-[#5b8c58]">{note}</p>
            </article>
          ))}
        </section>
        <section className="mt-5 grid gap-4 2xl:grid-cols-[1.35fr_.82fr_.92fr]">
          <div className="border border-[#eee5dc] bg-white p-5 shadow-[0_8px_22px_rgba(91,62,36,.05)]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-luxury text-xl">Analytics Overview</h2>
                <div className="mt-3 flex gap-4 text-[10px] text-[#806b59]">
                  <span className="flex items-center gap-1.5">
                    <i className="h-0.5 w-5 bg-[#a67742]" />
                    Revenue
                  </span>
                  <span className="flex items-center gap-1.5">
                    <i className="h-0.5 w-5 border-t border-dashed border-[#b88a55]" />
                    Orders
                  </span>
                </div>
              </div>
              <button className="border border-[#eadfd4] px-3 py-2 text-xs text-[#644e3b]">
                Mingguan
              </button>
            </div>
            <OverviewChart />
          </div>
          <div className="border border-[#eee5dc] bg-white p-5 shadow-[0_8px_22px_rgba(91,62,36,.05)]">
            <div className="flex items-center justify-between">
              <h2 className="font-luxury text-xl">Top Products</h2>
              <Link
                href="/admin/products"
                className="text-[11px] text-[#ad7a42]"
              >
                Lihat Semua
              </Link>
            </div>
            <div className="mt-5 space-y-4">
              {topProducts.length ? (
                topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <span className="w-3 text-sm text-[#6f5845]">
                      {index + 1}
                    </span>
                    <span className="flex size-10 items-center justify-center bg-[#f4ece2] text-xs text-[#a67742]">
                      F
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm">{product.name}</p>
                      <p className="mt-0.5 text-xs text-[#806b59]">
                        Floo Collection
                      </p>
                    </div>
                    <div className="text-right text-xs">
                      <p className="text-[#806b59]">Terjual</p>
                      <p className="mt-0.5 font-semibold">
                        {product.sold_count || 0}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-10 text-center text-sm text-[#806b59]">
                  Belum ada produk aktif.
                </p>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <div className="border border-[#eee5dc] bg-white p-5 shadow-[0_8px_22px_rgba(91,62,36,.05)]">
              <h2 className="font-luxury text-xl">Order Status</h2>
              <div className="mt-5 flex items-center gap-5">
                <div
                  className="relative grid size-32 place-items-center rounded-full"
                  style={{
                    background:
                      "conic-gradient(#a97a47 0deg 180deg, #d6b37f 180deg 270deg, #ead6b9 270deg 330deg, #5b4230 330deg 360deg)",
                  }}
                >
                  <span className="grid size-20 place-items-center rounded-full bg-white text-center">
                    <b className="font-luxury text-2xl">{orderTotal}</b>
                    <small className="text-[9px] text-[#806b59]">
                      Total Orders
                    </small>
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  {orderStatus.map((item) => (
                    <div key={item.key} className="flex items-center gap-2">
                      <i className={"size-2 rounded-full " + item.color} />
                      <span className="min-w-6 font-semibold">
                        {statistics[item.key] || 0}
                      </span>
                      <span className="text-[#806b59]">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="border border-[#eee5dc] bg-white p-5 shadow-[0_8px_22px_rgba(91,62,36,.05)]">
              <div className="flex items-center justify-between">
                <h2 className="font-luxury text-xl">Recent Orders</h2>
                <Link
                  href="/admin/orders"
                  className="text-[11px] text-[#ad7a42]"
                >
                  Lihat Semua
                </Link>
              </div>
              <div className="mt-3 divide-y divide-[#eee5dc]">
                {recentOrders.length ? (
                  recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between gap-3 py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium">
                          {order.invoice}
                        </p>
                        <p className="truncate text-[11px] text-[#806b59]">
                          {order.customer?.name || "Customer"}
                        </p>
                      </div>
                      <p className="text-xs">{formatPrice(order.total)}</p>
                      <span
                        className={
                          "px-2 py-1 text-[10px] " +
                          (statusClass[order.status] ||
                            "bg-[#f4ece2] text-[#806b59]")
                        }
                      >
                        {statusLabel[order.status] || order.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="py-6 text-center text-sm text-[#806b59]">
                    Belum ada order.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
        <section className="mt-5 grid gap-4 2xl:grid-cols-[1.35fr_.9fr_.9fr]">
          <div className="border border-[#eee5dc] bg-white p-5 shadow-[0_8px_22px_rgba(91,62,36,.05)]">
            <div className="flex items-center justify-between">
              <h2 className="font-luxury text-xl">Sales Performance</h2>
              <button className="border border-[#eadfd4] px-3 py-2 text-xs text-[#644e3b]">
                Mingguan
              </button>
            </div>
            <SalesChart />
          </div>
          <div className="border border-[#eee5dc] bg-white p-5 shadow-[0_8px_22px_rgba(91,62,36,.05)] 2xl:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="font-luxury text-xl">Customer Growth</h2>
              <TrendingUp className="size-4 text-[#a67742]" />
            </div>
            <div className="relative mt-5 h-32 overflow-hidden border-b border-[#eadfd4]">
              <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-[#ead9c1] to-transparent" />
              <svg
                viewBox="0 0 400 120"
                className="absolute inset-0 h-full w-full"
                fill="none"
              >
                <path
                  d="M4 105 C40 90, 60 77, 94 77 S143 48, 185 60 S243 34, 280 44 S326 18, 396 22"
                  stroke="#a67742"
                  strokeWidth="3"
                />
              </svg>
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-[#806b59]">
              <span>6 Mei</span>
              <span>8 Mei</span>
              <span>10 Mei</span>
              <span>12 Mei</span>
            </div>
          </div>
        </section>
        <section className="mt-5 border border-[#eee5dc] bg-white p-5 shadow-[0_8px_22px_rgba(91,62,36,.05)]">
          <h2 className="font-luxury text-xl">Quick Actions</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-7">
            {quickActions.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className="flex min-h-20 flex-col items-center justify-center gap-2 bg-[#faf7f2] text-center text-xs transition hover:-translate-y-0.5 hover:bg-[#f3e7d8]"
              >
                <Icon className="size-5 text-[#ad7a42]" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
