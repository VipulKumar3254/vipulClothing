import "@fontsource-variable/jost";
import ProductPageClient from "./ProductPageClient";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }) {
  const { id } = await params;

  return <ProductPageClient id={id} />;
}