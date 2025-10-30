import "@fontsource-variable/jost";
import { db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import Comments from "./Comments";
import MoreLikeThis from "./MoreLikeThis";
import toast, { Toaster } from "react-hot-toast";
import ProductDescClient from "./ProductDescClient"; // Client component for interactivity

// Fetch data on the server
async function getProductData(id) {
  const docRef = doc(db, "products", id);
  const docSnap = await getDoc(docRef);


  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() };
}

export async function generateMetadata({ params }) {
  const product = await getProductData(params.id);
  return {
    title: product ? `${product.title} | Kumar Fashion Store` : "Product Not Found",
    description: product?.subTitle || "Premium product from Kumar Fashion Store",
  };
}

export default async function ProductDescPage({params }) {


  console.log(await params);
  const product = await getProductData(params.id);

  if (!product) {
    return <div className="text-center mt-5">Product not found</div>;
  }

  return (
    <>
      <ProductDescClient product={product} />
      <Comments product={product} />
      <MoreLikeThis product={product} />
      <Toaster position="bottom-left" />
    </>
  );
}
