'use client';

import { useEffect, useState } from "react";
import { db } from "@/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/newArrivals.css"; // Adjust path if needed

const NewArrivals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleClick = (productId) => {
    router.push(`/productDesc/${productId}`);
  };

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const q = query(collection(db, "products"), where("isNewArrival", "==", true));
        const querySnapshot = await getDocs(q);
        const dealsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDeals(dealsArray);
      } catch (error) {
        console.error("Error fetching deals: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  return (
    <div className="container mt-4 min-vh-100">
      <h2 className="text-center mb-4 fw-normal" style={{ fontFamily: "Jost Variable" }}>
        🔥 New Arrivals 🔥
      </h2>

      {loading ? (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Col key={i}>
              <Card className="placeholder-card h-100 border-0 rounded-0" style={{ backgroundColor: "#f0f0f0" }}>
                <div className="placeholder-img w-100"></div>
                <Card.Body className="px-2 py-2">
                  <div className="placeholder-text mb-2"></div>
                  <div className="placeholder-text short"></div>
                  <div className="placeholder-text short mt-2" style={{ width: "40%" }}></div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : deals.length === 0 ? (
        <p className="text-center">No new arrivals at the moment.</p>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {deals.map((product) => (
            <Col key={product.id}>
              <Card
                onClick={() => handleClick(product.id)}
                className="shadow-sm h-100 text-decoration-none border-0 rounded-0"
                style={{ backgroundColor: "#F7F7F7", cursor: "pointer" }}
              >
                <div className="position-relative">
                  <Card.Img
                    variant="top"
                    src={product.photo}
                    alt={product.title}
                    className="card-img-top"
                  />
                </div>
                <Card.Body className="px-2 py-2 text-start" style={{ fontFamily: "Jost Variable" }}>
                  <h5 className="fw-normal text-dark card-title">{product.title}</h5>
                  <p className="text-muted p-0 mb-0" style={{ fontSize: "12px" }}>
                    <span className="badge bg-success text-start">Free delivery</span> on ₹599+
                  </p>
                  <div className="mt-2">
                    <p
                      style={{ backgroundColor: "#FFCE12", fontSize: "11px" }}
                      className="d-inline px-3 py-1 border rounded-5"
                    >
                      New Arrival
                    </p>
                  </div>
                  <p className="fw-medium text-dark fs-6 mb-0 mt-2">Rs. {product.price}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default NewArrivals;
