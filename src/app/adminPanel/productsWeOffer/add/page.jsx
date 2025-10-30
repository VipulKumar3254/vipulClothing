"use client";

import { useState } from "react";
import { db, storage } from "@/firebaseConfig"; // adjust path
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AddProductsWeOffer() {
  const [product, setProduct] = useState({
    imgSrc: null,
    name: "",
    path: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProduct({ ...product, imgSrc: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!product.imgSrc) {
        alert("Please select an image!");
        setLoading(false);
        return;
      }

      // Unique file name
      const uniqueFileName = `${Date.now()}-${product.imgSrc.name}`;

      // Upload image to Firebase Storage
      const storageRef = ref(storage, `productsWeOffer/${uniqueFileName}`);
      await uploadBytes(storageRef, product.imgSrc);

      // Get uploaded image URL
      const imageUrl = await getDownloadURL(storageRef);

      // Save product in Firestore
      await addDoc(
        collection(db, "admin", "productsWeOffer", "products"),
        {
          imgSrc: imageUrl,
          name: product.name,
          path: product.path,
        }
      );

      alert("Product added successfully!");
      setProduct({ imgSrc: null, name: "", path: "" });
      setImagePreview(null);
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="w-100" style={{ maxWidth: "40rem" }}>
        <h2 className="text-center mb-4">Add Product</h2>
        <form
          onSubmit={handleSubmit}
          className="p-4 border rounded shadow-sm bg-light"
        >
          {/* Image Upload */}
          <div className="mb-3">
            <label className="form-label">Upload Image</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="img-thumbnail mt-2"
                style={{ maxHeight: "200px" }}
              />
            )}
          </div>

          {/* Product Name */}
          <div className="mb-3">
            <label className="form-label">Product Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter product name"
              value={product.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Product Category */}
          <div className="mb-3">
            <label htmlFor="category" className="form-label">
              Product Category
            </label>
            <select
              className="form-select"
              name="path"
              onChange={handleChange}
              value={product.path}
              id="category"
              required
            >
              <option value="">Select Product Category</option>
              <option value="/jeans">Jeans</option>
              <option value="/tshirts">T-Shirts</option>
              <option value="/shirts">Shirts</option>
              <option value="/joggers">Joggers</option>
              <option value="/winterCollection">Winter Collection</option>
            </select>
            <p
              className="mt-1 text-danger"
              style={{ display: "none" }}
            >
              Please Select Category Carefully.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
