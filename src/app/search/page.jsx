import { db } from "@/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import "@/styles/productDisplay.module.css";
import Link from "next/link";
import Filters from "@/components/Filters";
import ProductCardClient from "@/components/ProductCardClient";
import { Suspense } from "react";
import { Await } from "react-router-dom";

// 🔹 Unified search function (server-side)
async function getProducts(term) {
  try {
    if (!term) return [];

    const words = term
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    const map = new Map();

    // Firestore array-contains ek word pe kaam karta hai
    const queries = words.map((word) =>
      getDocs(
        query(
          collection(db, "products"),
          where("tags", "array-contains", word)
        )
      )
    );

    const snapshots = await Promise.all(queries);

    snapshots.forEach((snap) => {
      snap.docs.forEach((doc) => {
        map.set(doc.id, { id: doc.id, ...doc.data() });
      });
    });

    console.log("Server Products:", map.size);

    return Array.from(map.values());
  } catch (err) {
    console.error("Search error:", err);
    return [];
  }
}
export async function generateMetadata({ searchParams }) {
  const params = await searchParams; // 👈 IMPORTANT
  const term = params?.search || "";

  return {
    title: term
      ? `${term} | Kumar Fashion Store`
      : "Search | Kumar Fashion Store",
    description: term
      ? `Buy ${term} online from Kumar Fashion Store`
      : "Search products at Kumar Fashion Store",
  };
}


// 🔹 Server Component Search Page
export default async function SearchPage({ searchParams }) {
const params = await searchParams;



  const term = params.search || "";
  const products = term ? await getProducts(term.toLowerCase()) : [];
 console.log(
  "Products count:",
  Array.isArray(products) ? products.length : "not array"
);

console.log(
  "First product:",
  products?.[0] ? JSON.stringify(products[0]) : "none"
);

  

  return (
    <>
      {/* Mobile filter toggle button */}
      <div
        className="mt-1 d-block d-md-none text-center"
        style={{ fontFamily: "Jost Variable" }}
      >
        <div className="btn btn-secondary px-3">Filters</div>
      </div>

         <Suspense fallback={null}>
        <Filters />
      </Suspense>

      <div className="container mt-3 px-1">
        <div className="row g-0 g-md-4">
          {products.length > 0 ? (
            products.map((item) => (
              <div className="col-6 col-md-3" key={item.id}>
                <Link
                  href={`/product/${item.id}`}
                  className="text-decoration-none"
                >
                  <div
                    className="card h-100 text-decoration-none rounded-0 border-0"
                    style={{ backgroundColor: "#F7F7F7" }}
                  >
                    <div className="position-relative">
                      <img
                        src={
                          Array.isArray(item.photo) ? item.photo[0].url : item.photo.url
                        }
                        className="card-img-top"
                        alt={item.title}
                      />
                    </div>

                    <div
                      className="card-body mt-1 px-1"
                      style={{ fontFamily: "Jost Variable" }}
                    >
                      <h2
                        className="card-title fw-normal text-dark text-start"
                        style={{ fontSize: "22px" }}
                      >
                        {item.title}
                      </h2>
                      <p
                        className="card-text text-muted p-0 mb-0 text-start"
                        style={{ fontSize: "12px" }}
                      >
                        <span className="badge bg-success text-start">
                          Free delivery
                        </span>{" "}
                        on ₹599+
                      </p>

                      <ProductCardClient id={item.id} product={item} />
                      <p className="fw-medium text-dark fs-6 mb-0 mt-2 ms-0 text-start">
                        Rs. {item.price}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="col-12 text-center fs-5">
              {term ? "No products found." : "Enter a search term."}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
