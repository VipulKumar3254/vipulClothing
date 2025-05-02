import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import { db } from "../../../../firebaseConfig";

const ManageNewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNewArrivals = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "products"), where("isNewArrival", "==", true));
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(items);
    } catch (error) {
      console.error("Error fetching new arrivals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      const docRef = doc(db, "products", id);
      await updateDoc(docRef, { newArrival: false });
      setProducts(prev => prev.filter(item => item.id !== id)); // Remove from UI
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  useEffect(() => {
    fetchNewArrivals();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">🛠 Manage New Arrivals</h2>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-center">No new arrivals to manage.</p>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {products.map(product => (
            <Col key={product.id}>
              <Card className="shadow-sm h-100 text-center">
                <Card.Img
                  variant="top"
                  src={product.photo}
                  alt={product.title}
                  style={{ height: "250px", width: "200px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title>{product.title}</Card.Title>
                  <Card.Text>{product.subTitle}</Card.Text>
                  <p><strong>₹{product.price}</strong></p>
                  <Button
                    variant="danger"
                    onClick={() => handleRemove(product.id)}
                  >
                    Remove from New Arrivals
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default ManageNewArrivals;
