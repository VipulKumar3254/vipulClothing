"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig"; // Use alias path for Next.js
import Image from "next/image";

export default function ProductInfo({ productId }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!productId) return;

        const productRef = doc(db, "products", productId);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          setProduct({ id: productSnap.id, ...productSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  if (!product) {
    return <p>Loading product...</p>;
  }

  return (
    <div className="d-flex align-items-center gap-3 mb-2">
      <Image
        src={
          Array.isArray(product.photo) && product.photo[0]
            ? product.photo[0]
            : "https://via.placeholder.com/60"
        }
        alt={product.title || "Product"}
        width={60}
        height={60}
        style={{
          objectFit: "cover",
          borderRadius: "8px",
        }}
      />
      <strong
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "200px",
        }}
      >
        {product.title || "Untitled Product"}
      </strong>
    </div>
  );
}
