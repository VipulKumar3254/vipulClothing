import "@fontsource/archivo"

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import "../css/ProductGrid.css";

function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
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
    fetchProducts();
  }, []);

  return (
    <div className="container mt-4">
  <h1 style={{fontFamily:"archivo"}} className="text-center text-uppercase">Products We Offer</h1>
  <div className="scroll-container mt-0">
    {products.map((product, idx) => (
      <div
        key={idx}
        className="scroll-card"
        onClick={() => navigate(`${product.path}`)}
        onMouseEnter={() => setHoveredIndex(idx)}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <img
          src={product.imgSrc}
          alt={product.name}
          className="cardImg"
          style={{
            transform: hoveredIndex === idx ? "scale(1.05)" : "scale(1)",
            zIndex: hoveredIndex === idx ? 1 : 0,
          }}
        />
        <p  style={{fontFamily:"archivo"}} className="text-center mt-2 text-uppercase">{product.name}</p>
      </div>
    ))}
  </div>
</div>

  );
}

export default ProductGrid;
