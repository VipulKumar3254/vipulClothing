
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

// ✅ This pre-builds all category pages for static export
export async function generateStaticParams() {
  return [
    { productCategory: "jeans" },
    { productCategory: "shirts" },
    { productCategory: "tshirts" },
    { productCategory: "joggers" },
  ];
}

export async function generateMetadata({ params }) {
  const { productCategory } = params;
  return {
    title: `${productCategory} from Kumar Fashion Store`,
    description: categoryDesc(productCategory),
  };
}

export default async function Page({ params, searchParams }) {
  const { productCategory } =  await params;
  const searchTerm = await  searchParams?.sort ?? null  // 
  console.log(searchTerm);
  return (
    // <ProductDisplay
    //   category={productCategory}
    //   searchTerm={searchTerm}
    //   categoryDesc={categoryDesc(productCategory)}
    // />
    

<ProductsPage category={productCategory} searchParams={searchParams} />

  );
}
