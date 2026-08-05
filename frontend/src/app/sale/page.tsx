import MainLayout from "@/components/layout/MainLayout";
import ProductCatalog from "@/components/product/ProductCatalog";

export default function SalePage() {
  return <MainLayout><ProductCatalog title="Sale" eyebrow="Limited Time Offer" saleOnly description="Temukan koleksi Floo pilihan dengan harga spesial selama persediaan masih ada." /></MainLayout>;
}
