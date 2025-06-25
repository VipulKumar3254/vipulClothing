import React, { useEffect, useState } from "react";
import { db,storage } from "../../../../firebaseConfig";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { ref, deleteObject } from "firebase/storage";

const ProductsWeOffer = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "admin", "productsWeOffer", "products"));
      const productsArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsArray);
    } catch (error) {
      console.error("Error fetching products: ", error);
    }
  };

  
const handleDelete = async (productId, imgSrc) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;
  
    try {
      // Extract file name from image URL
      const fileName = imgSrc.split("/o/")[1].split("?")[0]; // Extracts "products/filename.jpg"
  
      // Create a reference to the file in Firebase Storage
      const storageRef = ref(storage, decodeURIComponent(fileName));
  
      // Delete image from Firebase Storage
      await deleteObject(storageRef);
  
      // Delete product from Firestore
      await deleteDoc(doc(db, "admin", "productsWeOffer", "products", productId));
  
      // Remove from UI
      setProducts(products.filter((product) => product.id !== productId));
  
      alert("Product and image deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product.");
    }
  };

  return (
    <>
      <div className="container mt-3">
        <Link className="btn btn-primary" to="/admin/addProductsWeOffer">
          Add Products
        </Link>
      </div>

      <div className="container mt-4">
        <h2 className="text-center mb-4">All Products</h2>
        <div className="row">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="col-lg-3 col-md-6 col-sm-12 mb-4">
                <div className="card shadow-sm text-center">
                  <img
                    src={product.imgSrc}
                    className="card-img-top"
                    alt={product.name}
                    style={{ height: "200px", width: "300px" ,objectFit:"contain"}}
                  />
                  <div className="card-body ">

                    <h5 className="card-title">{product.path}</h5>
                    <div className="d-flex justify-content-center align-items-center">
                    <a
                      href={product.path}
                      className="btn btn-primary p"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Product
                    </a>
                    <button className=" m-0 ms-2 btn btn-danger" onClick={() => handleDelete(product.id, product.imgSrc)}>
                      Delete
                    </button>
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
    </>
  );
};

export default ProductsWeOffer;
