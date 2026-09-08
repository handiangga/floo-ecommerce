import PolicyPage from "@/components/legal/PolicyPage";

export default function PrivacyPage() {
  return <PolicyPage eyebrow="Legal" title="Kebijakan Privasi" intro="Privasi pelanggan penting bagi Floo Fashion. Halaman ini menjelaskan data yang kami gunakan dan cara kami menjaganya." updated="8 Agustus 2026" sections={[
    { title: "Data yang kami kumpulkan", body: ["Saat membuat akun atau memesan produk, kami dapat mengumpulkan nama, alamat email, nomor WhatsApp, alamat pengiriman, dan riwayat pesanan. Data pembayaran diproses melalui penyedia pembayaran yang aman; kami tidak menyimpan data kartu pembayaran lengkap."] },
    { title: "Penggunaan data", body: ["Data digunakan untuk memproses pesanan, mengatur pengiriman, memberi dukungan pelanggan, mencegah penyalahgunaan, dan—apabila kamu menyetujuinya—mengirim pembaruan koleksi atau promo Floo Fashion."] },
    { title: "Keamanan & pihak ketiga", body: ["Kami menerapkan langkah pengamanan yang wajar untuk melindungi data pelanggan. Data hanya dibagikan seperlunya kepada mitra pembayaran, pengiriman, layanan penyimpanan, dan penyedia teknologi yang membantu operasional toko."] },
    { title: "Hak kamu", body: ["Kamu dapat meminta pembaruan atau penghapusan data akun yang tidak lagi diperlukan, sepanjang tidak bertentangan dengan kewajiban pencatatan transaksi. Hubungi kami melalui WhatsApp untuk mengajukan permintaan tersebut."] },
  ]} />;
}
