import StoreCatalog from "@/components/store/StoreCatalog";

export const dynamic = "force-dynamic";
export default function CatalogPage({ searchParams }) {
  return <StoreCatalog title="Jeans" category="jeans" searchParams={searchParams} />;
}
