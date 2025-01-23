import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import "bootstrap/dist/css/bootstrap.min.css";

const AllDeals = () => {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                const q = query(collection(db, "products"), where("isDeal", "==", true));
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
            <h2 className="text-center mb-4">🔥 Hot Deals 🔥</h2>
            
            {loading ? (
                <p className="text-center">Loading deals...</p>
            ) : deals.length === 0 ? (
                <p className="text-center">No deals available at the moment.</p>
            ) : (
                <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                    {deals.map((product) => (
                        <Col key={product.id}>
                            <Card className="shadow-sm h-100 d-flex  justify-content-center align-items-center">
                                {/* Product Image */}
                                <Card.Img
                                    variant="top"
                                    src={product.photo}
                                    alt={product.title}
                                    style={{ height: "250px", width:"200px", }}
                                />
                                <Card.Body className="text-center">
                                    <Card.Title>{product.title}</Card.Title>
                                    <Card.Text className="text-muted">{product.subTitle}</Card.Text>
                                    <h6 className="text-dark fs-5">
                                        Price: <sup>&#8377;</sup>{product.price}
                                    </h6>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default AllDeals;
