import "@fontsource-variable/jost";
import { adminDb } from "@/lib/firebaseAdmin";
import ProductDescClient from "./ProductDescClient";
import Comments from "./comments";
import MoreLikeThis from "./MoreLikeThis";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";


// 🔥 SERVER-SAFE FIRESTORE FETCH
async function getProductData(id) {
  if (!id) return null;

  const docSnap = await adminDb
    .collection("products")
    .doc(id)
    .get();

  if (!docSnap.exists) return null;

  return {
    id: docSnap.id,
    ...docSnap.data(),
  };
}

// ✅ FIXED: params must be awaited
export async function generateMetadata({ params }) {
  const { id } = await params;

  const product = await getProductData(id);

  return {
    title: product
      ? `${product.title} | Kumar Fashion Store`
      : "Product Not Found | Kumar Fashion Store",
    description:
      product?.subTitle ||
      "Premium fashion product from Kumar Fashion Store",
  };
}

// ✅ FIXED: params must be awaited
export default async function ProductDescPage({ params }) {
  const { id } = await params;

  const product = await getProductData(id);

  if (!product) {
    return <div className="text-center mt-5">Product not found</div>;
  }

  return (
    <>
      <ProductDescClient product={product} />
      <Comments product={product} />
      <MoreLikeThis product={product} />
    </>
  );
}
