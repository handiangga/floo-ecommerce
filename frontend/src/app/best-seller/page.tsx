import MainLayout from "@/components/layout/MainLayout";
import ProductCatalog from "@/components/product/ProductCatalog";

export default function BestSellerPage() { return <MainLayout><ProductCatalog title="Best Seller" eyebrow="Most Loved" params={{ is_best_seller: true }} /></MainLayout>; }
