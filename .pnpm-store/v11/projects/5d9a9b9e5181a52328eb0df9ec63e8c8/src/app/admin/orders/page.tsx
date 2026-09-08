"use client";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ExternalLink, Search, Truck, X } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { AdminService } from "@/services/admin.service";
import { AdminSession } from "@/lib/session";

type Order = {
  id: number;
  invoice: string;
  status: string;
  total: number;
  customer?: { name: string; email?: string };
  payment?: {
    id: number;
    method?: string;
    proof_url?: string | null;
  };
};
const states = [
  "ALL",
  "WAITING_PAYMENT",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "COMPLETED",
  "CANCELLED",
];
const text = (value: string) =>
  value === "ALL" ? "Semua" : value.replaceAll("_", " ");

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [shipping, setShipping] = useState<Order | null>(null);
  const [message, setMessage] = useState("");
  const load = () =>
    AdminService.orders().then((result) => setOrders(result.data ?? []));
  useEffect(() => {
    if (!AdminSession.has()) {
      router.replace("/admin/login");
      return;
    }
    load().catch(() => setMessage("Pesanan belum dapat dimuat."));
  }, [router]);
  const visible = useMemo(
    () =>
      orders.filter(
        (order) =>
          (filter === "ALL" || order.status === filter) &&
          (order.invoice + " " + (order.customer?.name ?? ""))
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [orders, filter, search],
  );
  const update = (order: Order, status: string) =>
    AdminService.updateOrderStatus(order.id, status)
      .then(load)
      .catch(() => setMessage("Status belum dapat diperbarui."));
  const verifyManualPayment = (paymentId: number, approved: boolean) => {
    const action = approved
      ? AdminService.approveManualPayment(paymentId)
      : AdminService.rejectManualPayment(paymentId);
    action
      .then(() => {
        setMessage(
          approved
            ? "Pembayaran diterima. Pesanan siap diproses."
            : "Bukti ditolak. Customer dapat mengunggah bukti baru.",
        );
        load();
      })
      .catch(() => setMessage("Pembayaran belum dapat diperbarui. Coba lagi."));
  };
  const waitingProofs = orders.filter(
    (order) => order.status === "WAITING_PAYMENT" && order.payment?.proof_url,
  );
  const ship = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!shipping) return;
    const data = new FormData(event.currentTarget);
    AdminService.updateOrderStatus(shipping.id, "SHIPPED", {
      courier_service: String(data.get("courier")),
      tracking_number: String(data.get("resi")),
    })
      .then(() => {
        setShipping(null);
        load();
      })
      .catch(() => setMessage("Kurir dan nomor resi wajib diisi."));
  };
  return (
    <div className="flex min-h-screen bg-muted">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Operasional toko</p>
              <h1 className="font-luxury text-4xl">Orders</h1>
            </div>
            <p className="rounded-xl bg-white px-4 py-3 text-sm shadow-sm">
              {orders.filter((order) => order.status === "PROCESSING").length}{" "}
              pesanan siap dikirim
            </p>
          </div>
          {message && (
            <p className="mt-5 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
              {message}
            </p>
          )}
          {waitingProofs.length > 0 && (
            <section className="mt-6 rounded-2xl border border-[#eadfd4] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[.16em] text-[#b88a55]">
                    Perlu tindakan
                  </p>
                  <h2 className="font-luxury text-2xl">
                    Verifikasi pembayaran
                  </h2>
                </div>
                <span className="rounded-full bg-[#fcf1dd] px-3 py-1 text-xs text-[#9a6436]">
                  {waitingProofs.length} bukti baru
                </span>
              </div>
              <div className="mt-4 grid gap-3">
                {waitingProofs.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-wrap items-center justify-between gap-3 border border-[#eadfd4] p-4"
                  >
                    <div>
                      <p className="font-medium">
                        {order.invoice} · {order.customer?.name || "Customer"}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {order.payment?.method === "QRIS"
                          ? "QRIS"
                          : "Transfer BCA"}{" "}
                        · Rp{Number(order.total).toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={order.payment?.proof_url || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 border border-[#d8c2a9] px-3 py-2 text-xs text-[#72533a]"
                      >
                        <ExternalLink className="size-3" /> Lihat bukti
                      </a>
                      <button
                        onClick={() =>
                          verifyManualPayment(order.payment!.id, true)
                        }
                        className="inline-flex items-center gap-1 bg-[#5e7d49] px-3 py-2 text-xs text-white"
                      >
                        <Check className="size-3" /> Terima
                      </button>
                      <button
                        onClick={() =>
                          verifyManualPayment(order.payment!.id, false)
                        }
                        className="inline-flex items-center gap-1 border border-rose-300 px-3 py-2 text-xs text-rose-700"
                      >
                        <X className="size-3" /> Tolak
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
          <section className="mt-6 rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:justify-between">
              <div className="flex gap-2 overflow-x-auto">
                {states.map((state) => (
                  <button
                    key={state}
                    onClick={() => setFilter(state)}
                    className={
                      "whitespace-nowrap rounded-full px-3 py-2 text-xs " +
                      (filter === state
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground")
                    }
                  >
                    {text(state)}
                  </button>
                ))}
              </div>
              <label className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari invoice atau customer"
                  className="w-full rounded-xl border py-2.5 pl-9 pr-3 text-sm lg:w-72"
                />
              </label>
            </div>
          </section>
          <section className="mt-5 overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-muted/60 text-xs text-muted-foreground">
                  <tr>
                    <th className="p-4">PESANAN</th>
                    <th className="p-4">CUSTOMER</th>
                    <th className="p-4">TOTAL</th>
                    <th className="p-4">STATUS</th>
                    <th className="p-4 text-right">AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((order) => (
                    <tr key={order.id} className="border-t">
                      <td className="p-4 font-medium">{order.invoice}</td>
                      <td className="p-4">
                        <p>{order.customer?.name ?? "Customer"}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.customer?.email}
                        </p>
                      </td>
                      <td className="p-4">
                        Rp{Number(order.total).toLocaleString("id-ID")}
                      </td>
                      <td className="p-4">
                        <span className="rounded-full bg-muted px-3 py-1 text-xs">
                          {text(order.status)}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {order.status === "PAID" && (
                          <button
                            onClick={() => update(order, "PROCESSING")}
                            className="rounded-full border border-primary px-3 py-2 text-xs text-primary"
                          >
                            Proses
                          </button>
                        )}
                        {order.status === "PROCESSING" && (
                          <button
                            onClick={() => setShipping(order)}
                            className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-2 text-xs text-white"
                          >
                            <Truck className="size-3" /> Kirim
                          </button>
                        )}
                        {order.status === "SHIPPED" && (
                          <button
                            onClick={() => update(order, "COMPLETED")}
                            className="rounded-full border border-primary px-3 py-2 text-xs text-primary"
                          >
                            Selesaikan
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!visible.length && (
              <p className="p-8 text-center text-sm text-muted-foreground">
                Tidak ada pesanan.
              </p>
            )}
          </section>
          {shipping && (
            <div className="fixed inset-0 z-[80] grid place-items-center bg-black/40 p-4">
              <form
                onSubmit={ship}
                className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
              >
                <h2 className="font-luxury text-3xl">Kirim Pesanan</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {shipping.invoice}
                </p>
                <input
                  required
                  name="courier"
                  placeholder="Kurir: JNE / J&T"
                  className="mt-5 w-full rounded-xl border p-3"
                />
                <input
                  required
                  name="resi"
                  placeholder="Nomor resi"
                  className="mt-3 w-full rounded-xl border p-3"
                />
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShipping(null)}
                    className="px-4 py-2 text-sm"
                  >
                    Batal
                  </button>
                  <button className="rounded-full bg-primary px-5 py-2.5 text-sm text-white">
                    Konfirmasi Kirim
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
