import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useState, useEffect } from "react";
// import { db } from "../../../../firebaseConfig"; // Import Firestore config
import { db } from "../../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import "../css/Deals.css";
import SideView from "./SideView";
import { useNavigate } from "react-router-dom";

function ProductGrid() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [deals, setDeals] = useState([]); // Store deals from Firestore
  const navigate= useNavigate();

  // Fetch products where isDeal is true
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const q = query(collection(db, "products"), where("isDeal", "==", true));
        const querySnapshot = await getDocs(q);
        const fetchedDeals = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
         // Shuffle the array randomly
        const  dealsArray = fetchedDeals.sort(() => Math.random() - 0.5);

         // Select only the first 4 items
         setDeals(dealsArray.slice(0, 4));
        // setDeals(fetchedDeals);
        console.log(fetchedDeals);
      } catch (error) {
        console.error("Error fetching deals:", error);
      }
    };

    fetchDeals();
  }, []);

  return (
    <div style={{ background: "#F5F5F5" }} className=" m-0 d-md-flex d-sm-block ">
      <div className="mainContainer1">
        <div className="d-flex  justify-content-center align-items-baseline">
         
         
          <h3 className="m-0  ms-2 d-flex align-items-center">Today's Deals</h3>
          <p className="m-0 ms-3 d-flex align-items-center text-secondary    "  onClick={()=>{
            navigate("/allDeals")
          }}
          style={{cursor:"pointer", textDecoration:"underline"}}
          >See all deals</p>
        </div>

        <div className="mt-2">
          <Row style={{width:"100%"}} xs={2} sm={2} md={2} lg={2}>
            {deals.map((product, idx) => (   
              <Col key={product.id} className=" g-0 p-0 d-flex justify-content-center">
                <div 
                  // onMouseEnter={() => setHoveredIndex(idx)}
                  // onMouseLeave={() => setHoveredIndex(null)}
                  onClick={()=>{navigate(`/product/productDesc/${product.id}`)}}
                >
                  <img
                    className="ProductImg"
                    src={product.photo[0]} // Display first image from Firestore
                    alt={product.title} 
                    style={{
                      // transform: hoveredIndex === idx ? "scale(1.1)" : "scale(1)",
                      // zIndex: hoveredIndex === idx ? "1" : "0",
                    }}
                  />
                  <p className=" p-0 m-0 title1 fw-medium">{product.title}</p>
                  <p className=" p-0 m-0 title 	text-secondary"><sup>&#8377;</sup>{product.price}</p>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>
      <SideView />
    </div>
  );
}

export default ProductGrid;
