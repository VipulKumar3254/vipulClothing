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
  import { useInView } from "react-intersection-observer";


  function ProductGrid() {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [deals, setDeals] = useState([]); // Store deals from Firestore
    const navigate= useNavigate();
    const { ref: dealsRef, inView } = useInView({
    triggerOnce: false, // So it re-triggers every time it's in view
    threshold: 0.1,
  });

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
      <div
      //  style={{ background: "#F5F5F5" }}
      className="   m-0 d-md-flex d-sm-block justify-content-between align-items-center ">
      <div ref={dealsRef} className={`mainContainer1 col-md-3 ${inView ? "fade-in" : ""}`}>

          <div className={`d-flex justify-content-center align-items-baseline ${inView ? "TodayDealsHeader" : ""}`}>

          
          
            <h3 className="m-0  ms-2 d-flex align-items-center">Today's Deals</h3>
            <p className="m-0 ms-3 d-flex align-items-center text-secondary    "  onClick={()=>{
              navigate("/allDeals")
            }}
            style={{cursor:"pointer", textDecoration:"underline"}}
            >See all deals</p>
          </div>

          <div className="mt-2">
            <Row style={{width:"100%"}} xs={2} sm={2} md={2} lg={2} className="gx-2 gy-2"> 
              {deals.map((product, idx) => (   
              <Col key={product.id} className="g-2 p-1">
    <div 
      className="ProductCard"
      onClick={() => navigate(`/product/productDesc/${product.id}`)}
    >
      <img
        className="ProductImg"
        src={product.photo[0]}
        alt={product.title}
      />
    <p className={`p-0 m-0 title1 fw-medium text-center ${inView ? "AnimatedTitle" : ""}`}>
    {product.title}
  </p>
  <p className={`p-0 m-0 title text-center ${inView ? "AnimatedPrice" : ""}`}>
    <sup>&#8377;</sup>{product.price}
  </p> 
  </div>
  </Col>

              ))}
            </Row>
          </div>
        </div>
        <div  className=" linearGradient   col-md-9 ">
          
        <SideView />
        </div>
      </div>
    );
  }

  export default ProductGrid;
