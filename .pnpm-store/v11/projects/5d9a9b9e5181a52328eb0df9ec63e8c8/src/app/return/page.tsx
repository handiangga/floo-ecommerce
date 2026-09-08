import PolicyPage from "@/components/legal/PolicyPage";

export default function ReturnPage() {
  return <PolicyPage eyebrow="Customer Care" title="Kebijakan Retur & Penukaran" intro="Kami ingin setiap pesanan sampai dengan baik. Jika ada kendala, tim Floo siap membantu meninjau permohonan retur atau penukaran." updated="8 Agustus 2026" sections={[
    { title: "Syarat pengajuan", body: ["Permohonan dapat diajukan maksimal 7 hari kalender setelah pesanan diterima untuk produk yang salah kirim, cacat produksi, atau mengalami kerusakan saat tiba. Produk harus belum dipakai, belum dicuci, memiliki label asli, serta dikembalikan dengan kemasan dan kelengkapan yang diterima."] },
    { title: "Yang tidak dapat diretur", body: ["Produk sale, produk pre-order, produk yang dibuat atau diubah sesuai permintaan, dan produk yang rusak karena pemakaian tidak dapat ditukar atau dikembalikan, kecuali terdapat kesalahan dari pihak kami."] },
    { title: "Cara mengajukan", body: ["Hubungi WhatsApp Floo Fashion dengan nomor pesanan, foto atau video kondisi produk, dan penjelasan singkat kendalanya. Mohon menunggu konfirmasi dari tim kami sebelum mengirim produk kembali."] },
    { title: "Pengembalian dana", body: ["Apabila permohonan disetujui dan stok pengganti tidak tersedia, pengembalian dana akan diproses ke metode yang disepakati setelah produk diterima dan diperiksa oleh tim Floo Fashion. Biaya kirim pengembalian untuk kesalahan dari kami akan ditanggung Floo Fashion."] },
  ]} />;
}
