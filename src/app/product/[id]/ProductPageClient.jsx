"use client";

import { useEffect, useState } from "react";
import ProductDescClient from "./ProductDescClient";
import Comments from "./comments";
import MoreLikeThis from "./MoreLikeThis";

export default function ProductPageClient({ id }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log("ok bro",id);
  useEffect(() => {
  fetch(`/api/product/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="mt-5 text-center">Loading…</div>;
  if (!product) return <div className="mt-5 text-center">Product not found</div>;

  return (
    <>
      <ProductDescClient product={product} />
      <Comments product={product} />
      <MoreLikeThis product={product} />
    </>
  );
}
