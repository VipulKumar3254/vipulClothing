// app/admin/products/[id]/page.jsx

import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import UpdateProductClient from "./UpdateProductClient";

export default async function Page({ params }) {
  const { id } =await params;
  console.log("so the id is ",params);
  

  const ref = doc(db, "products", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return <p>Product not found</p>;
  }

  const product = {
    id: snap.id,
    ...snap.data(),
  };

  return <UpdateProductClient product={product} />;
}
