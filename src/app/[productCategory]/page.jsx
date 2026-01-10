
import ProductsPage from "./ProductsPage";

const categoryDesc = (category) =>
  category === "jeans"
    ? "Kumar Fashion Store provides premium jeans at affordable prices — baggy, slim fit, straight and more."
    : category === "shirts"
    ? "Premium collection of shirts with top quality fabric, stitching and finishing."
    : category === "tshirts"
    ? "Variety of T‑shirts — collar, polo, full sleeve and more."
    : category === "joggers"
    ? "High quality joggers: NS fabric, NS terry, four-way, lycra (stretchable) and more."
    : "Kumar Fashion Store offers a wide variety of garments like lowers, T‑shirts, shirts, jeans and more.";

// Pre-build all category pages
export async function generateStaticParams() {
  return [
    { productCategory: "jeans" },
    { productCategory: "shirts" },
    { productCategory: "tshirts" },
    { productCategory: "joggers" },
  ];
}

// Metadata
export async function generateMetadata({ params }) {
  const { productCategory } = await params; // OK here
  return {
    title: `${productCategory} from Kumar Fashion Store`,
    description: categoryDesc(productCategory),
  };
}

// Page component
export default async function Page({ params, searchParams }) {
  const { productCategory } = await  params;  // ✅ remove await
  const searchTerm = searchParams?.sort ?? null;  // ✅ remove await

  console.log(params);

  return (
    <ProductsPage category={productCategory} searchParams={searchParams} />
  );
}
