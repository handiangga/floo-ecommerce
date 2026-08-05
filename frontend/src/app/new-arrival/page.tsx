import MainLayout from "@/components/layout/MainLayout";
import ProductCatalog from "@/components/product/ProductCatalog";

export default function NewArrivalPage() { return <MainLayout><ProductCatalog title="New Arrival" eyebrow="Just Arrived" params={{ is_new_arrival: true }} /></MainLayout>; }
