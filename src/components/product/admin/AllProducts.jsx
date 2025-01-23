import React, { useEffect, useState } from "react";
import { db } from "../../../../firebaseConfig";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [deal, setdeal] = useState(false);
    const navigate = useNavigate(); // Used for navigation

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

    // Function to mark product as a deal
    const handleMakeDeal = async (productId,isDeal) => {
        console.log("hi");
        try {
            const productRef = doc(db, "products", productId);
            await updateDoc(productRef, { isDeal: !isDeal });
            alert(" Deal Done");
            setProducts((prev) =>
                prev.map((product) =>
                    product.id === productId ? { ...product, isDeal: !isDeal } : product
                )
            );
        } catch (error) {
            console.error("Error updating product: ", error);
        }
    };

    // Function to navigate to update page
    const handleUpdateProduct = (productId) => {
        navigate(`/admin/updateProduct/${productId}`);
    };
    const handleDeleteProduct= async (productId)=>{
        //code to delete the product.
        const confirmDelete = window.confirm("Are you sure you want to delete this product?");
        if (!confirmDelete) return;

        try {
            await deleteDoc(doc(db, "products", productId)); // Delete from Firestore
            alert("Product Deleted");
            
            // Update state to remove deleted product from UI
            setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
        } catch (error) {
            console.error("Error deleting product: ", error);
        }
    }

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">All Products</h2>
            <div className="row">
                {products.length > 0 ? (
                    products.map((product) => (
                        <div key={product.id} className="col-lg-3 col-md-6 col-sm-12 mb-4">
                            <div className="card shadow-sm">
                                {/* Product Image */}
                                <img
                                    src={product.photo}
                                    className="card-img-top"
                                    alt={product.title}
                                    style={{ height: "250px", }}
                                />

                                <div className="card-body text-center">
                                    <h5 className="card-title">{product.title}</h5>
                                    <p className="text-muted">{product.subTitle}</p>
                                    <h6 className="text-dark fs-5 ">Price:  <sup>&#8377;</sup>{product.price}</h6>

                                    {/* Display Sizes */}
                                    <p className="mb-1">
                                        <strong>Sizes:</strong> {product.sizes.join(", ")}
                                    </p>

                                    {/* Display Colors */}
                                    <p className="mb-1">
                                        <strong>Colors:</strong> {product.color.join(", ")}
                                    </p>

                                    {/* Category */}
                                    <p className="text-muted">Category: {product.category}</p>

                                    {/* Buttons */}

                                    <button
                                        className="btn btn-success  me-2" 
                                        onClick={() => handleMakeDeal(product.id,product.isDeal)}
                                        style={{cursor:"pointer"}}
                                     >
                                        {product.isDeal ? "Remove Deal" : "Make Deal"}
                                    </button>

                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleUpdateProduct(product.id)}
                                    >
                                        Update Product
                                    </button>
                                    <button
                                        className="btn btn-primary mt-1"
                                        onClick={() => handleDeleteProduct(product.id)}
                                    >
                                        Delete Product
                                    </button>
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
