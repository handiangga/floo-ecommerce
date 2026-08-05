import MainLayout from "@/components/layout/MainLayout";
import ProductCatalog from "@/components/product/ProductCatalog";

function titleFromSlug(slug: string) {
  return slug.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const title = titleFromSlug(slug);

  return <MainLayout><ProductCatalog title={title + " Collection"} eyebrow="Shop By Category" categorySlug={slug} description={"Pilihan terbaik dari koleksi " + title + " Floo Fashion."} /></MainLayout>;
}
