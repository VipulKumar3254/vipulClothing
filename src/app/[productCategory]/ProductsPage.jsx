import { db } from "@/firebaseConfig";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import Filters from "./Filters";
import "@/styles/productDisplay.module.css"
import Link from "next/link";
import ProductCardClient from "./ProductCardClient";
import { Suspense } from "react";

// 🔹 Fetch products from Firestore with proper handling
async function getProducts(params, filters = {}) {
   const category = params?.category;
  const constraints = [];

  if (category) {
    constraints.push(where("category", "array-contains", category));
  }

  // Price filters
  if (filters.minPrice) {
    constraints.push(where("price", ">=", Number(filters.minPrice)));
  }
  if (filters.maxPrice) {
    constraints.push(where("price", "<=", Number(filters.maxPrice)));
  }

  // Sorting
  if (filters.sort === "price-asc") {
    constraints.push(orderBy("price", "asc"));
  } else if (filters.sort === "price-desc") {
    constraints.push(orderBy("price", "desc"));
  } else if (filters.sort === "newest") {
    constraints.push(orderBy("createdAt", "desc")); // assumes you have createdAt field
  }

  // Build query properly
  const q = query(collection(db, "products"), ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
// 🔹 Products Page
export default async function ProductsPage({ category, searchParams }) {
  // Extract filters from searchParams
  const filters = {
    sort: searchParams?.sort || "",
    minPrice: searchParams?.minPrice || "",
    maxPrice: searchParams?.maxPrice || "",
  };

  const products = await getProducts(category, filters);

  return (
    <>
      <div className="row ">
        <div className="col-12" >
             <Suspense fallback={null}>
        <Filters />
      </Suspense>
          {/* <Filters /> */}
        </div>
        {/* Filters component */}

        <div className=" col-12 mt-3 px-1">
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
                            Array.isArray(item.photo)
                              ? item.photo[0]
                              : item.photo
                          }
                          className="card-img-top"
                          alt={item.title}
                        />
                      </div>

                      <div
                        className="card-bod mt-1 px-2"
                        style={{ fontFamily: "Jost Variable" }}
                      >
                        <h2
                          className="card-title fw-normal text-dark text-start title "
                          
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
                No products available.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
