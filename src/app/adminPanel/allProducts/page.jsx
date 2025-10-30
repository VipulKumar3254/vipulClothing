"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/firebaseConfig";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/allProducts.css"

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsArray);
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    };
    fetchProducts();
  }, []);

  const handleMakeDeal = async (productId, isDeal) => {
    try {
      const productRef = doc(db, "products", productId);
      await updateDoc(productRef, { isDeal: !isDeal });
      alert("Deal status updated.");
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, isDeal: !isDeal } : product
        )
      );
    } catch (error) {
      console.error("Error updating deal status:", error);
    }
  };

  const handleMakeNewArrival = async (productId, isNewArrival) => {
    try {
      const productRef = doc(db, "products", productId);
      await updateDoc(productRef, { isNewArrival: !isNewArrival });
      alert("New arrival status updated.");
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, isNewArrival: !isNewArrival } : product
        )
      );
    } catch (error) {
      console.error("Error updating new arrival:", error);
    }
  };

  const handleUpdateProduct = (productId) => {
    router.push(`/admin/updateProduct/${productId}`);
  };

  const handleDeleteProduct = async (productId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;
    try {
      await deleteDoc(doc(db, "products", productId));
      alert("Product Deleted");
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
    } catch (error) {
      console.error("Error deleting product: ", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">All Products</h2>
      <div className="row">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
              <div className="card h-100 position-relative shadow-sm">
                {product.isDeal && (
                  <div className="deal-badge">DEAL</div>
                )}
                <img
                  src={product.photo}
                  className="card-img-top"
                  alt={product.title}
                  style={{ height: "250px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.title}</h5>
                  <p className="mb-1">
                    <strong>Price:</strong> ₹{product.price}
                  </p>
                  <p className="mb-1">
                    <strong>Sizes:</strong> {product.sizes.join(", ")}
                  </p>
                  <p className="mb-1">
                    <strong>Colors:</strong> {product.color.join(", ")}
                  </p>
                  <p className="text-muted mb-2">Category: {product.category}</p>

                  <div className="dropdown mt-auto">
                    <button
                      className="btn btn-outline-primary btn-sm dropdown-toggle w-100"
                      type="button"
                      id={`dropdownMenuButton-${product.id}`}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Actions
                    </button>
                    <ul
                      className="dropdown-menu w-100"
                      aria-labelledby={`dropdownMenuButton-${product.id}`}
                    >
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handleMakeDeal(product.id, product.isDeal)}
                        >
                          {product.isDeal ? "Remove Deal" : "Mark as Deal"}
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() =>
                            handleMakeNewArrival(product.id, product.isNewArrival)
                          }
                        >
                          {product.isNewArrival ? "Mark as Old" : "Mark as New Arrival"}
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handleUpdateProduct(product.id)}
                        >
                          Update Product
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item text-danger"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          Delete Product
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center">
            <p>Loading products...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
