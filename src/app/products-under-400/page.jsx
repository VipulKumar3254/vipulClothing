import StoreCatalog from "@/components/store/StoreCatalog";

export const dynamic = "force-dynamic";
export default function ValueCollection({ searchParams }) {
  return <StoreCatalog title="Styles under ₹400" maxPrice={400} searchParams={searchParams} />;
}
