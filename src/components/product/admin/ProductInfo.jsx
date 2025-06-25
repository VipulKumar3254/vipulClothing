import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";

const ProductInfo = ({ productId }) => {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(db, "products", productId);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          setProduct(productSnap.data());
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
      <img
        src={product.photo?.[0] || "https://via.placeholder.com/60"}
        alt={product.title}
        style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }}
      />
      <strong>{product.title}</strong>
    </div>
  );
};

export default ProductInfo;
