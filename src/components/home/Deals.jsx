"use client";
import { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { db } from "@/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import "@/styles/deals.css";
import SideView from "./SideView";

function Deals() {
  const [loadedImages, setLoadedImages] = useState({});
  const [deals, setDeals] = useState([]);
  const router = useRouter();
  const { ref: dealsRef, inView } = useInView({ threshold: 0.1 });

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const q = query(collection(db, "products"), where("isDeal", "==", true));
        const snapshot = await getDocs(q);
        const fetchedDeals = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDeals(fetchedDeals.sort(() => Math.random() - 0.5).slice(0, 4));
      } catch (error) {
        console.error("Error fetching deals:", error);
      }
    };
    fetchDeals();
  }, []);

  return (
    <div className="mt-2 d-md-flex d-sm-block justify-content-between align-items-center">
      <div ref={dealsRef} className={`mainContainer1 col-md-3 ${inView ? "fade-in" : ""}`}>
        <div className={`d-flex justify-content-start justify-content-md-center align-items-baseline ${inView ? "TodayDealsHeader" : ""}`}>
          <h3 style={{ fontFamily: "Jost Variable", fontWeight: "500" }} className="m-0 ms-2">
            Today's Deals
          </h3>
          <p
            className="m-0 ms-3 text-secondary"
            style={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={() => router.push("/allDeals")}
          >
            See all deals
          </p>
        </div>

        <Row className="mt-2 gx-1 gy-2" xs={2} sm={2} md={2} lg={2}>
          {deals.length === 0
            ? Array.from({ length: 4 }).map((_, idx) => (
                <Col key={idx} className="mt-2 p-1">
                  <div className="ProductCard placeholder-card">
                    <div className="ProductImg placeholder-img"></div>
                    <p className="placeholder-text mt-1"></p>
                    <p className="placeholder-text short"></p>
                  </div>
                </Col>
              ))
            : deals.map((product) => (
                <Col key={product.id} className="mt-2 p-1">
                  <div
                    className="ProductCard"
                    onClick={() => router.push(`/product/${product.id}`)}
                  >
                    <div className="image-wrapper">
                      {!loadedImages[product.id] && <div className="img-placeholder" />}
                      <Image
                        src={product.photo[0]}
                        alt={product.title}
                        width={200}
                        height={200}
                        className={`ProductImg ${loadedImages[product.id] ? "loaded" : "loading"}`}
                        onLoad={() =>
                          setLoadedImages((prev) => ({ ...prev, [product.id]: true }))
                        }
                      />
                    </div>
                    <p
                      style={{
                        fontFamily: "Jost Variable",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }} className="p-0 m-0 title1 text-center text-uppercase">{product.title}</p>
                    <p className="p-0 m-0 fs-6 title text-start">Rs. {product.price}</p>
                  </div>
                </Col>
              ))}
        </Row>
      </div>

      <div className="linearGradient col-md-9 d-none d-md-block">
        <SideView />
      </div>
    </div>
  );
}

export default Deals;
